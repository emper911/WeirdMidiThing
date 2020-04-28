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
    state.webcamera.addEventListener('loadeddata', function (){
        state.start_time = performance.now();
        animate();
    });
}


function animate() {
    /*
    Within the animation loop, posenet estimates set of values,
    draws them on a new canvas and sends data to server.
    */
    state.animation_id = window.requestAnimationFrame(posenetWebcamFrame);
}


async function posenetWebcamFrame(current_time) {
    /* 
    Draws webcam onto the canvas, gets pose values from canvas,
    Draws the output and sends the pose to the server.
    */
   time_lapsed = current_time - state.start_time;
   //If in collecting mode, capture every frame
   if (state.midiModel.status == 'collecting'){
       // Sets a delay of 5 secs before starting capture
        if (time_lapsed < state.capture_start_delay) {
            console.log("waiting");
        }
        else {
            state.midiModel.setCaptureTime(current_time);
            // loads video tag into the posenet and predicts
            output_pose = await loadPosenet(state.webcamera);
            posenetToMidi(output_pose, current_time); 
        }
    }
    //Captures pose from webcam at process rate 
    else if (state.webcamera_on && time_lapsed > state.process_rate) {
        state.start_time = current_time;
         // loads video tag into the posenet and predicts
        output_pose = await loadPosenet(state.webcamera);
        posenetToMidi(output_pose, current_time);
    }
    
    if (state.webcamera_on) drawWebcamOntoCanvas();
    drawPoseOntoCanvas(output_pose);
    // callback to this function creating animation loop
    window.requestAnimationFrame(posenetWebcamFrame);
}


async function loadPosenet(vid) {
    /*
    run vid through network and record results in "pose"
    Returns the output
    */
    const pose = await state.net.estimateSinglePose(vid, {
        flipHorizontal: false,
        decodingMethod: 'single-person'
    });
    return pose;
}


function posenetToMidi(output_pose, current_time){

    if (state.midiModel.status === 'trained'){
        midi_pose = state.midiModel.captureMidi(output_pose);
        sendMidiPoseToServer(midi_pose, current_time); 
    }
    else{
        state.midiModel.stateMachine(output_pose, current_time);
    }
}


function drawWebcamOntoCanvas(){
    /* Draws webcamera onto canvas.
    */
    state.cctx.clearRect(0, 0, width, height);
    state.cctx.drawImage(state.webcamera, 0, 0, width, height);
    state.cctx.save();
}


function drawPoseOntoCanvas(pose) {
    /*  Draws the key points from Posenet onto canvas.
    */
    state.cctx.beginPath();
    for (i = 0; i < 17; i++) {
        if (pose.keypoints[i].score > 0.45) {
            const x = pose.keypoints[i].position.x;
            const y = pose.keypoints[i].position.y;
            state.cctx.moveTo(x, y);
            state.cctx.arc(x, y, 4, 0, 2 * Math.PI);
        }
    }
    state.cctx.closePath();
    state.cctx.fill();
    state.cctx.restore();
}


async function sendMidiPoseToServer(output_pose, current_time){
    /* Sends the output midi to server
    */
    const url = new URL('http://localhost:3000/convertPosenet');
    const params = { pose: JSON.stringify(output_pose), time: current_time}; // or:
    url.search = new URLSearchParams(params).toString();
    await fetch(url);
}
