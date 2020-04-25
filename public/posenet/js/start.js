/******************************************************************************************
***********************************STARTING POINT OF APP***********************************
*******************************************************************************************/
window.addEventListener('load', function () {
    init(); // Initializes global variables and functions in init.js
    startApp(); // starts application
});


function startApp(){
    /*
    Entry point to application.
    Once webcamera stream is fully loaded into <video> tag
    then animate function is called
    */
    webcamera.addEventListener('loadeddata', function (){
        animated();
    });
}


function animated() {
    /*
    Within the animation loop, posenet estimates set of values,
    draws them on a new canvas and sends data to server.
    */
    animation_id = window.requestAnimationFrame(posenetWebcamFrame);
}


async function posenetWebcamFrame(current_time) {
    /* 
    Draws webcam onto the canvas, gets pose values from canvas,
    Draws the output and sends the pose to the server.
    */ 
   if (current_time - start_time > 200 && !paused){
       start_time = current_time;
       output_pose = await loadPosenet(webcamera); // load an image into the posenet and process data
       console.log(output_pose);
       // if (state == 'collecting') capturePose(output_pose);
       sendOutputPose(output_pose);
       // if (state == 'modelled') sendOutputPose(output_pose);
    }
    drawWebcamOntoCanvas();
    drawPoseOntoCanvas(output_pose);
    // callback to this function creating animation loop
    window.requestAnimationFrame(posenetWebcamFrame);
}


function drawWebcamOntoCanvas(){
    // draws webcamera
    cctx.clearRect(0, 0, 257, 200);
    cctx.drawImage(webcamera, 0, 0, 257, 200);
    cctx.save();
}


async function loadPosenet(vid) {
    /*
    run vid through network and record results in "pose"
    Returns the output
    */
    const pose = await net.estimateSinglePose(vid, {
        flipHorizontal: false,
        decodingMethod: 'single-person'
    });
    return pose;
}


function drawPoseOntoCanvas(pose) {
    /*  
    Draws the key points from Posenet.
    */
    cctx.beginPath();
    for (i = 0; i < 17; i++) {
        if (pose.keypoints[i].score > 0.40) {
            const x = pose.keypoints[i].position.x;
            const y = pose.keypoints[i].position.y;
            cctx.moveTo(x, y);
            cctx.arc(x, y, 4, 0, 2 * Math.PI);
        }
    }
    cctx.closePath();
    cctx.fill();
    cctx.restore();
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
