import React, { Component } from 'react';

import './Home.css';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    }
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
    if (document.getElementById('flip-button')){
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

  takePhoto(){
    alert('photo');
  }

  render() {
    return (
      <div className="home">

        <video className='video' muted></video>
        <button className="photo_btn" onClick={this.takePhoto} >Take photo</button>

        <div className='photos'>
          {
            this.state.photos.map( (item, i) => {
              return <div className='photo_wrapper'><img src={item} /></div>
            })
          }
        </div>

      </div>
    );
  }
}


export default Home;