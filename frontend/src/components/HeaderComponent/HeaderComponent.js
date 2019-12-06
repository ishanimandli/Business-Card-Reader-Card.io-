import React,{ Component } from 'react'
import './HeaderComponent.scss'

export default class HeaderComponent extends Component{
    handleLogoutClick(evt){
		if(evt){
			localStorage.clear();
			window.location.href = '/'
		}
	}
    render(){
        return(
            <div className='header-container'>
                <div className='app-logo-conainer'>
                    <span className='logo' onClick={(evt) => window.location.href='/'}>card.io</span>
                </div>
                {(localStorage.getItem('name')) && <div className='profile-container'>
                    
                    <ul className='nav-option'>
                        <li className='user-profile'>
                            Welcome, {this.props.user}
                        </li>
                        <li className ='user-profile profile-focus' 
                            onClick={(evt) => {window.location.href = '/#/userProfile'}}>
                               Profile 
                        </li>
                        <li className ='user-profile profile-focus' onClick={(evt) => this.handleLogoutClick(evt)}>
                            Logout
                        </li>
                    </ul>
                    </div>
                    }
                
                
            </div>
        )
    }
}