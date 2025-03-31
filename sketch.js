let baseLine;
let rocket; 
let fistStage;
let secondStage; 
let fistStageReentry;
let gravity = 2.45;
let interaction = false;

/* Particle Constructor: 
   Creates particles used to simulate the rocket's ignition system.
   Each particle has its own properties, which update its movement and render it on the canvas. */
function Particle(x, y, xSpeed, ySpeed, size, color) {
	this.x      = x;      // Initial x position of the particle
	this.y      = y;      // Initial y position of the particle
	this.xSpeed = xSpeed; // Speed of the particle along the x axes
	this.ySpeed = ySpeed; // Speed of the particle along the y axes
	this.size   = size;   // Size of the particle 
	this.color  = color;  // Color of the particle
	this.age    = 0;      // Age of the particle
	
	// Draw the particles
	this.drawParticle = function() {
		fill(this.color)
		noStroke();
		ellipse(this.x, this.y, this.size/4, this.size)
	}

		// Updates the particle's position based on its speed and increments its age.
		// Age is used to determine when the particle should disappear (handled by the emitter).
		this.updateParticle = function() {
			this.x += this.xSpeed; // Updates the particle's x position 
			this.y += this.ySpeed; // Updates the particle's y position 
			this.age++;            // Updates the particle's age 
		}
	}
	
	/* Emitter Constructor:
	Creates an emitter that generates and manages particles. 
	Each emitter has properties to control the particle's behavior, 
	lifetime, and appearance, and handles updating and rendering the particles. 
	*/
	function Emitter(x, y, xSpeed, ySpeed, size, color) {
		this.x              = x; 	  // Initial x position of the particle
		this.y              = y;      // Initial y position of the particle
		this.xSpeed         = xSpeed; // Speed of the particle along the x axes
		this.ySpeed         = ySpeed; // Speed of the particle along the y axes
		this.size           = size;   // Size of the particle 
		this.color          = color;  // Color of the particle
		this.startParticles = 0;      // Number of particles to start with
		this.lifetime       = 0;      // Lifetime of the particles
		this.particles      = [];     // Array to hold the particles
	
		// Adds a new particle to the emitter with a random position.
		this.addParticle = function() {
			let p = new Particle(
				random(this.x -4 , this.x + 4), 
				random(this.y -4 , this.y + 4), 
				random(this.xSpeed -1 , this.xSpeed + 1), 
				random(this.ySpeed -1 , this.ySpeed + 1), 
				random(this.size -2 , this.size + 2), 
				this.color);
			return p;		
		}
	
		// Starts the emitter by generating a specified number of particles and setting their lifetime.
		this.startEmitter = function(startParticles, lifetime) {
			this.startParticles = startParticles;
			this.lifetime = lifetime;
	
			// Start the emitter
			for(let i = 0; i < startParticles; i++) {
				this.particles.push(this.addParticle());
			}
		}

		// Updates the particles by drawing them on the canvas and updating their positions.
		this.updateParticles = function() {
			let deadParticles = 0;
			// Iterate throw particles and draw to the screen
			for(let i = this.particles.length - 1; i >= 0; i--) {
				this.particles[i].drawParticle();
				this.particles[i].updateParticle();
				if(this.particles[i].age > random(0, this.lifetime)) {
					this.particles.splice(i, 1);
					deadParticles++;
				}
			}
			
			// Add new particles wen the particles die
			if(deadParticles > 0) {
				for(var i = 0; i < deadParticles; i++) {
					this.particles.push(this.addParticle());
				}
			}
		}
	}

