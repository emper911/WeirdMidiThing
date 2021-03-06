function initApp() {
    /* Initializes global variables, webcam and tensorflow -- posenet
    *
    */
    initVariables(); //Loads global variables used throughout the page
    initWebCamera(); //loads webcamera
    initTensorFlow(); //loads posenet with parameters
}


function initVariables() {
    /* Initalizes html element tags and js objects from CDNs as global variables
    *
    */
    bernsky = document.getElementById('bern');
    webcamera = document.getElementById('webcam')
    //create canvas context 
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#00FFFF";
    posenet = window.posenet;
    canvas2 = document.getElementById("myCanvas2");
    ctx2 = canvas2.getContext("2d");
    ctx2.fillStyle = "#00FFFF";
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
    // webcamera.play();

}


async function initTensorFlow() {
    /* Initializes posenet with set parameters
    * 
    */
    net = await initPosenet(
        architect = 'MobileNetV1',
        output_stride = 16,
        input_resolution = {
            width: 257,
            height: 200
        },

        multiply = 0.50,
    );
}