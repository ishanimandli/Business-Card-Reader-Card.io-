import React, { Component } from 'react';
import { getUserProfile,setUserProfile } from '../../services/userService'
import { Link } from 'react-router-dom'

export default class Profile extends Component{
    constructor(props){
        super(props)
        this.state={
            fname: "",
            lname: "",
            phone: "",
            email: "",
            contentChanged: false
        }
    }
    
    componentDidMount(){
        this.showUserProfile();
    }
    async showUserProfile(){
        const response = await getUserProfile(localStorage.getItem('id'))
        console.log(response.info)
        this.setState({
            fname: response.info.fname,
            lname: response.info.lname,
            phone: response.info.phone,
            email: response.info.email
        })
    }
    handleEmailChange(evt){
        if(evt){
            this.setState({
                email: evt.target.value,
                contentChanged: true
            })
        }
    }
    handleFirstNameChange(evt){
        if(evt){
            this.setState({
                fname: evt.target.value,
                contentChanged: true
            })
        }
    }
    handleLastNameChange(evt){
        if(evt){
            this.setState({
                lname: evt.target.value,
                contentChanged: true
            })
        }
    }
    handlePhoneChange(evt){
        if(evt){
            this.setState({
                phone: evt.target.value,
                contentChanged: true
            })
        }
    }
    async handleSaveProfile(evt){
        if(evt){
            evt.preventDefault()
            const { fname,lname,email,phone } = this.state
            const id = localStorage.getItem('id')
            const formData = {fname,lname,email,phone,id}

            const flag = this.validateFormData(formData)
            if(flag){
                const response = await setUserProfile(formData)
                if(response.status == 200){
                    this.setState({
                        contentChanged: false
                    })
                }
            }
        }
    }
    validateFormData(formData){
        let flag = true
        if(formData.fname == "")
        {
            alert('Please enter your first name.')
            flag = false
        }
        if(formData.lname == "")
        {
            alert('Please enter your last name.')
            flag = false
        }
        if(formData.email == "")
        {
            alert('Enter your email.')
            flag = false
        }
        if(formData.phone == "")
        {
            alert('Please enter your phone number.')
            flag = false
        }
        return flag
    }
    render(){
        return (
            <div>
                <form>
                    <label>Name:</label>
                    <input type='text' value={this.state.fname} onChange={(evt) =>{this.handleFirstNameChange(evt)}}></input>
                    <input type='text' value={this.state.lname} onChange={(evt) =>{this.handleLastNameChange(evt)}}></input><br/>
                    <label>Phone number:</label>
                    <input type='text' value={this.state.phone} onChange={(evt) =>{this.handlePhoneChange(evt)}}></input><br/>
                    <label>Email id:</label>
                    <input type='email' value={this.state.email} onChange={(evt) =>{this.handleEmailChange(evt)}}></input><br/>
                    <p>Do you want to <a>change password</a>?</p>
                    <button disabled = {!this.state.contentChanged} onClick = {(evt) => {this.handleSaveProfile(evt)}}>Save Cahnges</button>
                </form>
            </div>
        )
    }
}