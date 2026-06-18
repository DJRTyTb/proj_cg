import { ShaderProgram } from "./core/ShaderProgram.js";
import { Framebuffer } from "./core/Framebuffer.js";
import { Mesh } from "./core/Mesh.js";

import { Camera } from "./camera/Camera.js";
import { MainCameraController } from "./camera/MainCameraController.js";

import { RenderView } from "./RenderView.js";
import { PortalSystem } from "./PortalSystem.js";

import { Vec3 } from "../math/Vec3.js";

export class Renderer
{
    constructor(gl, canvas)
    {
        this.gl = gl;
        this.canvas = canvas;

        this.scene = null;

        this.sceneShader = null;
        this.uiShader = null;

        this.mainCameraController = null;

        this.portalSystem = null;

        this.minimap = null;

        this.cameras =
        {
            main: null,

            portalA: null,
            portalB: null
        };

        this.framebuffers =
        {
            minimap: null,

            portalA: null,
            portalB: null
        };

        this.cubeMesh = null;
        this.planeMesh = null;
        this.screenQuadMesh = null;

        this.currentFramebuffer = null;

        this.lightDirection =
            Vec3.fromValues(
                -1.0,
                -1.0,
                -0.5
            );

        this.lightColor =
            Vec3.fromValues(
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
        this.createPortalCameras();
    }

    initializeScene(
        scene,
        mainCamera
    )
    {
        this.scene = scene;
        this.cameras.main = mainCamera;

        this.mainCameraController = new MainCameraController(this.cameras.main, this.scene);
        this.portalSystem = new PortalSystem(this, this.scene);

        this.createMinimap();
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
        this.framebuffers.minimap =
            new Framebuffer(
                this.gl,
                512,
                512
            );

        this.framebuffers.minimap.initialize();

        this.framebuffers.portalA =
            new Framebuffer(
                this.gl,
                512,
                512
            );

        this.framebuffers.portalA.initialize();

        this.framebuffers.portalB =
            new Framebuffer(
                this.gl,
                512,
                512
            );

        this.framebuffers.portalB.initialize();
    }

    createPortalCameras()
    {
        this.cameras.portalA = new Camera();
        this.cameras.portalB = new Camera();

        this.cameras.portalA.setPerspective(
            60.0,
            1.0,
            0.1,
            500.0
        );

        this.cameras.portalB.setPerspective(
            60.0,
            1.0,
            0.1,
            500.0
        );
    }

    createMinimap()
    {
        this.minimap = new RenderView(
            this,
            this.scene,
            {
                framebuffer: this.framebuffers.minimap,
                portalSystem: this.portalSystem,
                screenX: 20,
                screenY: this.canvas.height - 270,
                width: 250,
                height: 250,

                updateCallback:
                    (camera, scene) =>
                    {
                        const player = scene.player;
                        if (!player) return;

                        const position = player.transform.position;

                        camera.setPosition(
                            position[0],
                            position[1] + 50.0,
                            position[2] + 5.0
                        );

                        camera.setTarget(
                            position[0],
                            position[1],
                            position[2]
                        );
                    }
            }
        );

        this.minimap.camera.setPerspective(
            60.0,
            1.0,
            0.1,
            500.0
        );
    }

    createMeshes()
    {
        this.cubeMesh = this.createCubeMesh();
        this.planeMesh = this.createPlaneMesh();
        this.screenQuadMesh = this.createScreenQuadMesh();
    }

    update(deltaTime)
    {
        this.scene.update(deltaTime);

        this.mainCameraController.update();
        this.portalSystem.update();
        this.minimap.update();
    }

    render()
    {
        const textureStates = this.portalSystem.hidePortals();

        this.minimap.render();
        this.portalSystem.render();

        this.portalSystem.showPortals(textureStates.textureState1, textureStates.textureState2);

        this.renderToScreen(
            this.scene,
            this.cameras.main
        );

        this.minimap.screenY = this.canvas.height - 270;

        this.minimap.draw();
    }

    renderScene(
        scene,
        camera
    )
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

        for (const gameObject of scene.gameObjects)
            this.drawGameObject(gameObject);
    }

    drawGameObject(gameObject)
    {
        if (!gameObject.isVisible) return;
        if (this.currentFramebuffer && gameObject.texture === this.currentFramebuffer.colorTexture) return;

        gameObject.transform.updateMatrix();

        this.sceneShader.setMat4(
            "uModelMatrix",
            gameObject.transform.modelMatrix
        );

        this.sceneShader.setVec3(
            "uObjectColor",
            gameObject.color
        );

        this.sceneShader.setInt(
            "uUseTexture",
            gameObject.useTexture
                ? 1
                : 0
        );

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        if (
            gameObject.useTexture &&
            gameObject.texture
        )
        {
            this.gl.activeTexture(this.gl.TEXTURE0);

            this.gl.bindTexture(
                this.gl.TEXTURE_2D,
                gameObject.texture
            );

            this.sceneShader.setInt(
                "uTexture",
                0
            );
        }

        if (
            this.currentFramebuffer &&
            gameObject.texture === this.currentFramebuffer.colorTexture
        )
        {
            console.warn(
                "Feedback loop:",
                gameObject.name
            );
        }

        gameObject.mesh.draw();
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

        this.currentFramebuffer = framebuffer;

        this.clear();
        this.renderScene(scene, camera);
        const err = this.gl.getError();
        if (err) console.log("GL ERROR", err);

        this.gl.activeTexture(this.gl.TEXTURE0);

        this.gl.bindTexture(
            this.gl.TEXTURE_2D,
            null
        );

        framebuffer.unbind(
            this.canvas.width,
            this.canvas.height
        );

        this.currentFramebuffer = null;
    }

    renderToScreen(
        scene,
        camera
    )
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

        this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(
                this.gl.TEXTURE_2D,
                null
            );
    }

    drawTexture(
        texture,
        x,
        y,
        width,
        height
    )
    {
        this.gl.bindTexture(
            this.gl.TEXTURE_2D,
            null
        );

        this.gl.activeTexture(
            this.gl.TEXTURE0
        );

        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            null
        );

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

    drawRectangleOutline(
        x,
        y,
        width,
        height
    )
    {
        const gl = this.gl;

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.SCISSOR_TEST);

        gl.scissor(
            x - 2,
            y - 2,
            width + 4,
            2
        );

        gl.clearColor(
            1,
            1,
            1,
            1
        );

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.scissor(
            x - 2,
            y + height,
            width + 4,
            2
        );

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.scissor(
            x - 2,
            y - 2,
            2,
            height + 4
        );

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.scissor(
            x + width,
            y - 2,
            2,
            height + 4
        );

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
            0, 2, 3,

            2, 1, 0,
            3, 2, 0
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
}