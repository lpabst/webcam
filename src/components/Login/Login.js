import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import './Login.css';

class Login extends Component {

  constructor(props){
    super(props);

    this.state = {

    }

  }

  componentDidMount(){
    
  }

  render() {
    return (
      <section className='login'>

        <div className='login_navbar'>
          <Link className='signup_link' to='/signup' >Sign Up</Link>
        </div>

        <div className='login_form'>
          <p className='mcenter tcenter'>Login Here</p>
          <div className='login_input_div'><input placeholder='username' /></div>
          <div className='login_input_div'><input placeholder='password' type='password' /></div>
          <button>Login</button>
          <button>Facial Recognition Login</button>
        </div>

      </section>
    );
  }
}


export default Login;