/* setup:
Acting as a place to instantiate and initialize the Rocket object and its related emitters */	
function setup() {
	// Set up the canvas
    createCanvas(800, 700);

	// Initialize the variables
    baseLine = height - 100
    rocket ={
        x: width/4, // Initial x position of the rocket
        y: baseLine, // Initial y position of the rocket
        sx: width/4, // Initial x position of the second stage
        sy: baseLine, // Initial y position of the second stage
		isLeft: false, // Flag to check if the left arrow key is pressed
		isRight: false, // Flag to check if the right arrow key is pressed
		success: false, // Flag to check if the first stage has successfully completed
		reentry: false, // Flag to check if the rocket is in reentry phase
		ignition: false, // Flag to check if the rocket is ignited
		secondThrust: false, // Flag to check if the second stage is ignited 
		rocketInLaunchPad: true, // Flag to check if the rocket is in the launch pad
		
		
		// Draw the rocket
		drawRocket: function() {
			// Define the rocket's parameters
			const x = this.x + 10; // Initial x position of the rocket
			const y = this.y + 50; // Initial y position of the rocket
			
			 //draw the rocket fist stage
			fill(176,196,222);
			noStroke();
			rect(x, y - 40, 10, 40);
			
			fill(33, 58, 125);
			triangle(x - 10, y, x, y - 20, x, y);
			triangle(x + 20, y, x + 10, y - 20, x + 10, y);

			// First stage ignition animation
			if (this.ignition) {				
				fistStage.updateParticles(); // particle emitter
				fistStage.y = y + 5;
				fistStage.x = x + 5;
			} 
			// Second stage ignition animation
			if (this.success) {
				secondStage.updateParticles(); // particle emitter
				secondStage.y = this.sy + 8;
				secondStage.x = this.sx + 16;
			}
			// Reentry ignition animation
			if (this.reentry) {
				fistStageReentry.updateParticles(); // particle emitter
				fistStageReentry.y = y + 5;
				fistStageReentry.x = x + 5;
			}
		},

		// Draw the second stage of the rocket
		secondStage: function() {
			// Define the rocket's parameters
			const sx = this.sx + 10; // Initial x position of the second stage
			const sy = this.sy - 30; // Initial y position of the second stage

			// Draw the second stage of the rocket
			fill(176,196,222);
			beginShape();
			vertex(sx , sy + 40);
			vertex(sx , sy);
			vertex(sx + 2, sy - 5);
			vertex(sx + 8, sy - 5);
			vertex(sx + 10, sy);
			vertex(sx + 10, sy + 40);
			endShape(CLOSE);
		},
		
		gravity: function() {
			// Apply gravity to the rocket
			if (!this.rocketInLaunchPad) {
			this.y += gravity;
			this.sy += gravity;
			} 
			
		},
		
		// Logic to move the rocket and initiate the fistStage
		moveRocket: function() {
			// Define the rocket's parameters
			const successHeight = 150; // Height at which the rocket successfully completes the first stage
			const thrustAcceleration = 0.75; // Thrust acceleration speed
			const accelerationHeight = 530; // Height at which the rocket accelerates
			const secondThrustSpeed = 0.25; // Speed of the second thrust
			const reentryHeight = 300; // Height at which the rocket reenters
			const reentrySpeed = 1.2; // Speed of the reentry
			const thrustSpeed = 2.85; // Thrust speed
			const horizontalSpeed = 1.5; // Horizontal speed of the rocket for the user interaction

			// Arrow function to update the rocket's position
			const updatePosition = (dy, dx = 0) => {
				this.y  -= dy;
				this.sy -= dy;
				this.x  += dx;
				this.sx += dx;
			}

			// Check if the rocket is in the launch pad
			if (this.ignition) {
				updatePosition(thrustSpeed);
			}

			// Check if the rocket is in the launch pad and apply thrust acceleration
			if(this.ignition && this.y < accelerationHeight) {
				updatePosition(thrustAcceleration, 0.2);
			}

			// Check if the rocket has successfully completed the first stage
			if (this.y <= successHeight) {
				this.success = true;
				this.ignition = false;
				this.secondThrust = true;
			}

			// Check if the rocket is in the second stage and apply thrust acceleration
			if (this.secondThrust) {
				updatePosition(secondThrustSpeed, 0.3);
				this.sy -= 3.25;
			}

			// Check if the rocket is in the reentry phase
			if (this.success && this.y > reentryHeight) {
				updatePosition(reentrySpeed);
				this.reentry = true;
			}

			// Check if the rocket is in the reentry phase and apply thrust acceleration
			if (this.y <= accelerationHeight){
				interaction = true;
			}

			// User interaction to move the rocket
			if (this.isLeft) {
				this.x -= horizontalSpeed;
				this.sx -= horizontalSpeed;
			}

			// User interaction to move the rocket
			if (this.isRight) {
				this.x += horizontalSpeed;
				this.sx += horizontalSpeed;
			}
		},

		// Draw the ground
		drawGround: function() {
			// Define the ground's parameters
			const x = 0;
			const y = height - 40; 
			const groundHeight = 40;
			const groundWidth = width;

			// Draw the ground
			fill(150),
			rect(x, y, groundWidth, groundHeight);
		},

		// Draw the platform
		drawPlatform: function() {
			// Define the platform's parameters
			const x = 190; // Initial x position of the platform
			const y = height - 112; // Initial y position of the platform
			const platformWidth = 15; // Width of the platform
			const platformHeight = 70; // Height of the platform
			const platformStroke = color(140,50,10); // Stroke color of the platform

			// Draw the platform
			push();
			noFill();
			stroke(platformStroke);
			strokeWeight(6);
			rect(x, y, platformWidth, platformHeight);
			strokeWeight(2);
			pop();

			// Draw the platform's legs
			if((this.success && this.y > height - 150) || !this.ignition) {
				push();
				noFill();
				stroke(platformStroke);
				strokeWeight(6);
				line(x + 15, y + 32, x + 30, y + 32);
				strokeWeight(2);
				pop();
			}
		}
    };

	// Initialize the fist stage emitter
	fistStage = new Emitter(this.x, this.y, 0, 2, 2, color(230, 150, 0));
	fistStage.startEmitter(400, 5);

	// Initialize the second stage emitter
	secondStage = new Emitter(this.sx, this.sy, 0, 2, 2, color(230, 150, 0));
	secondStage.startEmitter(400, 5);
	
	// Initialize the reentry emitter
	fistStageReentry = new Emitter(this.x, this.y, 0, 2, 2, color(230, 150, 255));
	fistStageReentry.startEmitter(200, 5);
	

}

