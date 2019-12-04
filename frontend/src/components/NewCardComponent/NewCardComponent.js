import React, { Component } from 'react';
import { loadNewCardData,saveNewCard } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import HeaderComponent from '../HeaderComponent/HeaderComponent.js'
import './NewCardComponent.scss'


export default class NewCardComponent extends Component{
	constructor(props){
		super(props)
		this.state = {
			fname: "",
			lname: "",
			phone_number: [],
			email_id: [],
			newCard: false,
			loading: false,
			image: "",
			jobTitle: "",
			company: "",
			description: ""
		}
	}
	
	async loadCardData(evt){
		if(evt){
			this.setState({
				loading: true
			})
			const formData = new FormData()
			formData.append('file',this.uploadInput.files[0])
			const reader = new FileReader()
			reader.onload = () =>{
				this.setState({image: reader.result})
			}
			const data = reader.readAsDataURL(this.uploadInput.files[0])
			this.uploadInput.value = ''
			const response = await loadNewCardData(formData)
			const name = response.data.name.split(" ")
			console.log(response.data)
			this.setState({
				fname: name[0],
				lname: name[1],
				phone_number: response.data.phones,
				email_id: response.data.emails,
				jobTitle: response.data.jobTitle,
				newCard: true,
				loading: false

			})
		}
	}
	handlePhoneChange(index,evt){
        if(evt){
            const list = this.state.phone_number
            for(const phone of list){
                if(phone.phone_id == index){
                    phone.phone_num = evt.target.value
                }
            }
            this.setState({
                phone_number: list,
                })
        }
        console.log(this.state.phone_number)
    }
    handleEmailChange(index,evt){
        if(evt){
            const list = this.state.email_id
            for(const email of list){
                if(email.id == index){
                    email.email_id = evt.target.value
                }
            }
            this.setState({
                email_id: list,
                })
        }
        console.log(this.state.email_id)
	}
	handleChange(fieldName, newData) {
        this.setState({
            [fieldName]: newData,
			});
		// console.log(this.state)
    }
	async handleSaveChanges(evt){
		if(evt){
			const {fname,lname,phone_number,email_id,jobTitle,company,description} = this.state
			const formData = {fname,lname,phone_number,email_id,jobTitle,company,description}
			const response = await saveNewCard(formData)
			if(response.status == 200){
				this.setState({
					fname: "",
					lname: "",
					phone_number: [],
					email_id: [],
					newCard: false,
					loading: false
	
				})
				if(!confirm('Do you want to add more cards?')){
					window.location.href = '/userPage'
				}
			}
		}
	}
    render(){
        return (
			<div>
				<HeaderComponent user={localStorage.getItem('name')}></HeaderComponent>
				<div className='login-form'>
				<div className='form'>
				<div>
					<input id='file-uploader-input'type="file" ref={(ref) => { this.uploadInput = ref; }}  ></input>
						<button onClick={(evt) => {this.loadCardData(evt)}}>Scan</button>
					
				</div>
				{this.state.loading && <i>Loading..</i>}
				<div className='new-card-div'>
					{this.state.newCard && <div>
						<div><img src= {this.state.image} width={500} height={300}/></div>
						<div className='new-card-form'>
							<div id='name-div'>
								<div>
									<p>First Name</p>
									<input type = 'text' value={this.state.fname} name='fname' 
											onChange={(evt) => {this.handleChange('fname',evt.target.value)}}/>
								</div>
								<div>
									<p>Last Name</p>
									<input type='text' value={this.state.lname} name='lname' 
											onChange={(evt) => {this.handleChange('lname',evt.target.value)}}/><br/>
								</div>
							</div>	
							
							<p>Phone number:</p>
							{this.state.phone_number.map(phone =>{
								// console.log(phone.phone_id)
								return <input key = {phone.phone_id} value={phone.phone_num} 
										onChange={(evt) => {this.handlePhoneChange(phone.phone_id,evt)}}/>
							})}
							<br/>
							<p>Email id:</p>
							{this.state.email_id.map(email =>{
								// console.log(email.id)
								return <input key = {email.id} value={email.email_id} 
										onChange={(evt) => {this.handleEmailChange(email.id,evt)}}/>
							})}
							<p>Job title:</p>
							<input type = 'text' value={this.state.jobTitle} name='jobTitle' 
									onChange={(evt) => {this.handleChange('jobTitle',evt.target.value)}}/><br/>
							<p>Company Name:</p>
							<input type = 'text' value={this.state.company} name='company' 
									onChange={(evt) => {this.handleChange('company',evt.target.value)}}/><br/>
							<p>Description:</p>
							<textarea 
								type="text" 
								value={this.state.description} 
								name = 'description'
								onChange={(evt) => this.handleChange('description', evt.target.value)}
							/>
							<button onClick={(evt) => {this.handleSaveChanges(evt)}}>Save</button>
						</div>
					</div>}
				
				</div>
				</div>
				
				
				
			</div>
			</div>
        )
    }
}