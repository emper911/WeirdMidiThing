async function initPosenet(architect, output_stride, input_resolution, multiply) {
    /* Instantiates the posenet network
    *  Returns the network object
    */
    const init_posenet = await posenet.load({
        architecture: architect,
        outputStride: output_stride,
        inputResolution: input_resolution,
        multiplier: multiply,
        // quantBytes: 1
    });
    return init_posenet;
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



