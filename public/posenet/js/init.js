function init() {
    /* Initializes global variables, webcam and tensorflow -- posenet
    */
    initVariables(); //Loads global variables used throughout the page
    initTensorFlow(); //loads posenet with parameters
    initWebCamera(); //loads webcamera
}


function initVariables() {
    /* Initalizes html element tags and js objects from CDNs as global variables
    */
    //webcamera global
    webcamera = document.getElementById('webcam');
    webcamera.width = 257;
    webcamera.height = 200;
    //create canvas context
    camCanvas = document.getElementById("camCanvas");
    cctx = camCanvas.getContext("2d");
    cctx.fillStyle = "#00FFF";
    //posenet globals
    posenet = window.posenet;
    net = null;
    //animation frame globals
    animation_id = null;
    //model training global
    state = 'starting';
    start_time = 0;
    paused = false;

}


function initWebCamera() {
    /* Initializes webcam, prompting user for access, 
    *  providing drop down menu for selecting camera and sending video stream to video tag.
    *  Functions are from webCamera.js
    */
    triggerAuthorizationPrompt()
        .then(getWebcamList)
        .then(loadDropDownMenu)
        .then(onWebcamSelected)
        .catch((err) => { console.error(err.message) });
}


async function initTensorFlow() {
    /* Initializes posenet with set parameters. Loads global variable called 'net'
    */
    net = await posenet.load({
        architecture : 'MobileNetV1',
        outputStride: 16,
        inputResolution : {
            width: 257,
            height: 200
        },
        multiplier: 0.5,
        // quantBytes: 1
    });
}
