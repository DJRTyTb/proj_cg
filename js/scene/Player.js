import { GameObject } from "./GameObject.js";

const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;

export class Player extends GameObject
{
    constructor(mesh, scene)
    {
        super(
            "Player",
            mesh
        );

        this.scene = scene;

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
            const nextX = this.transform.position[0] + forwardX * this.moveSpeed * deltaTime;
            const nextZ = this.transform.position[2] + forwardZ * this.moveSpeed * deltaTime;

            if (!this.checkCollision(nextX, nextZ)) {
                this.transform.position[0] = nextX;
                this.transform.position[2] = nextZ;
            }

            const tp = this.checkTeleportation(nextX, nextZ);
            if (tp) {
                this.transform.setPosition(
                    tp[0],
                    0.5,
                    tp[1]
                );
            }
        }

        if (this.inputState.moveBackward)
        {
            const nextX = this.transform.position[0] - forwardX * this.moveSpeed * deltaTime;
            const nextZ = this.transform.position[2] - forwardZ * this.moveSpeed * deltaTime;

            if (!this.checkCollision(nextX, nextZ)) {
                this.transform.position[0] = nextX;
                this.transform.position[2] = nextZ;
            }

            const tp = this.checkTeleportation(nextX, nextZ);
            if (tp) {
                this.transform.setPosition(
                    tp[0],
                    0.5,
                    tp[1]
                );
            }
        }
    }

    checkCollision(x, z) {
        for (const object of this.scene.gameObjects)
        {
            if (object.name === "Wall") {
                const objectPosition = object.transform.position;

                const dx = x - objectPosition[0];
                const dz = z - objectPosition[2];

                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < 3.0) return true;
            }
        }

        return false;
    }

    checkTeleportation(x, z) {
        for (const object of this.scene.gameObjects)
        {
            if (object.name === "Portal1") {
                const portalPosition = object.transform.position;

                const dx = x - portalPosition[0];
                const dz = z - portalPosition[2];

                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < 3.0) return [this.scene.portal1.exitX, this.scene.portal1.exitZ];
            }
            else if (object.name === "Portal2") {
                const portalPosition = object.transform.position;

                const dx = x - portalPosition[0];
                const dz = z - portalPosition[2];

                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance < 3.0) return [this.scene.portal2.exitX, this.scene.portal2.exitZ];
            }
        }

        return undefined;
    }
}