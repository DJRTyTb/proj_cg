export class Mesh
{
    constructor(gl, vertices, normals, indices)
    {
        this.gl = gl;

        this.vertexArrayObject = null;

        this.vertexBuffer = null;
        this.normalBuffer = null;
        this.indexBuffer = null;

        this.indexCount = indices.length;

        this.initialize(
            vertices,
            normals,
            indices
        );
    }

    initialize(vertices, normals, indices)
    {
        this.vertexArrayObject = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vertexArrayObject);

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(
            this.gl.ARRAY_BUFFER,
            this.vertexBuffer
        );

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            this.gl.STATIC_DRAW
        );

        this.gl.enableVertexAttribArray(0);

        this.gl.vertexAttribPointer(
            0,
            3,
            this.gl.FLOAT,
            false,
            0,
            0
        );

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(
            this.gl.ARRAY_BUFFER,
            this.normalBuffer
        );

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(normals),
            this.gl.STATIC_DRAW
        );

        this.gl.enableVertexAttribArray(1);

        this.gl.vertexAttribPointer(
            1,
            3,
            this.gl.FLOAT,
            false,
            0,
            0
        );

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(
            this.gl.ELEMENT_ARRAY_BUFFER,
            this.indexBuffer
        );

        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            this.gl.STATIC_DRAW
        );

        this.gl.bindVertexArray(null);
    }

    draw()
    {
        this.gl.bindVertexArray(this.vertexArrayObject);

        this.gl.drawElements(
            this.gl.TRIANGLES,
            this.indexCount,
            this.gl.UNSIGNED_SHORT,
            0
        );

        this.gl.bindVertexArray(null);
    }
}