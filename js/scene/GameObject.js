import { Transform } from "../math/Transform.js";

const vec3 = glMatrix.vec3;

export class GameObject
{
    constructor(
        name,
        mesh
    )
    {
        this.name = name;
        this.mesh = mesh;

        this.transform = new Transform();

        this.color =
            vec3.fromValues(
                0.8,
                0.8,
                0.8
            );

        this.texture = null;
        this.useTexture = false;
        this.isVisible = true;
    }

    update(deltaTime) { }
}