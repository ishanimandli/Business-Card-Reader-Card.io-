import React, { Component } from 'react';
import { getCardData,cardFromCompany } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import CardModal from '../CardModalComponent/CardModalComponent.js'
import HeaderComponent from '../HeaderComponent/HeaderComponent.js'
import './UserPageComponent.scss'



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
			cardId: "",
			searchBy: true
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
				listOfcards: response.data.sort(function(a,b){
									if(a.name < b.name) { return -1; }
									if(a.name > b.name) { return 1; }
									return 0;
								}),
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
	handleCancelClick(evt){
		if(evt){
			this.setState({
				listOfcards: this.originalCardList,
				searchName: "",
				searchBy:true
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
		
			<select className='company-search'onChange={(evt) => {this.handleSelectedValue(evt)}}>
				<option ></option>
				{companies && companies.length > 0 &&
				companies.map(company => {
					return <option key={company} value={company}>{company}</option>
				}) }
			</select>
		)
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
	handleSearchBy(evt){
		if(evt){
			console.log(evt.target.value)
			if(evt.target.value === 'By Company'){
				this.setState({
					searchBy: false
				})
			}
			else{
				this.setState({
					searchBy: true
				})
			}
			console.log(this.state.searchBy)
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
							<div className='new-card-btn'>
								<button id='new-card'
										onClick={(evt) => {this.handleNewClick(evt)}}>
												+
								</button>
							</div>
						
							<div className='search-bar'>
								<select className='company-search' onChange={(evt) =>{ this.handleSearchBy(evt)}} defaultValue='name'>
									<option key='name'>
											By Name
									</option>
									<option key='company'>
											By Company
									</option>
								</select>
								{(this.state.searchBy) ? 
										<input type='text' value={this.state.searchName} 
										placeholder='Search'
										onChange={(evt) => this.handleSearchNameChange(evt)}/> : 
										
										this.showCompanyList()
								}
								
								
								<button onClick={(evt) => {this.handleCancelClick(evt)}}>Cancel</button>
							</div>
							<div className='card-container'>
								
								<ul className='card-list-container'>
								{(this.state.listOfcards.sort()
									.filter(card => card.name.toLowerCase().includes(this.state.searchName))
									.map(cardToShow => <li className='card-list' key={cardToShow.id} 
															onClick={(evt) => this.handleRecordClick(evt,cardToShow.id)}>
															{cardToShow.name}
															</li>)
								)}
								</ul>
							</div>
							{this.state.showModal && <CardModal card_id={this.state.cardId} showCardModal={this.state.showModal} onCloseModal={this.handleCloseModal}/>}
						</div>
					
					</div>
					{/* <div><a onClick={(evt) => {this.setState({clickedProfile:true})}}>Your Profile</a></div>
					<div><button onClick={(evt) => this.handleLogoutClick(evt)}>Logout</button></div> */}
					
				</div>)
	}
	
}

