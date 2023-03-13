// Select the video element on the page
const videoElement = document.getElementById('video');

// Select the record button element on the page
const recordButton = document.getElementById('recordButton');

// Get the user's media stream from the webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    // Set the video element's srcObject to the media stream
    videoElement.srcObject = stream;

    // Create a new MediaRecorder instance and start recording the stream
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    // Listen for data available event and save the recorded chunks in an array
    const chunks = [];
    mediaRecorder.addEventListener('dataavailable', (event) => {
      chunks.push(event.data);
    });

    // Listen for stop event and create a new video blob and URL
    mediaRecorder.addEventListener('stop', () => {
      const videoBlob = new Blob(chunks, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);

      // Set the video element's src attribute to the URL of the recorded video
      videoElement.src = videoUrl;

      // Create download button and add it to the page
      const downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download';
      document.body.appendChild(downloadButton);

      // Add click event listener to download button
      downloadButton.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'recorded_video.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(videoUrl);
        }, 0);
      });
    });

    // Add click event listener to record button
    recordButton.addEventListener('click', () => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordButton.textContent = 'Record';
      } else {
        mediaRecorder.start();
        recordButton.textContent = 'Stop';
      }
    });
  })
  .catch((error) => {
    console.error(error);
  });
