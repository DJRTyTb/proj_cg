import { GameObject } from "./GameObject.js";

const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;

export class Player extends GameObject
{
    constructor(mesh)
    {
        super(
            "Player",
            mesh
        );

        this.normalSpeed = 8.0;
        this.sprintSpeed = 18.0;

        this.moveSpeed = this.normalSpeed;
        this.rotationSpeed = 2.5;

        this.currentYaw = 0.0;

        this.inputState =
        {
            moveForward: false,
            moveBackward: false,
            turnLeft: false,
            turnRight: false,
            sprint: false
        };

        this.color = vec3.fromValues(
            0.2,
            0.8,
            0.2
        );

        this.registerInputEvents();
    }

    registerInputEvents()
    {
        window.addEventListener(
            "keydown",
            (event) =>
            {
                switch (event.code)
                {
                    case "KeyW":
                        this.inputState.moveForward = true;
                        break;

                    case "KeyS":
                        this.inputState.moveBackward = true;
                        break;

                    case "KeyA":
                        this.inputState.turnLeft = true;
                        break;

                    case "KeyD":
                        this.inputState.turnRight = true;
                        break;
                    
                    case "ShiftLeft":
                        this.inputState.sprint = true;
                        break;
                }
            }
        );

        window.addEventListener(
            "keyup",
            (event) =>
            {
                switch (event.code)
                {
                    case "KeyW":
                        this.inputState.moveForward = false;
                        break;

                    case "KeyS":
                        this.inputState.moveBackward = false;
                        break;

                    case "KeyA":
                        this.inputState.turnLeft = false;
                        break;

                    case "KeyD":
                        this.inputState.turnRight = false;
                        break;
                    
                    case "ShiftLeft":
                        this.inputState.sprint = false;
                        break;
                }
            }
        );
    }

    update(deltaTime)
    {
        this.moveSpeed = this.inputState.sprint
            ? this.sprintSpeed
            : this.normalSpeed;

        if (this.inputState.turnLeft)
            this.currentYaw += this.rotationSpeed * deltaTime;

        if (this.inputState.turnRight)
            this.currentYaw -= this.rotationSpeed * deltaTime;

        this.transform.rotation[1] = this.currentYaw;

        const forwardX = Math.sin(this.currentYaw);
        const forwardZ = Math.cos(this.currentYaw);

        if (this.inputState.moveForward)
        {
            this.transform.position[0] +=
                forwardX *
                this.moveSpeed *
                deltaTime;

            this.transform.position[2] +=
                forwardZ *
                this.moveSpeed *
                deltaTime;
        }

        if (this.inputState.moveBackward)
        {
            this.transform.position[0] -=
                forwardX *
                this.moveSpeed *
                deltaTime;

            this.transform.position[2] -=
                forwardZ *
                this.moveSpeed *
                deltaTime;
        }
    }
}