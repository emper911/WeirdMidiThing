function initWebCamera(){
    triggerAuthorizationPrompt()
        .then(getWebcamList)
        .then(loadDropDownMenu)
        .then(onWebcamSelected);
        // .then(gotMedia);
    
}


function triggerAuthorizationPrompt() {

    if (!navigator.mediaDevices) {
        throw new Error("The MediaDevices API is not supported.");
    }

    return navigator.mediaDevices.getUserMedia({ video: true });
}


function getWebcamList(){

    return new Promise((resolve, reject)=> { 
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {

                let filtered = devices.filter((device) => {
                    // console.log(device);
                    return device.kind === "videoinput"
                });

                resolve(filtered);
            })
    });
}


function loadDropDownMenu(webcams){
    let dropdown = document.getElementById("webcam-dropdown");

    webcams.forEach((cam) => {
        let option = document.createElement("option");
        option.text = cam.label;
        option.value = cam.deviceId;
        dropdown.options.add(option);
    });
    dropdown.addEventListener('change', onWebcamSelected);

}


function onWebcamSelected() {

    // Fetch our video element
    let videoElement = document.getElementById("webcam");

    // Retrieve the webcam's device id and use it in the constraints object
    let dropdown = document.getElementById("webcam-dropdown");
    let id = dropdown.options[dropdown.selectedIndex].value;

    let constraints = {
        video: { 
            deviceId: { exact: id },
            width: 257,
            height: 200,
        },
    };

    // Attach the webcam feed to a video element so we can view it
    return navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => videoElement.srcObject = stream)
        .catch(function (err0r) {
            console.log("Something went wrong!");
        });
}

// function gotMedia(mediaStream) {
//     const mediaStreamTrack = mediaStream.getVideoTracks()[0];
//     const imageCapture = new ImageCapture(mediaStreamTrack);

//     // ...
//     imageCapture.grabFrame()
//         .then(imageBitmap => {
//             canvas.width = imageBitmap.width;
//             canvas.height = imageBitmap.height;
//             loadPosenet(posenet_1, img)
//             ctx.drawImage(imageBitmap, 0, 0);
//         })
//         .catch(error => console.error('grabFrame() error:', error));
    
//     console.log(imageCapture);
// }


function disconnectVideoStream() {

    // Fetch video element. If it does not have a stream, we are done.
    let videoElement = document.getElementById("webcam");
    if (!videoElement.srcObject) return;

    // Pause the video, stop all tracks and make sure no reference remain.
    videoElement.srcObject.getTracks().forEach(track => track.stop());
    videoElement.srcObject = undefined;
    videoElement.src = "";
    // startTensorflow();
    window.cancelAnimationFrame(animation_id);

}