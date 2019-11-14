import React, { Component } from 'react';
import { getCardData } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { Popup } from 'react-popup'


export default class UserPageComponent extends Component{
	
	constructor(props) {
		super(props)
		this.state = {
			listOfcards: [],
			logoutFlage: false,
			recordSelected: false,
			searchName: ""
		}
	}

	componentDidMount() {
		this.fetchAllCards()
	}

	async fetchAllCards() {
		const response = await getCardData(localStorage.getItem('id'))
		if(response.status === 200){
			
			this.setState({listOfcards: response.data})
		} else {
			this.setState({listOfcards: []})
		}
	}

	showCardData(){
		const {listOfcards} = this.state
		return (<section>
			{listOfcards && listOfcards.length > 0 && 
			<div>
				{listOfcards.map(data => {
					console.log(data.id)
					console.log(data.name)
					 return <label key={data.id} onClick={(evt) => {this.handleRecordClick(evt)}}>{data.name}</label>
				})}
			</div>}
			{listOfcards && listOfcards.length === 0 && <div>No Cards available</div>}
		</section>)
	}
	handleRecordClick(evt){
		if(evt){
			this.setState({
				recordSelected: true
			})
		}
	}
	handleLogoutClick(evt){
		if(evt){
			localStorage.removeItem('id');
			localStorage.removeItem('cardUser');
			this.setState({logoutFlage: true})
		}
	}
	handleSearchNameChange(evt){
		if(evt){
			this.setState({
				searchName: evt.target.value
			})
		}
	}
	render(){
		if(this.state.logoutFlage){
			return <Redirect to = "/" />
		}
		return (<div>
					<div><button onClick={(evt) => this.handleLogoutClick(evt)}>Logout</button></div>
					
					<h1>Names</h1>
					{this.showCardData()}
					<Popup
          				open={this.state.recordSelected}
          				closeOnDocumentClick
          				onClose={(evt) => {this.setState({recordSelected: false})}}>
          				<div className="modal">
          					  <a className="close" onClick={(evt) => {this.setState({recordSelected: false})}}>
             					 &times;
           					 </a>
          						 Hello.............!!!!!!!!!
         				</div>
        			</Popup>
				</div>)
	}
	
}

