
class MidiPoseModel{
    constructor(model_options){
        this.status = null;
        this.options = model_options;
        this.capture_delay = 10000;
        this.capture_time = 0;
    }

    _startCapturing(){
        //state updater
        this.status = 'begin';
    }
    
    _capturePose(){
        //state updater
        this.status = 'collecting';
    }

    _stopCapturing(){
        //state updater
        this.status = 'collected';
    }

    createTestDataset(){
        //once dataset intialized
        this.status = 'waiting';
    }

    addData(output_pose){
        console.log("woohoo");
        //on done adding to test set
        this.status = 'waiting';
    }

    learning(){
        //most likely async

        //once trained from test data
        this.status = 'trained';
    }

    captureMidi(output_pose){
        //predicts from output_pose
        midi_mapped = output_pose;
        return midi_mapped;
    }

}

