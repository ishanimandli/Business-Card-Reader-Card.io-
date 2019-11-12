import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import LoginComponent from './components/LoginComponent/LoginComponent'
import RegistrationComponent from './components/RegistrationComponent/RegistrationComponent'
import NotFoundComponent from './components/NotFoundComponent/NotFoundComponent'
import './App.scss'

const App = () => (
    <Router>
        <Switch>
          <Route exact path='/' component={LoginComponent}></Route>
          <Route exact path='/login' component={LoginComponent}></Route>
          <Route exact path='/register' component={RegistrationComponent}></Route>
          <Route component={NotFoundComponent}></Route>
        </Switch>
      </Router>
)

export default App;