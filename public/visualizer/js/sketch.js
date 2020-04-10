let inc = 0.1;
let scl = 10;
let cols, rows;
let yoff = 0;
let zoff = 0;
let particles = [];
let colorOff = 1;
let flowfield = [];
let player, analyzer;

let playing = false;
player = new Tone.Player('audio/InterestingSounds.2.1.mp3');
analyzer = new Tone.Analyser();
player.chain(analyzer.toMaster());


function setup(){
    let cnv = createCanvas(windowWidth, windowHeight);
    cols = floor(windowWidth / scl);
    rows = floor(windowHeight / scl);
    flowfield = new Array(cols * rows);

    for (i = 0; i < 1000; i++) {
        particles[i] = new Particle();
    }
    background(0);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

function playerHandler(){
    if (!playing) {
        player.start();
        playing = true;
    } else {
        player.stop();
        playing = false;
    }
}

function draw() {
    // console.log(analyzer.getValue());

    let yoff = 0;
    for(y = 0; y < rows; y++){
        let xoff = 0;
        for (x = 0; x < cols; x++){
            var index = x + y * cols;
            noisey = noise(xoff, yoff, zoff)
            var angle = - noise(xoff, yoff, zoff) * TWO_PI
            var v = p5.Vector.fromAngle(angle);
            v.setMag(0.1);
            flowfield[index] = v; 
            xoff += inc;
            // stroke(0, 50);
            // strokeWeight(1);
            // push();
            // translate(x * scl, y * scl);
            // rotate(v.heading());
            // line(0, 0, scl, 0);
            // pop();
        }
        yoff += inc;
        zoff += 0.000005;
    }
    for (i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].show(color);
        particles[i].edges();
    }
    colorOff += 0.1;
}