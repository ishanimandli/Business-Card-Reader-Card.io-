import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import LoginComponent from './components/LoginComponent/LoginComponent'
import RegistrationComponent from './components/RegistrationComponent/RegistrationComponent'
import UserPageComponent from './components/UserPageComponent/UserPageComponent'
import UserProfileComponent from './components/UserProfileComponent/UserProfileComponent'
import NewCardComponent from './components/NewCardComponent/NewCardComponent'
import './App.scss'

const App = () => (
    <Router>
        <Switch>
          <Route exact path='/' component={LoginComponent}></Route>
          <Route exact path='/login' component={LoginComponent}></Route>
          <Route exact path='/register' component={RegistrationComponent}></Route>
          <Route exact path='/userPage' component={UserPageComponent}></Route>
          <Route exact path='/userProfile' component={UserProfileComponent}></Route>
          <Route exact path='/newCard' component={NewCardComponent}></Route>
        </Switch>
      </Router>
)

export default App;