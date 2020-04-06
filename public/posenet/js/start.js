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
    function animate(){
        posenetWebcamFrame();
        animation_id = window.requestAnimationFrame(animate);   
    }

    //Once webcamera stream is fully loaded into <video> tag
    webcamera.addEventListener('loadeddata', function () {
        animate(); //start animation frame
    }, false);
}


async function posenetWebcamFrame(output_pose) {
    /* Start posenet functions from PoseSynth_2.js and doing cool stuff
    *  
    */ 
    webcamOntoCanvas();
    output_pose = await loadPosenet(canvas); // load an image into the posenet and process data
    drawPoseOnCanvas(output_pose);
    // mapMidi(output_pose);

}


function webcamOntoCanvas() {
    /* Attaches video tag to canvas
    * 
    */
    ctx.clearRect(0, 0, 257, 200);
    ctx.drawImage(webcamera, 0, 0, 257, 200);  // -- Draws webcam on canvas

}


function drawPoseOnCanvas(pose) {
    /* Draws the output on the canvas
    *  
    */
    ctx2.clearRect(0, 0, 500, 400);
    ctx2.drawImage(webcamera, 0, 0, 257, 200);
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

    // console.log(pose);
}