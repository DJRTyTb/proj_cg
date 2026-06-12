import { Camera } from "../core/Camera.js";

export class PictureInPicture
{
    constructor(renderer, scene)
    {
        this.renderer = renderer;
        this.scene = scene;

        this.camera = new Camera();

        this.camera.setPerspective(
            60.0,
            1.0,
            0.1,
            500.0
        );

        this.portalRoomPosition =
        {
            x: 80.0,
            y: 5.0,
            z: 80.0
        };

        this.cameraDistance = 12.0;
    }

    update()
    {
        this.camera.setPosition(
            this.portalRoomPosition.x,
            this.portalRoomPosition.y + 8.0,
            this.portalRoomPosition.z + this.cameraDistance
        );

        this.camera.setTarget(
            this.portalRoomPosition.x,
            this.portalRoomPosition.y,
            this.portalRoomPosition.z
        );

        this.camera.update();
    }

    render()
    {
        this.renderer.renderToFramebuffer(
            this.renderer.portalFramebuffer,
            this.scene,
            this.camera
        );
    }

    draw(canvasWidth, canvasHeight)
    {
        const width = 300;
        const height = 200;

        const x = canvasWidth - width - 20;
        const y = canvasHeight - height - 20;

        this.renderer.drawTexture(
            this.renderer.portalFramebuffer.colorTexture,
            x,
            y,
            width,
            height
        );

        this.renderer.drawRectangleOutline(
            x,
            y,
            width,
            height
        );
    }
}