import React, { Component } from 'react';
import { getCardData,cardFromCompany } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import CardModal from '../CardModalComponent/CardModalComponent.js'



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

	showCardData(){
		const {listOfcards} = this.state
		return (<section>
			{listOfcards && listOfcards.length > 0 && 
			<div>
				{listOfcards.map(data => {
					const cid = data.id
					 return <div key={data.id} onClick={(evt) => this.handleRecordClick(evt,cid)}>{data.name}</div>
				})}
			</div>}
			{listOfcards && listOfcards.length === 0 && <div>No Cards available</div>}
		</section>)
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
			this.setState({originalCardList:this.state.listOfcards})
			this.setState({
				searchName: evt.target.value
			})
			let currentList = [];
        	// Variable to hold the filtered list before putting into state
   			 let newList = [];

        	// If the search bar isn't empty
    		if (this.state.searchName !== "") {
            	// Assign the original list to currentList
      			currentList = this.originalCardList;

            	// Use .filter() to determine which items should be displayed
            	// based on the search terms
      			newList = currentList.filter(item => {
                			// change current item to lowercase
        					const lc = item.name.toLowerCase();
               				// change search term to lowercase
        					const filter = this.state.searchName.toLowerCase();
                			// check to see if the current list item includes the search term
                			// If it does, it will be added to newList. Using lowercase eliminates
                			// issues with capitalization in search terms and search content
        				return lc.includes(filter);
      					});
			} 
			else {
            	// If the search bar is empty, set newList to original task list
      			newList = this.originalCardList;
    		}
        	// Set the filtered state based on what our rules added to newList
    		this.setState({
      			listOfcards: newList
    		});
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
					<div><a onClick={(evt) => {this.setState({clickedProfile:true})}}>Your Profile</a></div>
					<div><button onClick={(evt) => this.handleLogoutClick(evt)}>Logout</button></div>
					<div>
						
						<button onClick={(evt) => {this.handleNewClick(evt)}}>New Card</button>
					</div>
					<input type='text' value={this.state.searchName} onChange={(evt) => this.handleSearchNameChange(evt)} ></input>
					<button onClick={(evt) => {this.handleCancleClick(evt)}}>Cancle</button>
					{this.showCompanyList()}
					<h1>Names</h1>
					{this.showCardData()}
					{this.state.showModal && <CardModal card_id={this.state.cardId} showCardModal={this.state.showModal} onCloseModal={this.handleCloseModal}/>}
				</div>)
	}
	
}

