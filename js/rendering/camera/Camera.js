import { Vec3 } from "../../math/Vec3.js";
import { Mat4 } from "../../math/Mat4.js";

export class Camera
{
    constructor()
    {
        this.position =
            Vec3.fromValues(
                0.0,
                0.0,
                0.0
            );

        this.target =
            Vec3.fromValues(
                0.0,
                0.0,
                -1.0
            );

        this.up =
            Vec3.fromValues(
                0.0,
                1.0,
                0.0
            );

        this.fieldOfView = 60.0;
        this.aspectRatio = 1.0;
        this.nearPlane = 0.1;
        this.farPlane = 1000.0;

        this.viewMatrix = Mat4.create();
        this.projectionMatrix = Mat4.create();
    }

    updateViewMatrix()
    {
        Mat4.lookAt(
            this.viewMatrix,
            this.position,
            this.target,
            this.up
        );
    }

    updateProjectionMatrix()
    {
        Mat4.perspective(
            this.projectionMatrix,
            glMatrix.glMatrix.toRadian(this.fieldOfView),
            this.aspectRatio,
            this.nearPlane,
            this.farPlane
        );
    }

    setPerspective(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    )
    {
        this.fieldOfView = fieldOfView;
        this.aspectRatio = aspectRatio;
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;

        this.updateProjectionMatrix();
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

    setTarget(
        x,
        y,
        z
    )
    {
        Vec3.set(
            this.target,
            x,
            y,
            z
        );
    }

    lookAtPosition(
        positionVector
    )
    {
        Vec3.copy(
            this.target,
            positionVector
        );
    }

    update()
    {
        this.updateViewMatrix();
    }
}