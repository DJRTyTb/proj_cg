import { GameObject } from "./GameObject.js";
import { Player } from "./Player.js";

const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;

export class WorldFactory
{
    static createWorld(scene, meshes)
    {
        const player = new Player(meshes.cubeMesh);

        player.transform.setPosition(
            0.0,
            0.5,
            0.0
        );

        scene.setPlayer(player);

        this.createGround(
            scene,
            meshes
        );

        this.createMapObjects(
            scene,
            meshes
        );

        this.createPortalRoom(
            scene,
            meshes
        );
    }

    static createGround(scene, meshes)
    {
        const ground =
            new GameObject(
                "Ground",
                meshes.planeMesh
            );

        ground.transform.setScale(
            40.0,
            1.0,
            40.0
        );

        ground.color =
            vec3.fromValues(
                0.35,
                0.35,
                0.35
            );

        scene.addObject(ground);
    }

    static createMapObjects(scene, meshes)
    {
        const objectPositions =
        [
            [-10, 1, -10],
            [-10, 1, 10],
            [10, 1, -10],
            [10, 1, 10],
            [0, 1, -15],
            [0, 1, 15],
            [-15, 1, 0],
            [15, 1, 0]
        ];

        for (const position of objectPositions)
        {
            const building =
                new GameObject(
                    "Building",
                    meshes.cubeMesh
                );

            building.transform.setPosition(
                position[0],
                position[1],
                position[2]
            );

            building.transform.setScale(
                2.0,
                2.0,
                2.0
            );

            building.color =
                vec3.fromValues(
                    0.7,
                    0.7,
                    0.9
                );

            scene.addObject(building);
        }
    }

    static createPortalRoom(scene, meshes)
    {
        const roomCenterX = 80.0;
        const roomCenterZ = 80.0;

        const roomFloor =
            new GameObject(
                "PortalRoomFloor",
                meshes.planeMesh
            );

        roomFloor.transform.setPosition(
            roomCenterX,
            0.0,
            roomCenterZ
        );

        roomFloor.transform.setScale(
            10.0,
            1.0,
            10.0
        );

        roomFloor.color =
            vec3.fromValues(
                0.1,
                0.1,
                0.5
            );

        scene.addObject(roomFloor);

        const roomDecorations =
        [
            [75, 1, 75],
            [85, 1, 75],
            [75, 1, 85],
            [85, 1, 85]
        ];

        for (const position of roomDecorations)
        {
            const pillar =
                new GameObject(
                    "PortalRoomObject",
                    meshes.cubeMesh
                );

            pillar.transform.setPosition(
                position[0],
                position[1],
                position[2]
            );

            pillar.transform.setScale(
                1.5,
                4.0,
                1.5
            );

            pillar.color =
                vec3.fromValues(
                    1.0,
                    0.3,
                    0.3
                );

            scene.addObject(pillar);
        }
    }
}