/* rocketLanding:
   Define the parameters of the reentry sequence to create the landing animation */
function rocketLanding() {
	// Arrow function to calculate distance from the platform
	const distanceFromPlatform = (x1, y1, x2, y2) => {
		const dx = x1 - x2;
		const dy = y1 - y2;
		return sqrt(dx * dx + dy * dy);
	}

	// Check if the rocket is in the reentry phase and calculate the distance from the platform
	const distance = distanceFromPlatform(rocket.x, rocket.y, 190, height - 112); // Calculate the distance from the platform
	const verticalDistance = baseLine - rocket.y; // Calculate the vertical distance from the ground
	const targetY = height - 112; // Target y position of the platform
	const targetX = 202; // Target x position of the platform

	// Check if the rocket is in the reentry phase and adjust its position accordingly  
	if (rocket.reentry && distance > 0 && rocket.x > targetX) {
		let speedX = map(distance, 0, 600, 0.3, 1.2);
		let speedY = map(verticalDistance, 10, 440, 1, -2.45);
		rocket.x -= speedX;
		rocket.y -= speedY;
	} else if (rocket.reentry && distance > 0 && rocket.x < targetX) {
		let speedX = map(distance, 0, 400, 0.3, 1);
		let speedY = map(verticalDistance, 10, 440, 1, -2.45);
		rocket.x += speedX;
		rocket.y -= speedY;
	} 

	// Check if the rocket is in the reentry phase and adjust its position accordingly
	if (dist(rocket.x, rocket.y, targetX, targetY) < 2) {
		rocket.x = targetX;
		rocket.y = targetY;
	}
}

function draw() {
	background(10);

	// Draw the ground 
	rocket.drawGround();

    // Move the rocket
	rocket.moveRocket();
    
	// Draw Rocket
	rocket.gravity();
	rocket.drawRocket();
	rocket.secondStage(); 

	// DRaw the platform
	rocket.drawPlatform();

	// Rocket landing Animation
	rocketLanding();
}

function keyPressed() {
	
	// Check if the space key is pressed to ignite the rocket
	if (keyCode == 32) {
		rocket.ignition = true;
		rocket.rocketInLaunchPad = false;
	}

	// Check if the left or right arrow keys are pressed to move the rocket
	if(keyCode === 37 && interaction && !rocket.success) {
		rocket.isLeft = true;
	}
	if(keyCode === 39 && interaction && !rocket.success) {
		rocket.isRight = true;
	}
}

function keyReleased() {

	// Check if the left or right arrow keys are released to stop moving the rocket
	if (keyCode === 37) {
		rocket.isLeft = false;
	}
	if (keyCode === 39) {
		rocket.isRight = false;
	}
}


	
