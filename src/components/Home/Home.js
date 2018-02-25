import React, { Component } from 'react';

import './Home.css';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    }

    this.takePhoto = this.takePhoto.bind(this);
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
    let {photos} = this.state;
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

    // Add the dataURL to the photos array on this.state
    photos.push(imageDataURL);
    this.setState({photos});
  }

  render() {
    return (
      <div className="home">

        <video className='video' id='video' muted></video>
        <button className="photo_btn" onClick={this.takePhoto} >Take photo</button>

        <canvas id='canvas'></canvas>

        <div className='photos'>
          {
            this.state.photos.map((item, i) => {
              return <div className='photo_wrapper' key={i}><img className='photo' src={item} alt='selfie' /></div>
            })
          }
        </div>

      </div>
    );
  }
}


export default Home;