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

  deleteThisPic(i){
    let {photos} = this.state;
    photos.splice(i, 1);
    this.setState({photos});
  }

  savePhoto(i){
    console.log(i);
    let data = this.state.photos[i];
    let filename = 'webcam_capture' + Math.floor(Math.random() * 10000000);
    let blobType = 'image/png';

    // atob to base64_decode the data-URI
    let image_data = atob(data.split(',')[1]);

    // Use typed arrays to convert the binary data to a Blob
    let arraybuffer = new ArrayBuffer(image_data.length);
    let view = new Uint8Array(arraybuffer);

    for (var i=0; i<image_data.length; i++) {
        view[i] = image_data.charCodeAt(i) & 0xff;
    }

    let blob;
    try {
        // This is the recommended method:
        blob = new Blob([arraybuffer], {type: blobType});
    } catch (e) {
        // The BlobBuilder API has been deprecated in favor of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the `Blob` constructor
        //  also works, there's no need to add `MSBlobBuilder`.
        let bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
        bb.append(arraybuffer);
        blob = bb.getBlob(blobType); // <-- Here's the Blob
    }

    // Create an <a> tag, set it's href/download properties to the blob, click it (starts download), then remove it from the DOM
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(blob, filename);
    else { // Others
        let a = document.createElement("a"),
                url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

  }

  render() {
    return (
      <div className="home">

        <canvas id='canvas'></canvas>

        <div className='video_wrapper'>
          <video className='video' id='video' muted></video>
        </div>

        <div className='button_wrapper'>
          <button className="photo_btn" onClick={this.takePhoto} >Take photo</button>
        </div>


        <div className='photos'>
          {
            this.state.photos.map((item, i) => {
              let index = i;
              return <div className='photo_wrapper' key={i}>
                <img className='photo' src={item} alt='selfie' />
                <p className='close_x' onClick={(e, i) => this.deleteThisPic(i)}>X</p>
                <p className='save_photo' onClick={(e, index) => this.savePhoto(0)} >Download/Save</p>
              </div>
            })
          }
        </div>

      </div>
    );
  }
}


export default Home;