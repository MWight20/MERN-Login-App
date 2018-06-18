import React, { Component } from 'react';
import 'whatwg-fetch';

import { Link } from 'react-router-dom';
import {
  getFromStorage,
  setInStorage,
}  from '../../utils/storage';

class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
    };

    this.logout = this.logout.bind(this);

  }

  componentDidMount() {
    
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) { 
      
      // If token object exists
      const { token } = obj;

      // Verify token
      fetch('/api/account/verify?token=' + token)
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          this.setState({
            token,
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
          })
        }
      });
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  logout() {
    this.setState({
      isLoading: true,
    })
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      //verify token
      fetch('/api/account/logout?token=' + token)
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          this.setState({
            token: '',
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
          })
        }
      });
    } else {
      this.setState({
        isLoading: false,
      })
    }
    window.location.reload();
  }
  

  render() {
    const {
      isLoading,
      token,
    } = this.state;
    

    //if user is signed in
    if(token) {
      return(
        <header>
          <div className="navBar"> 
            <ul> 
              <li><Link to="/" id="navLink"> Home </Link></li>
              <li><Link to="/Content" id="navLink"> Content </Link></li>
              <li><Link to="/" id="navLink" onClick={this.logout}> logout </Link></li> 
              
            </ul>
          </div>
          <hr />
        </header>
        );
    }

    return(
    <header>
      <div className="navBar"> 
        <ul> 
          <li><Link to="/" id="navLink"> Home </Link></li>
        </ul>
      </div>
      <hr />
    </header>
    );

    

    //else user is not signed in
    /*
    <header>
      <div className="navBar"> 
        <ul> 
          <li><Link to="/" id="navLink"> Home </Link></li>
          <li><Link to="/Content" id="navLink"> Content </Link></li>
        </ul>
      </div>
      <hr />
    </header>

    */

  }
  
}

/*
const HeaderBar = () => (
  <header>
    <div className="navBar"> 
      <ul> 
        <li><Link to="/" id="navLink"> Home </Link></li>
        <li><Link to="/Content" id="navLink"> Content </Link></li>
        <li><Link to="/" id="navLink" onClick={this.logout}> logout </Link></li>
      </ul>
    </div>
    <hr />
  </header>
);
*/

export default Header;
