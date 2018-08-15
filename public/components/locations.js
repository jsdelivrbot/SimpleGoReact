import React, {Component} from 'react';
import axios from "axios"
import _ from 'lodash'
import {Link} from 'react-router-dom'

class Locations extends Component {
  constructor(props) {
    super(props)

    this.state = {
      places: {}
    }
    this.renderLocations = this.renderLocations.bind(this)
  }

  componentWillMount() {
    axios.get('/db').then((response) => {
      this.setState({places: response})
    })
  }

  renderLocations() {
    console.log(this.state)
    return _.map(this.state.places.data, (place) => {
      return (
        <li className="list-group-item" key={place.id}>
          <Link to={`loc/${place.id}`}>
            {place.location}
          </Link>
        </li>
      )
    })
  }

  render(){
    return(
      <div>
        <h1>Welcome to Fake Reddit</h1>
        <Link className="btn btn-primary" to='/loc/new'>
            Add a Post
        </Link>
        <div>
          <ul className='list-group'>
            {this.renderLocations()}
          </ul>
        </div>
      </div>
    )
  }
};

export default Locations