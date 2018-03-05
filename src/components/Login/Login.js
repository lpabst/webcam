import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import './Login.css';

class Login extends Component {

  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      userPic: '',
      loginMethodFR: true,
    }

    this.toggleLoginMethod = this.toggleLoginMethod.bind(this);
    this.login = this.login.bind(this);
  }

  toggleLoginMethod(){
    this.setState({
      loginMethodFR: !this.state.loginMethodFR
    })
  }

  login(){
    if (this.state.loginMethodFR){
      //take pic, axios username and pic login (use facial recognition api)
    }else{
      // axios username/password login
    }
  }

  render() {
    let newMethod = this.state.loginMethodFR ? 'Password' : 'Facial Recognition';
    return (
      <section className='login'>

        <div className='login_navbar'>
          <Link className='signup_link' to='/signup' >Sign Up</Link>
        </div>

        <div className='login_form'>
          <p className='mcenter tcenter'>Login to Your Account</p>
          <div className='login_input_div'><input placeholder='username' value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} /></div>
          {
            this.state.loginMethodFR ?  
              <div className='fr_login'>
                <button onClick={this.login} >Login</button>
              </div>
            : <div className='login_input_div'>
                <input placeholder='password' value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} type='password' />
                <button onClick={this.login} >Login</button>
              </div>
          }
          <p className='toggle_method' onClick={this.toggleLoginMethod} >Login With {newMethod} Instead</p>
        </div>

      </section>
    );
  }
}


export default Login;