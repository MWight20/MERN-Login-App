import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';

import {
    getFromStorage,
    setInStorage,
  }  from '../../utils/storage';

class Content extends Component {

  constructor(props) {
      super(props);

      this.state = { 
        isLoading: true,
        token: '',
        signUpEmail: '',
        signUpFirstName: '',
        signUpLastName: '',
        signUpEmail: '',
        signUpPassword: '',
      };
    
  
  //bind input form
  this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
  this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
  this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
  this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);

  this.onSignUp = this.onSignUp.bind(this);
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


  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }





  onSignUp() {
    // Grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signup', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json)
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
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
  }

  render() {
    const {
      isLoading,
      token,
      signUpError,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
    } = this.state;

    if (isLoading){
      return (<div><p>Loading...</p></div>);
    }

    if (token) {
      return(
        <div>

          <div className="signUpForm">
          {
              (signUpError) ? (
              <p>{signUpError}</p>
              ): (null)
          }
          <p>Sign up</p>
          <input 
              type="text" 
              placeholder="First Name"
              value={signUpFirstName} 
              onChange={this.onTextboxChangeSignUpFirstName}
          />
          <br />
          <input 
              type="text" 
              placeholder="Last Name" 
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
          />
          <br />
          <input 
              type="email"
              placeholder="Email" 
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
          />
          <br />
          <input 
              type="password" 
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
          /><br />
          <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }

    return(
      <div>
        <div>
          <h3> You must be logged in to view this page. </h3>
          <Link to="/"> Click here to log in. </Link>
        </div>
      </div>
    );
  }
  
}
    


export default Content;