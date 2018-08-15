import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Locations from './components/locations.js'
import NewLocation from './components/newloc.js'
import ShowLoc from './components/showloc.js'
import UpdateLoc from './components/updateloc.js'

ReactDOM.render(
    <BrowserRouter>
      <div>
        <Switch>
          <Route path='/loc/new' component={NewLocation} />
          <Route path='/loc/:id' component={ShowLoc} />
          <Route path='/updateloc/:id' component={UpdateLoc} />
          <Route path='/' component={Locations} />
        </Switch>
      </div>
    </BrowserRouter>
  , document.getElementById('root'));
