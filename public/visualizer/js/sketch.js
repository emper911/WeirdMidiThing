let w = 1270;
let h = 720;
let inc = 0.1;
let scl = 10;
let cols, rows;
let fr;
let zoff = 0;
let particles = [];
let colorOff = 1;
// let flowfield = [];

function setup(){
    let cnv = createCanvas(windowWidth, windowHeight);
    // cols = floor(width / scl);
    cols = floor(windowWidth / scl);
    // rows = floor(height / scl);
    rows = floor(windowHeight / scl);
    flowfield = new Array(cols * rows);

    for (i = 0; i < 500; i++) {
        particles[i] = new Particle();
    }
    // fr = createP('');
    background(0);
}

function draw() {
    // randomSeed(10);
    let yoff = 0;
    for(y = 0; y < rows; y++){
        let xoff = 0;
        for (x = 0; x < cols; x++){
            var index = x + y * cols;
            var angle = noise(xoff, yoff, zoff) * TWO_PI
            var v = p5.Vector.fromAngle(angle);
            v.setMag(5);
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
        particles[i].show(colorOff);
        particles[i].edges();

    }
    colorOff += 0.1;
    // fr.html(floor(frameRate()));
}