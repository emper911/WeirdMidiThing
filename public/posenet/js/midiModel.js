
class MidiPoseModel{
    constructor(model_options){
        this.status = null;
        this.options = model_options;
    }
    
    createTestDataset(output_pose){
        //once dataset intialized
        this.status = 'collecting';
    }

    addData(output_pose){
        console.log("woohoo");
        //on done adding to test set
        this.status = 'collected';
    }

    learning(){
        //once trained from test data
        this.status = 'trained';
    }

    captureMidi(output_pose){
        //predicts from output_pose
        midi_mapped = output_pose;
        return midi_mapped;
    }

}