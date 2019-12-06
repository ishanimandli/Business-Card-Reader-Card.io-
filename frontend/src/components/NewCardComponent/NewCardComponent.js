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
				company: response.data.company,
				newCard: true,
				loading: false

			})
			console.log(this.state.email_id)
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
        // console.log(this.state.phone_number)
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
        // console.log(this.state.email_id)
	}
	handleNewEmailChange(evt){
		if(evt){
			this.setState({
				email_id: [{'email_id': evt.target.value}]
			})
		}
	}
	handleNewPhoneChange(evt){
		if(evt){
			this.setState({
				phone_number: [{'phone_num': evt.target.value}]
			})
		}
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
					window.location.href = '/#/userPage'
				}
			}
		}
	}
	handleCancelClick(evt){
		if(evt){
			this.setState({
				newCard: false
			})
		}
	}
    render(){
        return (
			<div>
				<HeaderComponent user={localStorage.getItem('name')}></HeaderComponent>
				<div className='login-form'>
				<div className='form'>
				<div className='upload-div'>
					<input id='file-uploader-input'type="file" ref={(ref) => { this.uploadInput = ref; }}  
						onClick={(evt) => {this.setState({newCard:false})}}/>
						<button onClick={(evt) => {this.loadCardData(evt)}}>Scan</button>
					
				</div>
				{this.state.loading && <i>Loading..</i>}
				
					{this.state.newCard && <div className='new-card-div'>
						<div><img src= {this.state.image} width={470} height={250}/></div>
						<div className='new-card-form'>
							<section>
								<span> First name</span>
								
									<input type = 'text' value={this.state.fname} name='fname' 
												onChange={(evt) => {this.handleChange('fname',evt.target.value)}}/>
								
							</section>
							<section>
								<span>Last name</span>
									
										<input type='text' value={this.state.lname} name='lname' 
													onChange={(evt) => {this.handleChange('lname',evt.target.value)}}/>
									
							</section>
							<section>
								<span>Phone number</span>
								{(this.state.phone_number.length>0)?
										this.state.phone_number.map(phone =>{
											// console.log(phone.phone_id)
											return <input key = {phone.phone_id} value={phone.phone_num} 
													onChange={(evt) => {this.handlePhoneChange(phone.phone_id,evt)}}/>
										}):
										<input key='np'onChange={(evt) => {this.handleNewPhoneChange(evt)}}/>
								}
								<br/>
							</section>
							<section>
							<span>Email id</span>
								{(this.state.email_id.length > 0)?
										this.state.email_id.map(email =>{
											// console.log(email.id)
											return <input key = {email.id} value={email.email_id} 
													onChange={(evt) => {this.handleEmailChange(email.id,evt)}}/>
										}):
										<input key='ne'onChange={(evt) => {this.handleNewEmailChange(evt)}}/>
								}
								<br/>
							</section>
							<section>
								<span>Job title</span>
								<input type = 'text' value={this.state.jobTitle} name='jobTitle' 
										onChange={(evt) => {this.handleChange('jobTitle',evt.target.value)}}/><br/>
							</section>
							<section>
								<span>Company Name</span>
								<input type = 'text' value={this.state.company} name='company' 
										onChange={(evt) => {this.handleChange('company',evt.target.value)}}/><br/>
							</section>
							<section >
								<span>Description</span>
								<textarea 
									type="text" 
									value={this.state.description} 
									name = 'description'
									onChange={(evt) => this.handleChange('description', evt.target.value)}
								/><br/>
							</section>
							<section className='button-div'>
								<button onClick={(evt) => {this.handleSaveChanges(evt)}}>Save</button>
								<button onClick={(evt) => {this.handleCancelClick(evt)}}>Cancel</button>
							</section>
						</div>
					</div>}
				</div>
			</div>
			</div>
        )
    }
}