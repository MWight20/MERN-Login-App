import React, { Component } from 'react';
import 'whatwg-fetch';

import {
  getFromStorage,
  setinStorage,
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
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
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
  

    /*  THIS IS A GET REQUEST

    fetch('/api/counters')
      .then(res => res.json())
      .then(json => {
        this.setState({
          counters: json
        });
      });
    */


    /* THIS IS A POST REQUEST

    fetch('/api/counters', { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        let data = this.state.counters;
        data.push(json);

        this.setState({
          counters: data
        });
      });
    */


  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpError,

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

        <div>
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

    return (
      <div>
        <p> Account</p>
        <button onClick={this.logout}>Logout </button>
      </div>
    );
  }
}

export default Home;
