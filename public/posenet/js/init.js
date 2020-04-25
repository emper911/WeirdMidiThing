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
    //posenet globals
    posenet = window.posenet;
    //manages global state as object
    state = {};
    //webcamera globals
    state.webcamera = document.getElementById('webcam');
    state.webcamera.width = 257;
    state.webcamera.height = 200;
    state.webcamera_on = true;
    //create canvas context
    state.camCanvas = document.getElementById("camCanvas");
    state.cctx = camCanvas.getContext("2d");
    state.cctx.fillStyle = "#00FFF";
    state.net = null;
    //animation frame globals
    state.animation_id = null;
    state.start_time = 0;
    state.process_rate = 40; //200ms
    //model training global
    state.midiModel = new MidiPoseModel();
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
    state.net = await posenet.load({
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

