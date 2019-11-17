import React, { Component } from 'react';
import { getCard } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import ReactModal from 'react-modal'
ReactModal.setAppElement('#root');
export default class CardModal extends Component{
    constructor(props){
        super(props)
        this.state = {
            fname: "",
            lname: "",
            phones: [],
            emails: [],
            jobTitle: "",
            companyName: "",
            description: "",
            showModal: this.props.showCardModal
        }
        this.handleCloseModal = this.handleCloseModal.bind(this)
    }
    componentDidMount(){
        console.log('componentDidMount')
        this.showCardData()

    }
    async showCardData(){
        console.log(this.props.showCardModal)
        if(this.props.showCardModal){
            console.log(this.props.card_id)
            const response = await getCard(this.props.card_id)
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
    handleCloseModal(){
        this.setState({
            showCardModal: false
        })
        
    }
    render(){
        return (
            <div>
                <ReactModal 
						isOpen={this.props.showCardModal}
						contentLabel="Minimal Modal Example">
                        
							<div>
								<p>Name: </p>
								<input type="text" defaultValue={this.state.fname} onChange={this.handlefnameChange(evt)}></input>
								<input type="text" defaultValue={this.state.lname} onChange={this.handlelnameChange(evt)}></input>
								<p>Phone number:</p>
								{this.state.phones.map((phone,index) =>{
									return<input key={index} type="text" defaultValue={phone} onChange={this.handlePhoneChange(evt)}></input>
								})}
								<br/>
								<p>Email id:</p>
								{this.state.emails.map((email,index) =>{
									return<input key={index} type="email" defaultValue={email} onChange={this.handleEmailChange(evt)}></input>
								})}
								<br/>
                                <p>Company name:</p>
                                <input type="text" defaultValue={this.state.companyName} onChange={this.handleCompanyChange(evt)}></input>
                                <br/>				
                                <p>Job title:</p>
								<input type="text" defaultValue={this.state.jobTitle} onChange={this.handleJobTitleChange(evt)}></input>
                                <br/>
                                <p>Description:</p>
                                <textarea type="text" defaultValue={this.state.description} onChange={this.handleDiscChange(evt)}></textarea>
                                <br/>
                                <button onClick={this.handleCloseModal}>Close Modal</button>
							</div>
					</ReactModal>
            </div>
        )
    }
}