import { Camera } from "../core/Camera.js";

export class PortalRenderer
{
    constructor(renderer, scene)
    {
        this.renderer = renderer;
        this.scene = scene;

        this.cameraA = new Camera();
        this.cameraB = new Camera();

        this.cameraA.setPerspective(
            60,
            1,
            0.1,
            500
        );

        this.cameraB.setPerspective(
            60,
            1,
            0.1,
            500
        );
    }

    update()
    {
        const portal1 = this.scene.portal1;
        const portal2 = this.scene.portal2;

        this.cameraA.setPosition(
            portal1.entranceX - 2.0,
            2.0,
            portal1.entranceZ
        );

        this.cameraA.setTarget(
            portal1.entranceX - 3.0,
            2.0,
            portal1.entranceZ
        );

        this.cameraA.update();

        this.cameraB.setPosition(
            portal2.entranceX - 2.0,
            2.0,
            portal2.entranceZ
        );

        this.cameraB.setTarget(
            portal2.entranceX - 3.0,
            2.0,
            portal2.entranceZ
        );

        this.cameraB.update();
    }

    render()
    {
        const portal1 =
            this.scene.gameObjects.find(
                o => o.name === "Portal1"
            );

        const portal2 =
            this.scene.gameObjects.find(
                o => o.name === "Portal2"
            );

        portal2.isVisible = false;

        this.renderer.renderToFramebuffer(
            this.renderer.portalFramebufferA,
            this.scene,
            this.cameraA
        );

        portal2.isVisible = true;
        portal1.isVisible = false;

        this.renderer.renderToFramebuffer(
            this.renderer.portalFramebufferB,
            this.scene,
            this.cameraB
        );

        portal1.isVisible = true;
    }
}