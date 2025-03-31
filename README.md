# RocketAnimation
Rocket Animation and Landing Simulation

Overview
This project is a 2D rocket animation and simulation built using JavaScript and the p5.js library. It showcases a functional model of a rocket's launch, ascent, second-stage separation, reentry, and landing. The simulation highlights basic physics concepts like gravity, thrust, and deceleration, making it a dynamic and interactive representation of real-world systems.
This project aims to demonstrate programming skills applicable to sensor-based systems or physics simulations, emphasizing modular code, reusability, and realistic dynamics.

Features
Rocket Launch Animation:
Multi-stage rocket simulation with visual particle effects for ignition and thrust.
Interactive Controls:
Use arrow keys to guide the rocket horizontally during the ascent.
Smooth reentry and landing sequence.
Particle System:
Dynamic particle emitters that simulate rocket thrusters and reentry visuals.
Physics Integration:
Gravity, thrust, and deceleration logic for realistic movement.
Platform Landing:
Precise landing mechanics with distance calculations and gradual speed adjustments.

Installation
To run this project locally:
Clone this repository:
 git clone https://github.com/Hatonjan/RocketAnimation.git

Open the project directory:
 cd RocketAnimation

Open the index.html file in your browser to view the simulation.

How to Play
Ignite the Rocket:
Press the Space key to launch the rocket.
Guide the Rocket:
Use the Left or Right Arrow keys to adjust the rocket's horizontal position during ascent or descent.
Landing:
Watch the rocket gradually decelerate and land on the platform!

Project Structure
|-- index.html            // Main HTML file
|-- p5.min.js              // Compressed version of the p5.js library
|-- p5.sound.min.js   // Compressed version of the p5.js sound library
|-- sketch.js              // Core p5.js script containing the simulation logic



Key Concepts Demonstrated
This project showcases:
Modularity:
Code is structured into constructors for reusability, including Particle and Emitter.
Physics Simulation:
Gravity and thrust interactions, adjustable using constants for easier tuning.
Real-Time Interactivity:
Dynamic response to user inputs, simulating precision rocket control.
Animation:
Visually engaging effects, including particle emitters and smooth transitions between flight phases.

Future Improvements
Planned updates include:
Adding smooth easing for thrust deceleration during landing.
Displaying telemetry data (e.g., velocity, distance to platform) on the canvas.
Enhancing visuals with animations or additional particle effects.
Improving landing physics for more realistic touchdown mechanics.

Technologies Used
p5.js: A JavaScript library for creative coding and 2D graphics.
JavaScript: Core programming language for the simulation logic.

Getting Involved
If you're interested in contributing to this project, feel free to:
Fork the repository.


Create a new branch:
 git checkout -b feature-name


Commit your changes:
 git commit -m "Added a feature: description"


Push to your branch and create a pull request!

Acknowledgments
This project is inspired by the physics behind rocket launches and real-world landing simulations (e.g., SpaceX). Thanks to the p5.js community for providing tools to make this project possible.

License
This project is open-source and available under the MIT License.


