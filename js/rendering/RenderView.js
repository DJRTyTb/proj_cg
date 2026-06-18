import { Camera } from "./camera/Camera.js";

export class RenderView
{
    constructor(
        renderer,
        scene,
        options = {}
    )
    {
        this.renderer = renderer;
        this.scene = scene;

        this.camera = options.camera || new Camera();
        this.framebuffer = options.framebuffer;

        this.isVisible = options.isVisible ?? true;

        this.screenX = options.screenX ?? 0;
        this.screenY = options.screenY ?? 0;

        this.width = options.width ?? 256;
        this.height = options.height ?? 256;

        this.updateCallback = options.updateCallback ?? (() => {});
    }

    update()
    {
        this.updateCallback(
            this.camera,
            this.scene
        );

        this.camera.update();
    }

    render()
    {
        this.renderer.renderToFramebuffer(
            this.framebuffer,
            this.scene,
            this.camera
        );
    }

    draw()
    {
        if (!this.isVisible) return;

        this.renderer.drawTexture(
            this.framebuffer.colorTexture,
            this.screenX,
            this.screenY,
            this.width,
            this.height
        );

        this.renderer.drawRectangleOutline(
            this.screenX,
            this.screenY,
            this.width,
            this.height
        );
    }
}