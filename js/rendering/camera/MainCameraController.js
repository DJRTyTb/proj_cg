export class MainCameraController
{
    constructor(
        camera,
        scene
    )
    {
        this.camera = camera;
        this.scene = scene;

        this.cameraDistance = 10.0;
        this.cameraHeight = 6.0;
    }

    update()
    {
        const player = this.scene.player;
        if (!player) return;

        const position = player.transform.position;
        const yaw = player.currentYaw;

        const offsetX = Math.sin(yaw) * this.cameraDistance;
        const offsetZ = Math.cos(yaw) * this.cameraDistance;

        this.camera.setPosition(
            position[0] - offsetX,
            position[1] + this.cameraHeight,
            position[2] - offsetZ
        );

        this.camera.setTarget(
            position[0],
            position[1] + 1.0,
            position[2]
        );

        this.camera.update();
    }
}