const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;

export class Camera
{
    constructor()
    {
        this.position =
            vec3.fromValues(
                0.0,
                0.0,
                0.0
            );

        this.target =
            vec3.fromValues(
                0.0,
                0.0,
                -1.0
            );

        this.up =
            vec3.fromValues(
                0.0,
                1.0,
                0.0
            );

        this.fieldOfView = 60.0;
        this.aspectRatio = 1.0;
        this.nearPlane = 0.1;
        this.farPlane = 1000.0;

        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    }

    updateViewMatrix()
    {
        mat4.lookAt(
            this.viewMatrix,
            this.position,
            this.target,
            this.up
        );
    }

    updateProjectionMatrix()
    {
        mat4.perspective(
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
        vec3.set(
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
        vec3.set(
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
        vec3.copy(
            this.target,
            positionVector
        );
    }

    update()
    {
        this.updateViewMatrix();
    }
}