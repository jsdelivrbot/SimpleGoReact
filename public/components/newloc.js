import React, {Component} from 'react'
import axios from "axios"
import {Link} from 'react-router-dom'

class NewLocation extends Component{
    constructor(props){
        super(props)

        this.state= {term: ''}

        this.onInputChange = this.onInputChange.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    onInputChange(event) {
        this.setState({term: event.target.value})
      }

    onClick(event) {
        event.preventDefault()
        axios.post('/show', {term: this.state.term}).then(() => {
            this.props.history.push('/')
        })
      }

    render(){
        return(
          <div>
            <form onSubmit={this.onClick} className="input-group">
                <input
                placeholder="Input1"
                className="form-control"
                value={this.state.term}
                onChange={this.onInputChange}/>
                <span className="input-group-btn">
                <button type="submit" className="btn btn-secondary">Submit</button>
                </span>
            </form>
            <div>
			    		<Link className="btn btn-primary" to={'/'}>
                 Cancel
              </Link>
						</div>
          </div>
        )
      }
}

export default NewLocation