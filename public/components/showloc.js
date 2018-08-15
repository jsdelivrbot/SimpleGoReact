import React, {Component} from 'react'
import axios from "axios"
import {Link} from 'react-router-dom'


class ShowLoc extends Component {
	constructor(props){
		super(props)

		this.state = {places: {}}
		this.onClick = this.onClick.bind(this)
	}

	componentDidMount(){
		const {id} = this.props.match.params
		axios.get(`/loc/${id}`).then((response) => {
			this.setState({places: response.data})
		})
	}

	onClick(event){
		const {id} = this.props.match.params
		axios.delete(`/del/${id}`)
	}

	render() {
		console.log(this.state.places)
		return(
			<div>
				<h3>Location Data</h3>
				<div>
					<div>
						ID: {this.state.places.id}
					</div>

					<div>
						Location: {this.state.places.location}
					</div>
				</div>
				<div>
					<Link className="btn btn-primary" to='/'>
							Back
					</Link>
					<Link onClick={this.onClick} className="btn btn-primary" to='/'>
							Delete
					</Link>
				</div>
				<div>
				<Link className="btn btn-primary" to={'/updateloc/' + this.state.places.id}>
            Update
        </Link>
				</div>
			</div>
		)
	}
}

export default ShowLoc