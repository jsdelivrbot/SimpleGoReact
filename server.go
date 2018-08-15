package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/satori/go.uuid"
)

var db *sql.DB

func init() {
	var err error

	db, err = sql.Open("postgres", "postgres://postgres:password@localhost/postgres?sslmode=disable")

	if err != nil {
		panic(err)
	}

	if err = db.Ping(); err != nil {
		panic(err)
	}

	fmt.Println("You connected to your database.")
}

// Res: Temporary result struct
type Res struct {
	Term string `json:"term"`
}

type Place struct {
	ID       string `json:"id,omitempty"`
	Location string `json:"location,omitempty"`
}

func main() {
	r := mux.NewRouter()

	bs := http.FileServer(http.Dir("public"))
	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", bs))

	fs := http.FileServer(http.Dir("static"))
	r.Handle("/", fs)

	r.HandleFunc("/show", show)
	r.HandleFunc("/db", getDB)

	r.HandleFunc("/loc/{id}", getLoc)
	r.HandleFunc("/del/{id}", delLoc)
	r.HandleFunc("/updateloc/{id}", updateLoc)

	log.Println("Listening 3000")
	if err := http.ListenAndServe(":3000", r); err != nil {
		panic(err)
	}
}

func show(w http.ResponseWriter, r *http.Request) {
	var word Res

	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&word)
	fmt.Println(word.Term)
	u := uuid.Must(uuid.NewV4())

	_, err = db.Exec("INSERT INTO places (id, location) VALUES ($1, $2)", u, word.Term)
	if err != nil {
		panic(err)
	}

}

func getDB(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}
	rows, err := db.Query("SELECT * FROM places ORDER BY location")
	if err != nil {
		panic(err)
	}
	var places []Place
	var plc Place
	for rows.Next() {
		err := rows.Scan(&plc.ID, &plc.Location)
		if err != nil {
			http.Error(w, http.StatusText(500), 500)
			return
		}

		places = append(places, plc)
	}
	json.NewEncoder(w).Encode(places)
}

func getLoc(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}
	var plc Place
	plc.ID = strings.TrimPrefix(r.URL.Path, "/loc/")
	rows, err := db.Query("SELECT location FROM places WHERE id = $1", plc.ID)
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		err = rows.Scan(&plc.Location)
	}
	fmt.Println(plc.Location)
	json.NewEncoder(w).Encode(&plc)

}

func delLoc(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	id := strings.TrimPrefix(r.URL.Path, "/del/")
	fmt.Println(id)
	_, err := db.Exec("DELETE FROM places WHERE id = $1", id)
	if err != nil {
		panic(err)
	}
}

func updateLoc(w http.ResponseWriter, r *http.Request) {
	var word Res

	if r.Method != "PATCH" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&word)
	fmt.Println(word.Term)
	id := strings.TrimPrefix(r.URL.Path, "/updateloc/")
	fmt.Println(id)

	_, err = db.Exec("UPDATE places SET location = $1 WHERE id = $2", word.Term, id)
	if err != nil {
		panic(err)
	}

}
