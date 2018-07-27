package main

import (
	"log"
	"net/http"
)

func main() {

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	bs := http.FileServer(http.Dir("public"))
	http.Handle("/public/", http.StripPrefix("/public/", bs))

	log.Println("Listening 3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		panic(err)
	}
}
