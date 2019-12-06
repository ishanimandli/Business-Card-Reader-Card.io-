import React, { Component } from 'react';
import { getUserProfile,setUserProfile,updatePassword } from '../../services/userService'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import HeaderComponent from '../HeaderComponent/HeaderComponent.js'
import './UserProfileComponent.scss'
export default class Profile extends Component{
    constructor(props){
        super(props)
        this.state={
            fname: "",
            lname: "",
            phone: "",
            email: "",
            contentChanged: false,
            username: "",
            oldPassword: "",
            newPassword: "",
            openPasswordModal: false
        }
        this.handleChangePassword = this.handleChangePassword.bind(this)
        // this.handleUpdatePassword = this.handleUpdatePassword.bind(this)
    }
    
    componentDidMount(){
        this.showUserProfile();
    }
    async showUserProfile(){
        const response = await getUserProfile()
        if(response.status == 403){
			window.location.href='/'
		}
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
            const formData = {fname,lname,email,phone,id}

            const flag = this.validateFormData(formData)
            if(flag){
                const response = await setUserProfile(formData)
                if(response.status == 403){
                    window.location.href='/'
                }
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
    handleChangePassword(){
        this.setState({
            openPasswordModal: true
        })
    }
    handleUsernameChange(evt){
        if(evt){
            this.setState({
                username: evt.target.value
            })
        }
    }
    handleOldPasswordChange(evt){
        if(evt){
            this.setState({
                oldPassword: evt.target.value
            })
        }
    }
    handleNewPasswordChange(evt){
        if(evt){
            this.setState({
                newPassword: evt.target.value
            })
        }
    }
    async handleUpdatePassword(evt){
        const { username,oldPassword,newPassword } = this.state
        const response = await updatePassword({ username,oldPassword,newPassword })
        console.log(response)
        if(response.status == 200){
            this.setState({
                openPasswordModal: false,
                username: "",
                oldPassword: "",
                newPassword: ""
            })
        }
        else{
            evt.preventDefault()
            alert(response.message)
            this.setState({
                openPasswordModal: true,
                username: "",
                oldPassword: "",
                newPassword: ""
            })
            
        }
    }    
    handleCloseModal(evt){
        if(evt){
            this.setState({
                openPasswordModal:false
            })
        }
    }
    render(){
        return (
            <div>
                 <HeaderComponent user={localStorage.getItem('name')}></HeaderComponent>
                 <div className='login-form'>
                    <div className='form'>
                        <div id='no-border-div' className='new-card-div'>
                            <div className='new-card-form'>
                                <section>
                                    <span>First name</span>
                                    <input type='text' 
                                        value={this.state.fname} 
                                        onChange={(evt) =>{this.handleFirstNameChange(evt)}}/>
                                </section>
                                <section>
                                    <span>Last name</span>
                                    <input type='text' 
                                        value={this.state.lname} 
                                        onChange={(evt) =>{this.handleLastNameChange(evt)}}/><br/>
                                </section>
                                <section>
                                    <span>Phone number</span>
                                    <input type='text' 
                                        value={this.state.phone} 
                                        onChange={(evt) =>{this.handlePhoneChange(evt)}}/>
                                </section>
                                <section>
                                    <span>Email id</span>
                                    <input type='email' 
                                        value={this.state.email} 
                                        onChange={(evt) =>{this.handleEmailChange(evt)}}/>
                                </section>
                                <section>
                                    <span>Do you want to <a className='profile-focus' onClick={this.handleChangePassword}>change password</a>?</span>
                                </section>
                                <section className='button-div'>
                                    <button disabled = {!this.state.contentChanged} 
                                        onClick = {(evt) => {this.handleSaveProfile(evt)}}>
                                            Save Cahnges
                                    </button>
                                </section>   
                            </div>
                            
                            <ReactModal isOpen={this.state.openPasswordModal}>
                                    <div>
                                        <div className="cross" onClick={(evt) =>{this.handleCloseModal(evt)}}>X</div>
                                    </div>
                                <div id='no-border-div' className='new-card-div'>
                                    
                                    <div className='new-card-form'>
                                        <section>
                                            <span>Username</span>
                                            <input type="text" 
                                                value={this.state.username} 
                                                onChange={(evt) => this.handleUsernameChange(evt)}/>
                                        </section>
                                        <section>
                                            <span>Old password</span>
                                            <input type="password" 
                                                value={this.state.oldPassword} 
                                                onChange={(evt) => this.handleOldPasswordChange(evt)}/>
                                        </section>
                                        <section>
                                            <span>New password</span>
                                            <input type="password" 
                                                value={this.state.newPassword} 
                                                onChange={(evt) => this.handleNewPasswordChange(evt)}/>
                                        </section>
                                        <section className='button-div'>
                                            <button onClick={(evt) => {this.handleUpdatePassword(evt)}}>
                                                Update password
                                            </button>
                                        </section>
                                    </div>
                                </div>
                                 
                                    
                            
                            </ReactModal>
                        </div>
                        
                    </div>
            </div>
            </div>
            
        )
    }
}