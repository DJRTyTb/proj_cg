import { Camera } from "../core/Camera.js";

export class Minimap
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

        this.heightAbovePlayer = 25.0;
    }

    update()
    {
        const player = this.scene.player;
        if (!player) return;

        const playerPosition = player.transform.position;

        this.camera.setPosition(
            playerPosition[0],
            playerPosition[1] + this.heightAbovePlayer,
            playerPosition[2] + 5.0
        );

        this.camera.setTarget(
            playerPosition[0],
            playerPosition[1],
            playerPosition[2]
        );

        this.camera.update();
    }

    render()
    {
        this.renderer.renderToFramebuffer(
            this.renderer.minimapFramebuffer,
            this.scene,
            this.camera
        );
    }

    draw(canvasHeight)
    {
        const x = 20;
        const y = canvasHeight - 270;
        const size = 250;

        this.renderer.drawTexture(
            this.renderer.minimapFramebuffer.colorTexture,
            x,
            y,
            size,
            size
        );

        this.renderer.drawRectangleOutline(
            x,
            y,
            size,
            size
        );
    }
}