import { Vec3 } from "./Vec3.js";
import { Mat4 } from "./Mat4.js";

export class Transform
{
    constructor()
    {
        this.position =
            Vec3.fromValues(
                0.0,
                0.0,
                0.0
            );

        this.rotation =
            Vec3.fromValues(
                0.0,
                0.0,
                0.0
            );

        this.scale =
            Vec3.fromValues(
                1.0,
                1.0,
                1.0
            );

        this.modelMatrix = Mat4.create();
    }

    updateMatrix()
    {
        Mat4.identity(this.modelMatrix);

        Mat4.translate(
            this.modelMatrix,
            this.modelMatrix,
            this.position
        );

        Mat4.rotateX(
            this.modelMatrix,
            this.modelMatrix,
            this.rotation[0]
        );

        Mat4.rotateY(
            this.modelMatrix,
            this.modelMatrix,
            this.rotation[1]
        );

        Mat4.rotateZ(
            this.modelMatrix,
            this.modelMatrix,
            this.rotation[2]
        );

        Mat4.scale(
            this.modelMatrix,
            this.modelMatrix,
            this.scale
        );
    }

    setPosition(
        x,
        y,
        z
    )
    {
        Vec3.set(
            this.position,
            x,
            y,
            z
        );
    }

    setRotation(
        x,
        y,
        z
    )
    {
        Vec3.set(
            this.rotation,
            x,
            y,
            z
        );
    }

    setScale(
        x,
        y,
        z
    )
    {
        Vec3.set(
            this.scale,
            x,
            y,
            z
        );
    }

    translate(
        x,
        y,
        z
    )
    {
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;
    }

    rotate(
        x,
        y,
        z
    )
    {
        this.rotation[0] += x;
        this.rotation[1] += y;
        this.rotation[2] += z;
    }
}