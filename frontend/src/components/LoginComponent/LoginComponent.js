import React, { Component, useState } from 'react';
import { Redirect } from 'react-router-dom'

import './LoginComponent.scss'
import {
    Link
  } from 'react-router-dom'
import { userLogin } from '../../services/userService'

export default class LoginComponent extends Component {

    constructor (props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            redirect: false
        }
    }

    handleUserNameChange (ev) {
        if(ev) {
            this.setState({
                username: ev.target.value
            })
        }   
    }

    handlePasswordChange (ev) {
        if(ev) {
            this.setState({
                password: ev.target.value
            })
        }   
    }

    async onSubmit () {
        const {username, password} = this.state
        const formData = {username, password}
        const response = await userLogin(formData)
        if(response && response.status === 200) { 
            this.setState({redirect: true})
        } else {

        }
    }

    render() {
        const { redirect, showError } = this.state
        if(redirect) {
            return <Redirect
            to={{
              pathname: "/register"
            }}
          />
        }
        return(
            <div className="login-page">
                <div className="form">
                    <section className="form-title">Card.io</section>
                    <section className="login-form">
                    <input type="text" placeholder="username" value={this.state.username} onChange={(ev) => this.handleUserNameChange(ev)}/>
                    <input type="password" placeholder="password" value={this.state.password} onChange={(ev) => this.handlePasswordChange(ev)}/>
                    <button onClick={() => this.onSubmit()}>login</button>
                    <p className="message">Not registered? <Link to='/register'>Create an account</Link></p>
                    </section>
                </div>
                </div>
        )
    }
}