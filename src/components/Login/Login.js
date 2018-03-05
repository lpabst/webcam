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
      errorMessage: '',
    }

    this.toggleLoginMethod = this.toggleLoginMethod.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.openWebCam();
  }

  openWebCam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.openBrowserCam();
    } else {
      this.openLegacyBrowserCam();
    }
  }

  openBrowserCam() {
    // Sets things up to work on mobile
    var front = false;
    if (document.getElementById('flip-button')) {
      document.getElementById('flip-button').onclick = function () { front = !front; };
    }

    // Determines the audio and video that gets passed to the browser
    let constraints = {
      audio: true,
      video: { facingMode: (front ? "user" : "environment") }
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        var video = document.querySelector('video');

        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          video.src = window.URL.createObjectURL(stream);
        }

        video.onloadedmetadata = function (e) {
          video.play();
        };
      })
      .catch(function (err) {
        console.log("The following error occurred: " + err.name);
      });
  }

  openLegacyBrowserCam() {
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true, video: true },
        function (stream) {
          var video = document.querySelector('video');
          video.srcObject = stream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        },
        function (err) {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  }

  toggleLoginMethod(){
    this.setState({
      loginMethodFR: !this.state.loginMethodFR
    })
  }

  login(){
    if (!this.state.username){
      let optionalPassword = this.state.loginMethodFR ? '' : ' and password';
      this.setState({
        errorMessage: `Please enter your username${optionalPassword} to login`
      })
      return;
    }
    if (this.state.loginMethodFR){
      //take pic, axios username and pic login (use facial recognition api)
    }else{
      axios.post('/api/passwordLogin', {
        username: this.state.username,
        password: this.state.password
      })
      .then (res => {
        console.log(res);
      })
      .catch(err=>console.log(err));
    }
  }

  render() {
    let newMethod = this.state.loginMethodFR ? 'Password' : 'Facial Recognition';
    let videoDisplay = this.state.loginMethodFR ? 'block' : 'none';
    return (
      <section className='login'>

        <div className='login_navbar'>
          <Link className='signup_link' to='/signup' >Sign Up</Link>
        </div>
        
        <p className='error_msg'>{this.state.errorMessage}</p>

        <div className='login_form'>
          <p className='mcenter tcenter'>Login to Your Account</p>
          <div className='login_input_div'>
            <input placeholder='username' autoComplete='new-username' value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} />
          </div>
          {
            this.state.loginMethodFR ?  
              <div className='fr_login'>
                <button onClick={this.login} >Login</button>
              </div>
            : <div className='login_input_div'>
                <input placeholder='password' value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} type='password' autoComplete='new-password' />
                <button onClick={this.login} >Login</button>
              </div>
          }
          <p className='toggle_method' onClick={this.toggleLoginMethod} >Login With {newMethod} Instead</p>
        </div>
        
        <canvas id='canvas'></canvas>

        <div className='video_wrapper' style={{display: videoDisplay}}>
          <video className='video' id='video' muted></video>
        </div>

      </section>
    );
  }
}


export default Login;