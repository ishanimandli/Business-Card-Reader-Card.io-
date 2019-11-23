import React, { Component } from 'react';
import { getCard,updateCard,deleteCard } from '../../services/userService'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'



export default class NewCardComponent extends Component{
	constructor(props){
		super(props)
		this.state = {
			fname = "",
			lname = "",
			phone_nember = [],
			email_id = []
		}
	}
	componentDidMount(){
		this.loadCardData()
	}
	async loadCardData(){
		
	}
    render(){
        return (
            <div>
				<div><img /></div>
				<div>
					<p>Name:</p>
					<input type = 'text' value=/><input type='text'/><br/>
					<p>Phone number:</p>
					<input type="text"/><br/>
					<p>Email id:</p>
					<input type='text'/>
					<button>Save</button>
				</div>
			</div>
						
        )
    }
}