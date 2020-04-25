
class MidiPoseModel{
    constructor(){
        this.status = null;
    }

    creatingModel(output_pose){
        this.status = 'collecting';
        console.log("woohoo");
    }

    captureMidi(output_pose){
        midi_mapped = output_pose;
        return midi_mapped;
    }

    addData(output_pose){
        console.log("woohoo");
    }
}