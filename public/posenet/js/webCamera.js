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
        .then(stream => state.webcamera.srcObject = stream)
        .catch(function (err0r) {
            console.log("Something went wrong!");
        }
    );
}


function reconnectVideoStream() {
    /* Reconnects videostream
    */
    initWebCamera();
    state.webcamera_on = true;
}


function disconnectVideoStream() {
    /* Disconnects videostream
    */
    // Fetch video element. If it does not have a stream return nothing.
    if (!state.webcamera.srcObject) return;
    // Pause the video, stop all tracks and make sure no reference remain.
    state.webcamera.srcObject.getTracks().forEach(track => track.stop());
    state.webcamera.srcObject = undefined;
    state.webcamera.src = "";
    window.cancelAnimationFrame(state.animation_id);
    state.webcamera_on = false;
}