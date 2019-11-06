window.addEventListener('load', function(){
    /* Initates the whole project from one starting point.
    *
    */
    initVariables(); //Loads global variables used throughout the page
    initWebCamera();
    webcamera.addEventListener('loadeddata', function () {
        startTensorflow();

    }, false);
});


function initVariables(){
    /* Initating global variables for now
    *
    */
    // get input img html element
    bernsky = document.getElementById('bern');
    webcamera = document.getElementById("webcam");
    //create canvas context 
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    posenet = window.posenet;
    ctx.fillStyle = "#00FFFF"; 

    posenet_1 = initPosenet(
        architect = 'MobileNetV1',
        output_stride = 16,
        input_resolution = {
            width: 600,
            height: 400
        },
        multiply = 0.75,
    );
    
}


function startTensorflow(){
    /* Start tensorflow function and doing cool stuff
    *  This is the main loop where everything happens
    */
   
   // show canvas img to be drawn over
    ctx.clearRect(0, 0, 600, 400);
    ctx.save();
    ctx.drawImage(webcamera, 0, 0, 600, 400);  // -- For whatever reason ctx.drawImage was not working for me.
    ctx.restore();
    // load an image into the posenet and process data
    output_pose = loadPosenet(
        posenet_1,
        img = webcamera
    );
        
    // draw the output on a canvas
    ctx.save();
    drawOnCanvas(output_pose);
    mapMidi(output_pose);
           
    ctx.restore();
    // setInterval(10);
    animation_id = window.requestAnimationFrame(startTensorflow); //creates an infinite loop
}


function initPosenet(architect, output_stride, input_resolution, multiply) {
    /* Instantiates the posenet network
    *  Returns the network object
    */
    let init_posenet = posenet.load({
        architecture: architect,
        outputStride: output_stride,
        inputResolution: input_resolution,
        multiplier: multiply
    });
    return init_posenet;
    }


function loadPosenet(posenet, img) {
    /* loads an image into the network
    *  Returns the output promise
    */
    let output_pose = posenet.then(function (net) {
        // run img through network and record results in "pose"
        const pose = net.estimateSinglePose(img, {
            flipHorizontal: false
        });
        return pose;
    });
    return output_pose;
}


function drawOnCanvas(net_output) {
    /* Draws the output on the canvas
    *  
    */
    net_output.then(function (pose) {
        // for each keypoint, draw a dot on the canvas if confidence score is above threshold
        for (i = 0; i < 17; i++) {
            if (pose.keypoints[i].score > 0.40) {
                // ctx.restore();
                ctx.beginPath();
                ctx.arc(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 4, 0, 2 * Math.PI);
                ctx.fill();
                // ctx.save();
                console.log(pose.keypoints[i].position);
            }
        }
        // console.log(pose);
    });
}
