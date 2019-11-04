
// get input image html element
var image = document.getElementById('bern');

//create canvas context 
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#00FFFF";

// show canvas image to be drawn over
ctx.drawImage(image, 0, 0, 257, 200);

// load the posenet model into "net"
posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: { width: 257, height: 200 },
    multiplier: 0.75
}).then(function(net) {
    // run image through network and record results in "pose"
    const pose = net.estimateSinglePose(image, {
        flipHorizontal: false
});
return pose;
}).then(function(pose){
    // for each keypoint, draw a dot on the canvas if confidence score is above threshold
    for (i = 0; i < 17; i++) {
        if (pose.keypoints[i].score > 0.40) {
            ctx.beginPath();
            ctx.arc(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 4, 0, 2*Math.PI );
            ctx.fill();
            console.log(pose.keypoints[i].part);
        }
    }
    console.log(pose);
})