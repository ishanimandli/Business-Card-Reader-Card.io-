import React, { Component } from 'react';
import { getCardData,cardFromCompany } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import CardModal from '../CardModalComponent/CardModalComponent.js'
import HeaderComponent from '../HeaderComponent/HeaderComponent.js'



export default class UserPageComponent extends Component{
	
	constructor(props) {
		super(props)
		this.state = {
			listOfcards: [],
			logoutFlage: false,
			recordSelected: false,
			searchName: "",	
			company_list: [],
			clickedProfile: false,
			showModal: false,
			cardId: ""
		}
		this.handleCloseModal = this.handleCloseModal.bind(this)
		// this.handleScanClick = this.handleScanClick.bind(this)
	}
	
	componentDidMount() {
		this.fetchAllCards()
	}

	async fetchAllCards() {
		const response = await getCardData()
		// console.log(response)
		if(response.status == 403){
			window.location.href='/'
		}
		if(response.status === 200){
			
			this.setState({
				listOfcards: response.data,
				company_list: response.company_list
			})
			// console.log(response.company_list)
			this.originalCardList = this.state.listOfcards
		} else {
			this.setState({listOfcards: []})
		}
	}
	handleRecordClick(evt,cid){
		if(evt){
			console.log('CLicked')
			this.setState({
				showModal: true,
				cardId: cid
			})
			}
			console.log(this.state.cardId)
		}
	
	handleLogoutClick(evt){
		if(evt){
			localStorage.removeItem('token');
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
	handleCancleClick(evt){
		if(evt){
			this.setState({
				listOfcards: this.originalCardList,
				searchName: ""
				
			})
		}
	}
	async handleSelectedValue(evt){
		if(evt){
			if(evt.target.value != 'null'){
				const response = await cardFromCompany(evt.target.value)
				if(response.status == 403){
					window.location.href='/'
				}
				this.setState({
					listOfcards: response.searchData
				})
			}
		}
	}

	showCompanyList(){
		const companies = this.state.company_list
		// console.log(companies)
		return (
		<div>
			<select onChange={(evt) => {this.handleSelectedValue(evt)}}>
				<option key='None' value='null'></option>
				{companies && companies.length > 0 &&
				companies.map(company => {
					return <option key={company} value={company}>{company}</option>
				}) }
			</select>
		</div>)
	}
	
	handleCloseModal(){
		this.setState({
			showModal: false,
		})
		this.fetchAllCards()
		// console.log(this.state.showModal)
	}
	handleNewClick(evt){
		if(evt){
			window.location.href = '/#/newCard'
		}
	}
	render(){
		if(this.state.logoutFlage){
			return <Redirect to = "/" />
		}
		if(this.state.clickedProfile){
			return <Redirect to = "/userProfile" />
		}
		return (<div>
					<HeaderComponent user={localStorage.getItem('name')}></HeaderComponent>
					<div className="login-page">
						<div className="form">
							<div>
								<input type='text' value={this.state.searchName} 
										placeholder='Search'
										onChange={(evt) => this.handleSearchNameChange(evt)} />
								<button onClick={(evt) => {this.handleCancleClick(evt)}}>Cancle</button>
							</div>
							<button onClick={(evt) => {this.handleNewClick(evt)}}>+</button>
							
							{this.showCompanyList()}
							<h1>Names</h1>
							<ul>
							{(this.state.listOfcards
								.filter(card => card.name.toLowerCase().includes(this.state.searchName))
								.map(cardToShow => <li key={cardToShow.id} 
														onClick={(evt) => this.handleRecordClick(evt,cardToShow.id)}>
														{cardToShow.name}
														</li>)
							)}
							</ul>
							{this.state.showModal && <CardModal card_id={this.state.cardId} showCardModal={this.state.showModal} onCloseModal={this.handleCloseModal}/>}
						</div>
					
					</div>
					{/* <div><a onClick={(evt) => {this.setState({clickedProfile:true})}}>Your Profile</a></div>
					<div><button onClick={(evt) => this.handleLogoutClick(evt)}>Logout</button></div> */}
					
				</div>)
	}
	
}

