import React, {Component} from 'react'
import axios from "axios"
import {Link} from 'react-router-dom'

import ShowLoc from './showloc'

class UpdateLoc extends ShowLoc{
    constructor(props){
        super(props)

        this.state= {
            term: '',
            places: {}
        }

        this.onInputChange = this.onInputChange.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    componentDidMount() {
        const {id} = this.props.match.params
		axios.get(`/loc/${id}`).then((response) => {
			this.setState({places: response.data})
		})
    }

    onInputChange(event) {
        this.setState({term: event.target.value})
      }

    onClick(event) {
        event.preventDefault()
        const {id} = this.props.match.params
        axios.patch(`/updateloc/${id}`, {term: this.state.term}).then(() => {
            this.props.history.push('/')
        })
      }

    render(){
        return(
          <div>
            <form onSubmit={this.onClick} className="input-group">
                <input
                placeholder={this.state.places.location}
                className="form-control"
                value={this.state.term}
                onChange={this.onInputChange}/>
                <span className="input-group-btn">
                <button type="submit" className="btn btn-secondary">Submit</button>
                </span>
            </form>
            <div>
			    		<Link className="btn btn-primary" to={'/loc' + this.state.places.id}>
                 Cancel
              </Link>
						</div>
          </div>
        )
      }
}

export default UpdateLoc