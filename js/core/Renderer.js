import { ShaderProgram } from "./ShaderProgram.js";
import { Framebuffer } from "./Framebuffer.js";
import { Mesh } from "./Mesh.js";

const vec3 = glMatrix.vec3;

export class Renderer
{
    constructor(gl, canvas)
    {
        this.gl = gl;
        this.canvas = canvas;

        this.sceneShader = null;
        this.uiShader = null;

        this.minimapFramebuffer = null;
        this.portalFramebuffer = null;

        this.cubeMesh = null;
        this.planeMesh = null;
        this.screenQuadMesh = null;

        this.lightDirection = vec3.fromValues(
            -1.0,
            -1.0,
            -0.5
        );

        this.lightColor = vec3.fromValues(
            1.0,
            1.0,
            1.0
        );
    }

    async initialize()
    {
        this.configureWebGL();

        await this.createShaders();

        this.createFramebuffers();

        this.createMeshes();
    }

    configureWebGL()
    {
        this.gl.enable(this.gl.DEPTH_TEST);

        this.gl.depthFunc(this.gl.LEQUAL);

        this.gl.enable(this.gl.CULL_FACE);

        this.gl.cullFace(this.gl.BACK);

        this.gl.clearColor(
            0.10,
            0.12,
            0.16,
            1.0
        );
    }

    async createShaders()
    {
        this.sceneShader = new ShaderProgram(this.gl);
        await this.sceneShader.load(
            "shaders/scene.vert",
            "shaders/scene.frag"
        );

        this.uiShader = new ShaderProgram(this.gl);
        await this.uiShader.load(
            "shaders/ui.vert",
            "shaders/ui.frag"
        );
    }

    createFramebuffers()
    {
        this.minimapFramebuffer =
            new Framebuffer(
                this.gl,
                512,
                512
            );
        this.minimapFramebuffer.initialize();

        this.portalFramebuffer =
            new Framebuffer(
                this.gl,
                512,
                512
            );
        this.portalFramebuffer.initialize();
    }

    createMeshes()
    {
        this.cubeMesh = this.createCubeMesh();
        this.planeMesh = this.createPlaneMesh();
        this.screenQuadMesh = this.createScreenQuadMesh();
    }

    createCubeMesh()
    {
        const vertices =
        [
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,

            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5, -0.5, -0.5,

            -0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,

            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,

             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,
             0.5, -0.5,  0.5,

            -0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5
        ];

        const normals =
        [
             0,  0,  1,
             0,  0,  1,
             0,  0,  1,
             0,  0,  1,

             0,  0, -1,
             0,  0, -1,
             0,  0, -1,
             0,  0, -1,

             0,  1,  0,
             0,  1,  0,
             0,  1,  0,
             0,  1,  0,

             0, -1,  0,
             0, -1,  0,
             0, -1,  0,
             0, -1,  0,

             1,  0,  0,
             1,  0,  0,
             1,  0,  0,
             1,  0,  0,

            -1,  0,  0,
            -1,  0,  0,
            -1,  0,  0,
            -1,  0,  0
        ];

        const indices =
        [
             0,  1,  2,   0,  2,  3,
             4,  5,  6,   4,  6,  7,
             8,  9, 10,   8, 10, 11,
            12, 13, 14,  12, 14, 15,
            16, 17, 18,  16, 18, 19,
            20, 21, 22,  20, 22, 23
        ];

        return new Mesh(
            this.gl,
            vertices,
            normals,
            indices
        );
    }

    createPlaneMesh()
    {
        const vertices =
        [
            -0.5, 0.0, -0.5,
             0.5, 0.0, -0.5,
             0.5, 0.0,  0.5,
            -0.5, 0.0,  0.5
        ];

        const normals =
        [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ];

        const indices =
        [
            0, 1, 2,
            0, 2, 3
        ];

        return new Mesh(
            this.gl,
            vertices,
            normals,
            indices
        );
    }

    createScreenQuadMesh()
    {
        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);

        const vertices =
        [
            -1.0, -1.0, 0.0, 0.0,
             1.0, -1.0, 1.0, 0.0,
             1.0,  1.0, 1.0, 1.0,

            -1.0, -1.0, 0.0, 0.0,
             1.0,  1.0, 1.0, 1.0,
            -1.0,  1.0, 0.0, 1.0
        ];

        const vertexBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(
            this.gl.ARRAY_BUFFER,
            vertexBuffer
        );

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            this.gl.STATIC_DRAW
        );

        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(
            0,
            2,
            this.gl.FLOAT,
            false,
            16,
            0
        );

        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(
            1,
            2,
            this.gl.FLOAT,
            false,
            16,
            8
        );

        this.gl.bindVertexArray(null);

        return {
            vao,
            vertexCount: 6
        };
    }

    renderScene(scene, camera)
    {
        this.sceneShader.use();

        this.sceneShader.setMat4(
            "uViewMatrix",
            camera.viewMatrix
        );

        this.sceneShader.setMat4(
            "uProjectionMatrix",
            camera.projectionMatrix
        );

        this.sceneShader.setVec3(
            "uLightDirection",
            this.lightDirection
        );

        this.sceneShader.setVec3(
            "uLightColor",
            this.lightColor
        );

        scene.draw(this.sceneShader);
    }

    clear()
    {
        this.gl.clear(
            this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT
        );
    }

    renderToFramebuffer(framebuffer, scene, camera)
    {
        framebuffer.bind();

        this.clear();

        this.renderScene(
            scene,
            camera
        );
    }

    renderToScreen(scene, camera)
    {
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            null
        );

        this.gl.viewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.clear();

        this.renderScene(
            scene,
            camera
        );
    }

    drawTexture(texture, x, y, width, height)
    {
        this.gl.disable(this.gl.DEPTH_TEST);

        this.uiShader.use();

        this.gl.viewport(
            x,
            y,
            width,
            height
        );

        this.gl.activeTexture(this.gl.TEXTURE0);

        this.gl.bindTexture(
            this.gl.TEXTURE_2D,
            texture
        );

        this.uiShader.setInt(
            "uRenderedTexture",
            0
        );

        this.gl.bindVertexArray(this.screenQuadMesh.vao);

        this.gl.drawArrays(
            this.gl.TRIANGLES,
            0,
            this.screenQuadMesh.vertexCount
        );

        this.gl.bindVertexArray(null);

        this.gl.enable(this.gl.DEPTH_TEST);

        this.gl.viewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    drawRectangleOutline(x, y, width, height)
    {
        const gl = this.gl;

        gl.disable(gl.DEPTH_TEST);

        const left = x;
        const right = x + width;

        const bottom = y;
        const top = y + height;

        gl.enable(gl.SCISSOR_TEST);

        gl.scissor(left - 2, bottom - 2, width + 4, 2);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.scissor(left - 2, top, width + 4, 2);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.scissor(left - 2, bottom - 2, 2, height + 4);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.scissor(right, bottom - 2, 2, height + 4);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.disable(gl.SCISSOR_TEST);

        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(
            0.10,
            0.12,
            0.16,
            1.0
        );
    }
}