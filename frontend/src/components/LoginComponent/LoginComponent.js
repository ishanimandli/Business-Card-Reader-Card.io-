import React, { Component, useState } from 'react';
import { Redirect } from 'react-router-dom'

import './LoginComponent.scss'
import { Link } from 'react-router-dom'
import { userLogin } from '../../services/userService'

export default class LoginComponent extends Component {

    constructor (props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            redirect: false
        }
        localStorage.clear()
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

    async onSubmit (event) {
        const {username, password} = this.state
        const formData = {username, password}
        if(formData.username == ""){
            event.preventDefault()
            alert("Please enter your username.")
        }
        if(formData.password == ""){
            event.preventDefault()
            alert("Please enter your password.")
        }
        const response = await userLogin(formData)
    
        if(response && response.data.status === 200) { 
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name',response.data.name);
            this.setState({redirect: true})
        } else {
            alert(response.data.message)
            window.location.href = '/'
        }
    }

    render() {
        const { redirect, showError } = this.state
        if(redirect || localStorage.getItem('cardUser')) {
            return <Redirect
            to={{
              pathname: "/userPage"
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
                    <button onClick={(event) => this.onSubmit(event)}>login</button>
                    <p className="message">Not registered? <Link to='/register'>Create an account</Link></p>
                    </section>
                </div>
                </div>
        )
    }
}