
class MidiPoseModel{
    constructor(model_options){
        this.status = null;
        this.test_data = null;
        this.tf_formatted_data = null;
        this.model = null;
        this.options = model_options;
        this.capture_time = 0;
        // exposure time capturing every pose on frame in 5 secs
        //e.g 60fps 60 * 5 = 300 poses
        this.capture_delay = 5000;
        //keeps track of different poses
        this.index_pose = 0;
    }

    stateMachine(output_pose, current_time){
        // managing midi model
        switch (this.status) {
            case 'begin':
                this._createTestDataset();
                break;
            case 'collecting':
                this._addData(output_pose, current_time);
                break;
            case 'collected':
                this._start_learning();
                break;
            default: //status is 'waiting'
                break;
        }
    }

    startCapturing(){
        //state updater
        this.status = 'begin';
    }
    
    capturePose(){
        //state updater
        this.capture_time = performance.now();
        this.status = 'collecting';
    }

    stopCapturing(){
        //state updater
        this.status = 'collected';
    }
    
    captureMidi(output_pose) {
        //predicts from output_pose
        let part_array = []
        output_pose.pose.keypoints.map((part) => {
            part_array.push(part.position.x);
            part_array.push(part.position.y);
        });

        let pose_formatted = tf.tidy(() => {
            // Step 1. Shuffle the data    
            tf.util.shuffle(output_pose);
            // Step 2. Convert data to Tensor
            const part_array_tf = tf.tensor2d(
                part_array,
                [part_array.length / 2, 2] // [x, y] * number of body parts captured
            );
            const part_input_max = part_array_tf.max();
            const part_input_min = part_array_tf.min();
            const normalizedInputs = part_array_tf.sub( part_input_min)
                .div( part_input_max.sub(part_input_min));
            return {
                inputs: normalizedInputs,
                // Return the min/max bounds so we can use them later.
                max: part_input_max,
                min: part_input_min,
            }
        });
        const preds = tf.tidy(() => {

            const preds = model.predict(
                pose_formatted
                    .reshape([pose_formatted.length, 1])
            );

            const unNormPreds = preds
                .mul(pose_formatted.max.sub(pose_formatted.min))
                .add(pose_formatted.min);

            // Un-normalize the data
            return unNormPreds.dataSync();
        });

        return preds;
    }

    _createTestDataset(){
        //once dataset intialized
        this.status = 'waiting';
        this.test_data = [];
    }

    _addData(output_pose, current_time){
        const lapsed = current_time - this.capture_time;

        if (lapsed < this.capture_delay) {
            let parts_array = []
            output_pose.pose.keypoints.map( (part) => {
                parts_array.push(part.position.x);
                parts_array.push(part.position.y);
            });

            this.test_data.push({
                index: this.index_pose,
                pose_array: parts_array
            });
        }
        else {
            // this.capture_time = current_time;
            this.index_pose++;
            state.midiModel.status = "waiting";
        }
    }

    async _start_learning() {
        tf.util.shuffle(this.test_data);
        this._convertData();
        this._createModel();
        await this._trainModel();
        //once trained from test data
        this.status = 'trained';
    }
    
    _createModel() {
        this.model = tf.sequential();
        model.add(tf.layers.dense({
            inputShape: [17, 2],
            units: 17
        }));
        // Add an output layer
        model.add(tf.layers.dense({ 
            units: this.index_pose, 
        })
        );
        
        return model;
    }
    
    _convertData(){
        const formatted_test_data = this.test_data.map((pose) =>{
            midi_array = new Array(this.index_pose).fill(0);
            midi_array[pose.index] = 127;
            const formatted = {
                midi: midi_array,
                pose: pose.pose_array,
            }
            return formatted;
        });

        this.tf_test_data = tf.tidy(() => {
            // Step 1. Shuffle the data    
            tf.util.shuffle(this.test_data);
            // Step 2. Convert data to Tensor
            const inputs = formatted_test_data.map(pose_midi => pose_midi.pose)
            const labels = formatted_test_data.map(pose_midi => pose_midi.midi);

            const inputTensor = tf.tensor2d(inputs, [inputs.length / 2 , 2]);
            const labelTensor = tf.tensor2d(labels, [labels.length, 1], 'int32');

            //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
            const inputMax = inputTensor.max();
            const inputMin = inputTensor.min();
            const labelMax = labelTensor.max();
            const labelMin = labelTensor.min();

            const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
            const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

            return {
                inputs: normalizedInputs,
                labels: normalizedLabels,
                // Return the min/max bounds so we can use them later.
                inputMax,
                inputMin,
                labelMax,
                labelMin,
            }
        });  
    }

    async _trainModel() {
        // Prepare the model for training.  
        this.model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });

        const batchSize = 32;
        const epochs = 50;

        return await this.model.fit(
            this.tf_test_data.inputs,
            this.tf_test_data.labels,
            {
                batchSize,
                epochs,
                shuffle: true,
                callbacks: tfvis.show.fitCallbacks(
                    { name: 'Training Performance' },
                    ['loss', 'mse'],
                    { height: 200, callbacks: ['onEpochEnd'] }
                )
            }
        );
    }

}

