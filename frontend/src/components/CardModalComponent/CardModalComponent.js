import React, { Component } from 'react';
import { getCard,updateCard,deleteCard } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import ReactModal from 'react-modal'
ReactModal.setAppElement('#root');
export default class CardModal extends Component{
    constructor(props){
        super(props)

        this.state = {
            cardData: {},
            dataChanged: false
        };

        this.state = {
            fname: "",
            lname: "",
            phones: [],
            emails: [],
            jobTitle: "",
            companyName: "",
            description: "",
            dataChanged: false,
            card_id: this.props.card_id

        }
        this.handleCloseModal = this.handleCloseModal.bind(this)
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.showCardData()
    }

    async showCardData(){
        console.log(this.props.showCardModal)
        if(this.props.showCardModal){
            console.log(this.props.card_id)
            const response = await getCard(this.state.card_id)
            if(response.status == 403){
                window.location.href='/'
            }
            // this.setState({cardData: response.cardData});
            this.setState({
                fname: response.cardData.fname,
                lname: response.cardData.lname,
                phones: response.cardData.phones,
                emails: response.cardData.emails,
                jobTitle: response.cardData.jobTitle,
                companyName: response.cardData.company,
                description: response.cardData.description
            })
        }
        
    }
    // TODO
    handleFieldChange(fieldName, newValue) {
        this.setState({
            [fieldName]: newValue,
            dataChanged: true
        });
    }

    handlePhoneChange(evt,index){
        if(evt){
            const list = this.state.phones
            for(const phone of list){
                if(phone.phone_id == index){
                    phone.phone_num = evt.target.value
                }
            }
            this.setState({
                phones: list,
                dataChanged: true
            })
        }
        console.log(this.state.phones)
    }
    handleEmailChange(evt,index){
        if(evt){
            const list = this.state.emails;
            for(const email of list){
                if(email.id == index){
                    email.email_id = evt.target.value
                }
            }
            this.setState({
                emails: list,
                dataChanged: true
            })
        }
        console.log(this.state.emails)
    }
    handleCloseModal(){
        this.props.onCloseModal()
    }
    async handleUpdateData(evt){
        if(evt){
            const {fname,lname,phones,emails,jobTitle,companyName,description,card_id} = this.state
            console.log({fname,lname,phones,emails,jobTitle,companyName,description,card_id})
            const response = await updateCard({fname,lname,phones,emails,jobTitle,companyName,description,card_id})
            // console.log(response)
            if(response.status == 403){
                window.location.href='/'
            }
            if(response.status == 200){
                this.setState({
                    dataChanged: false
                })
                alert(response.message)
            }
        }   
    }
    async handleDeleteCard(evt){
        if(evt){
            const { card_id } = this.state
            const response = await deleteCard({ card_id })
            if(response.status == 403){
                window.location.href='/'
            }
            this.props.onCloseModal()
        }
        
    }
    render(){
        // const { fname, lname } = this.state.cardData;
        return (
            <div>
                <ReactModal 
						isOpen={this.props.showCardModal}
						>
                        
							<div>
								<p>Name: </p>
								<input
                                    type="text"
                                    defaultValue={this.state.fname}
                                    // onChange={(evt) => this.handlefnameChange(evt)}

                                    onChange={(evt) => this.handleFieldChange('fname', evt.target.value)}
                                />
                                <input 
                                    type="text" 
                                    defaultValue={this.state.lname} 
                                    onChange={(evt) => this.handleFieldChange('lname', evt.target.value)}
                                />
								<p>Phone number:</p>
								{this.state.phones.map(phone =>{
									return<input key={phone.phone_id} type="text" value={phone.phone_num} onChange={(evt) => this.handlePhoneChange(evt,phone.phone_id)}></input>
								})}
								<br/>
								<p>Email id:</p>
								{this.state.emails.map(email =>{
									return<input key={email.id} type="email" value={email.email_id} onChange={(evt) => this.handleEmailChange(evt,email.id)}></input>
								})}
								<br/>
                                <p>Company name:</p>
                                <input 
                                    type="text" 
                                    value={this.state.companyName} 
                                    onChange={(evt) => this.handleFieldChange('companyName', evt.target.value)}
                                />
                                <br/>				
                                <p>Job title:</p>
                                <input 
                                    type="text" 
                                    value={this.state.jobTitle} 
                                    onChange={(evt) => this.handleFieldChange('jobTilte', evt.target.value)}
                                />
                                <br/>
                                <p>Description:</p>
                                <textarea 
                                    type="text" 
                                    value={this.state.description} 
                                    onChange={(evt) => this.handleFieldChange('description', evt.target.value)}
                                />
                                <br/>
                                <button onClick={this.handleCloseModal}>Close Modal</button>
                                <button disabled={!this.state.dataChanged} onClick={(evt) => {this.handleUpdateData(evt)}}>Update</button>
                                <button onClick={(evt) =>{ if (window.confirm('Are you sure you wish to delete this item?')) this.handleDeleteCard(evt)}}>Delete Card</button>
							</div>
					</ReactModal>
            </div>
        )
    }
}