/******************************************************************************************
***********************************STARTING POINT OF APP***********************************
*******************************************************************************************/
window.addEventListener('load', function () {
    init(); // Initializes global variables and functions in init.js
    start(); //starts application
});


function start(){
    /*
    Entry point to application.
    Once webcamera stream is fully loaded into <video> tag
    then animate function is called
    */
    webcamera.addEventListener('loadeddata', function () {
        animate();
    }, false);
}


function animate(){
    /*
    *
    */
    posenetWebcamFrame();
    animation_id = window.requestAnimationFrame(animate);   
}


async function posenetWebcamFrame() {
    /* 
    Start posenet functions from PoseSynth_2.js and doing cool stuff
    */ 
    webcamOntoCanvas();
    output_pose = await loadPosenet(canvas); // load an image into the posenet and process data
    drawPoseOnCanvas(output_pose);
    sendOutputPose(output_pose);
}


function webcamOntoCanvas() {
    /* 
    Attaches video tag to canvas
    */
    ctx.clearRect(0, 0, 200, 200);
    ctx.drawImage(webcamera, 0, 0, 200, 200);  // -- Draws webcam on canvas
}


async function loadPosenet(vid) {
    /* loads an image into the network
    run vid through network and record results in "pose"
    Returns the output promise
    */
    const pose = await net.estimateSinglePose(vid, {
        flipHorizontal: false,
        decodingMethod: 'single-person'
    });
    return pose;
}


function drawPoseOnCanvas(pose) {
    /*  
    Draws the output on the canvas
    */
    ctx2.clearRect(0, 0, 500, 400);
    ctx2.drawImage(webcamera, 0, 0, 200, 200);
    ctx2.save();
    ctx2.beginPath();
    for (i = 0; i < 17; i++) {
        if (pose.keypoints[i].score > 0.40) {
            const x = pose.keypoints[i].position.x;
            const y = pose.keypoints[i].position.y;
            ctx2.moveTo(x, y);
            ctx2.arc(x, y, 4, 0, 2 * Math.PI);
        }
    }
    ctx2.closePath();
    ctx2.fill();
    ctx2.restore();
}

async function sendOutputPose(output_pose){
    /*
    Sends the output midi cc to server
    */
    const url = new URL('http://localhost:3000/convertPosenet');
    const params = { pose: JSON.stringify(output_pose)} // or:
    url.search = new URLSearchParams(params).toString();
    await fetch(url);
}
