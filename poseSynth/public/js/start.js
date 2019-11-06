/******************************************************************************************
***********************************STARTING POINT OF APP***********************************
*******************************************************************************************/
window.addEventListener('load', function () {
    /* Initates the whole project from one starting point.
    *
    */
    initVariables(); //Loads global variables used throughout the page
    initWebCamera(); //loads webcamera
    initTensorFlow(); //loads posenet with parameters
    startApp(); //starts application
});


function initVariables() {
    /* Initalizes global variables for now
    *
    */
    bernsky = document.getElementById('bern');
    webcamera = document.getElementById("webcam");
    //create canvas context 
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    posenet = window.posenet;
    ctx.fillStyle = "#00FFFF";

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


function initTensorFlow() {
    /* Initializes posenet with set parameters
    * 
    */
    posenet_1 = initPosenet(
        architect = 'MobileNetV1',
        output_stride = 16,
        input_resolution = {
            width: 300,
            height: 200
        },
        multiply = 0.75,
    );
}


function startApp(){
    
    function animate(){
        startWebCamOntoCanvas();
        startPosenet();
        animation_id = window.requestAnimationFrame(animate);
    }
    //Once webcamera stream is fully loaded into <video> tag
    webcamera.addEventListener('loadeddata', function () {
        animate(); //start animation frame
    }, false);
}


function startWebCamOntoCanvas() {
    /* Attaches video tag to canvas
    * 
    */
    ctx.clearRect(0, 0, 300, 200);
    ctx.save();
    ctx.drawImage(webcamera, 0, 0, 300, 200);  // -- Draws webcam on canvas
    ctx.restore();

}


async function startPosenet() {
    /* Start posenet functions from PoseSynth_2.js and doing cool stuff
    *  
    */
    output_pose = await loadPosenet(posenet_1, img = canvas); // load an image into the posenet and process data
    drawOnCanvas(output_pose);
    // mapMidi(output_pose);
}