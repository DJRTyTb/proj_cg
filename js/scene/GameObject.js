import { Transform } from "../math/Transform.js";

const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;

export class GameObject
{
    constructor(name, mesh)
    {
        this.name = name;
        this.mesh = mesh;

        this.transform = new Transform();

        this.color = vec3.fromValues(
            0.8,
            0.8,
            0.8
        );

        this.isVisible = true;
    }

    update(deltaTime) { }

    draw(shaderProgram)
    {
        if (!this.isVisible) return;

        this.transform.updateMatrix();

        shaderProgram.setMat4(
            "uModelMatrix",
            this.transform.modelMatrix
        );

        shaderProgram.setVec3(
            "uObjectColor",
            this.color
        );

        this.mesh.draw();
    }
}