export class PortalSystem
{
    constructor(
        renderer,
        scene
    )
    {
        this.renderer = renderer;
        this.scene = scene;
    }

    update()
    {
        const portalA = this.scene.portals.first;
        const portalB = this.scene.portals.second;
        const cameraA = this.renderer.cameras.portalA;
        const cameraB = this.renderer.cameras.portalB;

        cameraA.setPosition(
            portalB.entranceX - 2.0,
            2.0,
            portalB.entranceZ
        );

        cameraA.setTarget(
            portalB.entranceX - 3.0,
            2.0,
            portalB.entranceZ
        );

        cameraA.update();

        cameraB.setPosition(
            portalA.entranceX - 2.0,
            2.0,
            portalA.entranceZ
        );

        cameraB.setTarget(
            portalA.entranceX - 3.0,
            2.0,
            portalA.entranceZ
        );

        cameraB.update();
    }

    render()
    {
        this.renderer.renderToFramebuffer(
            this.renderer.framebuffers.portalA,
            this.scene,
            this.renderer.cameras.portalA
        );

        this.renderer.renderToFramebuffer(
            this.renderer.framebuffers.portalB,
            this.scene,
            this.renderer.cameras.portalB
        );
    }

    hidePortals() {
        const textureState1 = this.scene.portalObjects.first.useTexture;
        const textureState2 = this.scene.portalObjects.second.useTexture;

        this.scene.portalObjects.first.isVisible = false;
        this.scene.portalObjects.second.isVisible = false;

        this.scene.portalObjects.first.useTexture = false;
        this.scene.portalObjects.second.useTexture = false;

        return {
            textureState1: textureState1,
            textureState2: textureState2
        }
    }

    showPortals(textureState1, textureState2) {
        this.scene.portalObjects.first.isVisible = true;
        this.scene.portalObjects.second.isVisible = true;

        this.scene.portalObjects.first.useTexture = textureState1;
        this.scene.portalObjects.second.useTexture = textureState2;
    }
}