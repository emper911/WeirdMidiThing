async function initPosenet(architect, output_stride, input_resolution, multiply) {
    /* Instantiates the posenet network
    *  Returns the network object
    */
    let init_posenet = await posenet.load({
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


function drawOnCanvas(pose) {
    /* Draws the output on the canvas
    *  
    */
    ctx.save();
    ctx.beginPath();
    // console.log(pose);
    for (i = 0; i < 17; i++) {
        if (pose.keypoints[i].score > 0.40) {
            ctx.moveTo(pose.keypoints[i].position.x, pose.keypoints[i].position.y,);
            ctx.arc(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 4, 0, 2 * Math.PI);
            console.log(pose.keypoints[i].position);
        }
    }
    ctx.fill();
    ctx.restore();
        // console.log(pose);
}
