window.addEventListener('load', function(){
    /* Initates the whole project from one starting point
    *
    */
    initVariables(); //Loads global variables used throughout the page
    startTensorflow(); //This is where the magic happens after things are initiated
});

function initVariables(){
    /* Initating global variables for now
    *
    */

    // get input img html element
    img = document.getElementById('bern');
    //create canvas context 
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    posenet = window.posenet;
    ctx.fillStyle = "#00FFFF"; 
}

function startTensorflow(){
    /* Start tensorflow function and doing cool stuff
    *
    */
    // show canvas img to be drawn over
    ctx.drawImage(img, 0, 0, 257, 200);  // -- For whatever reason ctx.drawImage was not working for me.
    
    posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 257, height: 200 },
        multiplier: 0.75
    }).then(function (net) {
        // run img through network and record results in "pose"
        const pose = net.estimateSinglePose(img, {
            flipHorizontal: false
        });
        return pose;
    }).then(function (pose) {
        // for each keypoint, draw a dot on the canvas if confidence score is above threshold
        for (i = 0; i < 17; i++) {
            if (pose.keypoints[i].score > 0.40) {
                ctx.beginPath();
                ctx.arc(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 4, 0, 2 * Math.PI);
                ctx.fill();
                console.log(pose.keypoints[i].part);
            }
        }
        console.log(pose);
    })
}

