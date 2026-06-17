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

        this.texture = null;
        this.useTexture = false;

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

        shaderProgram.setInt(
            "uUseTexture",
            this.useTexture ? 1 : 0
        );

        if (this.useTexture)
        {
            this.mesh.gl.activeTexture(
                this.mesh.gl.TEXTURE0
            );

            this.mesh.gl.bindTexture(
                this.mesh.gl.TEXTURE_2D,
                this.texture
            );

            shaderProgram.setInt(
                "uTexture",
                0
            );
        }

        this.mesh.draw();
    }
}