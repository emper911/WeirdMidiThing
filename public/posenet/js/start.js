/******************************************************************************************
***********************************STARTING POINT OF APP***********************************
*******************************************************************************************/
window.addEventListener('load', function () {
    /* Initates the whole project from one starting point.
    *
    */
    initApp(); // Initializes dependencies init.js
    startApp(); //starts application
});


function startApp(){
    /*
    *
    */
    //Once webcamera stream is fully loaded into <video> tag
    webcamera.addEventListener('loadeddata', function () {
        animate(); //start animation frame
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
    /* Start posenet functions from PoseSynth_2.js and doing cool stuff
    *  
    */ 
    webcamOntoCanvas();
    output_pose = await loadPosenet(canvas); // load an image into the posenet and process data
    drawPoseOnCanvas(output_pose);
    sendOutputPose(output_pose);

}


function webcamOntoCanvas() {
    /* Attaches video tag to canvas
    * 
    */
    ctx.clearRect(0, 0, 200, 200);
    ctx.drawImage(webcamera, 0, 0, 200, 200);  // -- Draws webcam on canvas

}

async function loadPosenet(vid) {
    /* loads an image into the network
    *  Returns the output promise
    */
    // run vid through network and record results in "pose"
    const pose = await net.estimateSinglePose(vid, {
        flipHorizontal: false,
        decodingMethod: 'single-person'
    });
    return pose;
}



function drawPoseOnCanvas(pose) {
    /* Draws the output on the canvas
    *  
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
    // fetch()
    // console.log(output_pose);
    const url = new URL('http://localhost:3000/convertPosenet');
    const params = { pose: JSON.stringify(output_pose)} // or:
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url);

    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({'output_pose': output_pose})
    // };
}