const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;

export class Transform
{
    constructor()
    {
        this.position =
            vec3.fromValues(
                0.0,
                0.0,
                0.0
            );

        this.rotation =
            vec3.fromValues(
                0.0,
                0.0,
                0.0
            );

        this.scale =
            vec3.fromValues(
                1.0,
                1.0,
                1.0
            );

        this.modelMatrix = mat4.create();
    }

    updateMatrix()
    {
        mat4.identity(this.modelMatrix);

        mat4.translate(
            this.modelMatrix,
            this.modelMatrix,
            this.position
        );

        mat4.rotateX(
            this.modelMatrix,
            this.modelMatrix,
            this.rotation[0]
        );

        mat4.rotateY(
            this.modelMatrix,
            this.modelMatrix,
            this.rotation[1]
        );

        mat4.rotateZ(
            this.modelMatrix,
            this.modelMatrix,
            this.rotation[2]
        );

        mat4.scale(
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
        vec3.set(
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
        vec3.set(
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
        vec3.set(
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