import { Transform } from "../math/Transform.js";
import { Vec3 } from "../math/Vec3.js";

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
            Vec3.fromValues(
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