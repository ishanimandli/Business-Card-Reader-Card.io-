import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { userSignup } from '../../services/userService'
import { Redirect } from 'react-router-dom'
import HeaderComponent from '../HeaderComponent/HeaderComponent.js'
export default class RegistrationComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            fname: "",
            lname: "",
            username: "",
            password: "",
            email: "",
            phone: "",
            signedup: false
        }
    }
    
    handleFirstNameChange(event){
        if(event){
            this.setState({
                fname: event.target.value
            })
        }
    }
    handleLastNameChange(event){
        if(event){
            this.setState({
                lname: event.target.value
            })
        }
    }
    handleUsernameChange(event){
        if(event){
            this.setState({
                username: event.target.value
            })
        }
    }
    handlePasswordChange(event){
        if(event){
            this.setState({
                password: event.target.value
            })
        }
    }
    handleEmailChange(event){
        if(event){
            this.setState({
                email: event.target.value
            })
        }
    }
    handlePhoneNumberChange(event){
        if(event){
            this.setState({
                phone: event.target.value
            })
        }
    }

    async onCreate(event){
        const userInfo = this.state;
        if(userInfo.fname == ""){
            event.preventDefault()
            alert("Please enter your first name.")
        }
        if(userInfo.lname == ""){
            event.preventDefault()
            alert("Please enter your last name.")
        }
        if(userInfo.username == ""){
            event.preventDefault()
            alert("Please enter your username.")
        }
        if(userInfo.password == ""){
            event.preventDefault()
            alert("Please enter your password.")
        }
        if(userInfo.email == ""){
            event.preventDefault()
            alert("Please enter your email id.")
        }
        else{
            if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userInfo.email))){
                event.preventDefault()
                this.setState({
                    email:""
                })
                alert("Please enter valid email id.")
            }
        }
        if(userInfo.phone == ""){
            event.preventDefault()
            alert("Please enter your phone number.")
        }
        
        const response = await userSignup(userInfo);
        console.log(response)
    }
    render() {
        if(this.state.signedup){
            return <Redirect to = "/" />
        }
        return(
            <div>
                <HeaderComponent></HeaderComponent>
                <div className="login-page">
                <div className="form">
                    <section className="form-title">Card.io</section>
                    <div id='no-border-div' className='new-card-div login-form-div'>
                        <div className='new-card-form'>
                            <section>
                                <input type="text" 
                                    placeholder="first name" 
                                    value={this.state.fname} 
                                    onChange={(event) => this.handleFirstNameChange(event)}/>
                            </section>
                            <section>
                                <input type="text" 
                                    placeholder="last name" 
                                    value={this.state.lname} 
                                    onChange={(event) => this.handleLastNameChange(event)}/>
                            </section>
                            <section>
                                <input type="text" 
                                    placeholder="username" 
                                    value={this.state.username} 
                                    onChange={(event) => this.handleUsernameChange(event)}/>
                            </section>
                            <section>
                                <input type="password" 
                                    placeholder="password" 
                                    value={this.state.password} 
                                    onChange={(event) => this.handlePasswordChange(event)}/>
                            </section>
                            <section>
                                <input type="text" 
                                    placeholder="email address" 
                                    value={this.state.email} 
                                    onChange={(event) => this.handleEmailChange(event)}/>
                            </section>
                            <section>
                                <input type="text" 
                                    placeholder="phone number" 
                                    value={this.state.phone} 
                                    onChange={(event) => this.handlePhoneNumberChange(event)}/>
                            </section>
                            <section className='button-div'>
                                <button onClick={(event) => this.onCreate(event)}>create</button>
                            </section>
                        </div>
                    </div>    
                </div>
                </div>
            </div>
            
        )
    }
}