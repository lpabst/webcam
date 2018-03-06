import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './Signup.css';

class Signup extends Component {

  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      step1: true,
      pic: '',
    }

    this.goBack = this.goBack.bind(this);
    this.goNext = this.goNext.bind(this);
    this.takePhoto = this.takePhoto.bind(this);
    this.createProfile = this.createProfile.bind(this);
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

  takePhoto(e) {
    let hidden_canvas = document.querySelector('canvas');
    let video = document.querySelector('video');
    let width = video.videoWidth;
    let height = video.videoHeight;
    let context = hidden_canvas.getContext('2d');

    // Set the canvas to the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Draw a copy of the current frame from the video onto the canvas.
    context.drawImage(video, 0, 0, width, height);

    // Get the image dataURL from the canvas.
    var imageDataURL = hidden_canvas.toDataURL('image/png');

    this.setState({
      pic: imageDataURL
    }, this.createProfile);
  }
  
  createProfile(){
    let image = this.state.pic;
    
    axios.post('/api/facialRecognition', {
      url: 'https://api.kairos.com/detect',
      payload: {
        "image": image
      }
    })
    .then (res => {
      if (!res.data.images){
        return alert('Please take another photo. Make sure you are in a well lit area and your full face is included in the picture.');
      }else{
        axios.post('/api/createProfile', {
          image: image,
          username: this.state.username,
          password: this.state.password
        })
        .then( result => {
          if (result.data.status === 'success'){
            alert('Successfully created new profile');
          }else{
            alert('error in creating profile');
          }
          let newUrl = window.location.href;
          newUrl = newUrl.replace('/signup', '');
          window.location.href = newUrl;
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err=>console.log(err));
  }

  toggleLoginMethod(){
    this.setState({
      loginMethodFR: !this.state.loginMethodFR
    })
  }

  goBack(){
    this.setState({
      step1: true
    })
  }

  goNext(){
    if (!this.state.username){
      alert('Please enter a username');
    }
    else if (!this.state.password){
      alert('Please enter a password');
    }
    else if (!this.state.confirmPassword){
      alert('Please enter your password in the confirm password box as well');
    }
    else if (this.state.password !== this.state.confirmPassword){
      alert('The passwords you entered do not match')
    }
    else {
      this.setState({
        step1: false
      })
    }
  }

  render() {
    let videoDisplay = this.state.step1 ? 'none' : 'block';

    return (
      <section className='signup'>

        <div className='signup_navbar'>
          <Link to='/'>Back to login</Link>
        </div>

        {
          this.state.step1 ? 
            <div className='signup_form'>
              <p>Step 1/2</p>
              <input placeholder='username' autoComplete='new-username' onChange={(e) => this.setState({username: e.target.value})} />
              <input placeholder='password' autoComplete='new-password' onChange={(e) => this.setState({password: e.target.value})} />
              <input placeholder='confirmPassword' autoComplete='new-confirmPassword' onChange={(e) => this.setState({confirmPassword: e.target.value})} />
              <button onClick={this.goNext} >Next</button>
            </div>
          : <div className='signup_form'>
              <p>Step 2/2</p>
              <button onClick={this.takePhoto}>Take Photo</button>
              <button onClick={this.goBack} >Back</button>
            </div>
        }
        
        <canvas id='canvas'></canvas>

        <div className='video_wrapper' style={{display: videoDisplay}}>
          <video className='video' id='video' muted></video>
        </div>

      </section>
    );
  }
}


export default Signup;