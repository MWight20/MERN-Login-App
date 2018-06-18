import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';

import {
  getFromStorage,
  setInStorage,
}  from '../../utils/storage';


// 1. when page loads, we'll fire off a fetch request to check if token is in local storage. 
// 2. if no token, we can assume that they're not logged in and we'll present a login/signup page
// 3. if they are logged in, we verify their token, we send back their token, then loading is done. 
// 4. add POST requests on signin and signup

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '', //isSignedIn
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
    };

    //bind input form
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.logout = this.logout.bind(this);
    this.redirectToContent = this.redirectToContent.bind(this);

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

  //function handling for input
  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onSignIn() {
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signin', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json)
        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
      window.location.reload();
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

  redirectToContent() {
    return <Link to="/Content"></Link>
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,

    } = this.state;

    if (isLoading){
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div>
          {
            (signInError) ? (
              <p>{signInError}</p>
            ): (null)
          }
          <div>
            <p>Sign in</p>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}

            />
            <br />
            <input
              type="password" 
              placeholder="Password" 
              value ={signInPassword} 
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
              <button onClick={this.onSignIn}>Sign in</button>
          </div>

          <br />
          <br />
          </div>
        );
    }

    return (
      <div>
        <div className="contentContainer">
          <h2> Congratulations! </h2>
          <p> You've logged into the content for this app! You now have the ability to add new users via the <Link to="/Content">content</Link> page.</p>
            <button onClick={this.logout}>Logout </button>
        </div>
        
          
      </div>
    );
  }
}

export default Home;
