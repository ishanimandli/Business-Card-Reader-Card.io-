import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import LoginComponent from './components/LoginComponent/LoginComponent'
import RegistrationComponent from './components/RegistrationComponent/RegistrationComponent'
import UserPageComponent from './components/UserPageComponent/UserPageComponent'
import './App.scss'

const App = () => (
    <Router>
        <Switch>
          <Route exact path='/' component={LoginComponent}></Route>
          <Route exact path='/login' component={LoginComponent}></Route>
          <Route exact path='/register' component={RegistrationComponent}></Route>
          <Route exact path='/userPage' component={UserPageComponent}></Route>
        </Switch>
      </Router>
)

export default App;