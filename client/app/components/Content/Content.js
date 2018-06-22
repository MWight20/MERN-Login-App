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
        userRow: [],
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

    //fetch and load data for table
    fetch('/api/users/listNames')
    .then(result => result.json())
    .then(data => {
      /*let userData = data.result.map((user) => {
        return(
          <p>{user.userData.firstName}</p>
        )
      })
      */
      console.log(data.result);

      let userData = data.result.map((user) => {
        return(
          <tr key={user._id}>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
          </tr>
        )
      });

      console.log(userData);

      this.setState({userRow: userData});
      //console.log(userJSON.stringify());
    
    });//end fetch names

  }//end componentDidMount()


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
      nameJSON
    } = this.state;

    if (isLoading){
      return (<div><p>Loading...</p></div>);
    }

    if (token) {
      var nameArray = JSON.stringify(nameJSON);


      return(
        <div>
          <div className="contentContainer">
            <div className="signUpForm">
            {
                (signUpError) ? (
                <p>{signUpError}</p>
                ): (null)
            }
            <p>Register New User:</p>
            <input 
                type="text" 
                placeholder="First Name"
                id="firstNameSignUp"
                value={signUpFirstName} 
                onChange={this.onTextboxChangeSignUpFirstName}
            />
            <br />
            <input 
                type="text" 
                placeholder="Last Name" 
                id="lastNameSignUp"
                value={signUpLastName}
                onChange={this.onTextboxChangeSignUpLastName}
            />
            <br />
            <input 
                type="email"
                placeholder="Email" 
                id="emailSignUp"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
            />
            <br />
            <input 
                type="password" 
                placeholder="Password"
                id="passwordSignUp"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
            />
            <br />
            <button className="button" onClick={this.onSignUp}>Sign Up</button>
            </div>
          </div>
          <div className="tableContainer">
            <table className="userTable">
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {this.state.userRow}
            </tbody>
            </table>

          </div>

        </div>//end of if logged in
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