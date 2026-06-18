import { GameObject } from "./GameObject.js";
import { Player } from "./Player.js";

const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;

const cellSize = 2.5;
const wallHeight = 4.0;

export class WorldFactory
{
    static createWorld(scene, meshes)
    {
        const player = new Player(meshes.cubeMesh, scene);

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
            100.0,
            1.0,
            100.0
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
        const maze =
        [
            "#########################################",
            "#.......................................#",
            "#.S.....................................#",
            "#.......................................#",
            "#...#####.....#...##########...######...#",
            "#.......#.....#............#......#.....#",
            "#.......#.....#............#......#.....#",
            "#.......#.....#............#......#.....#",
            "#####...#...#########...#######...#.....#",
            "#.......#...........#.............#.....#",
            "#.......#...........#.............#.....#",
            "#.......#...........#.............#.....#",
            "#...#############...###############.....#",
            "#...........#...............#...........#",
            "#...........#...............#...........#",
            "#...........#...............#...........#",
            "#...#####...#...#########...#...#########",
            "#...#.......#...........#...#...........#",
            "#...#.......#...........#...#...........#",
            "#...#.......#...........#...#...........#",
            "#...#...#############...#...#####...#####",
            "#...#...............#...#.......#.......#",
            "#...#...............#...#.......#.......#",
            "#...#...............#...#.......#.......#",
            "#...#############...#...#####...#####...#",
            "#...........#...#...#...........#.......#",
            "#...........#...#...#...........#.......#",
            "#...........#...#...#...........#.......#",
            "#############...#########...#############",
            "#...............#.......#...............#",
            "#...............#.......#...............#",
            "#...............#.......#...............#",
            "#################...#...#######...#######",
            "#...................#...................#",
            "#...................#...................#",
            "#...................#...................#",
            "#############...#########################",
            "#.......................................#",
            "#......................................P#",
            "#.......................................#",
            "#########################################"
        ];

        const rows = maze.length;
        const columns = maze[0].length;

        const worldWidth = columns * cellSize;
        const worldDepth = rows * cellSize;

        const originX = -worldWidth / 2.0;
        const originZ = -worldDepth / 2.0;

        for (let row = 0; row < rows; row++)
        {
            for (let column = 0; column < columns; column++)
            {
                const cell = maze[row][column];

                const worldX =
                    originX +
                    column * cellSize +
                    cellSize / 2.0;

                const worldZ =
                    originZ +
                    row * cellSize +
                    cellSize / 2.0;

                if (cell === "#")
                {
                    this.createWall(
                        scene,
                        meshes,
                        worldX,
                        worldZ,
                        cellSize,
                        wallHeight,
                        cellSize
                    );
                }

                if (cell === "S")
                {
                    scene.player.transform.setPosition(
                        worldX,
                        0.5,
                        worldZ
                    );
                }

                if (cell === "P")
                {
                    this.createPortalWall(scene, meshes, worldX, worldZ, 80, 80, true);
                }
            }
        }
    }

    static createWall(scene, meshes, x, z, width, height, depth)
    {
        const wall =
            new GameObject(
                "Wall",
                meshes.cubeMesh
            );

        wall.transform.setPosition(
            x,
            height / 2.0,
            z
        );

        wall.transform.setScale(
            width,
            height,
            depth
        );

        wall.color =
            vec3.fromValues(
                0.7,
                0.7,
                0.8
            );

        scene.addObject(wall);
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

        const roomDecorationHeight = 5.0;
        const roomDecorations =
        [
            [75, roomDecorationHeight / 2.0, 75],
            [85, roomDecorationHeight / 2.0, 75],
            [75, roomDecorationHeight / 2.0, 85],
            [85, roomDecorationHeight / 2.0, 85]
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
                cellSize,
                roomDecorationHeight,
                cellSize
            );

            pillar.color =
                vec3.fromValues(
                    1.0,
                    0.3,
                    0.3
                );

            scene.addObject(pillar);
        }

        this.createWall(scene, meshes, 77.5, 75, cellSize, wallHeight * 0.67, cellSize / 2);
        this.createWall(scene, meshes, 80, 75, cellSize, wallHeight * 0.67, cellSize / 2);
        this.createWall(scene, meshes, 82.5, 75, cellSize, wallHeight * 0.67, cellSize / 2);
        this.createWall(scene, meshes, 77.5, 85, cellSize, wallHeight * 0.67, cellSize / 2);
        this.createWall(scene, meshes, 80, 85, cellSize, wallHeight * 0.67, cellSize / 2);
        this.createWall(scene, meshes, 82.5, 85, cellSize, wallHeight * 0.67, cellSize / 2);
        this.createWall(scene, meshes, 75, 82.5, cellSize / 2, wallHeight * 0.67, cellSize);
        this.createWall(scene, meshes, 75, 80, cellSize / 2, wallHeight * 0.67, cellSize);
        this.createWall(scene, meshes, 75, 77.5, cellSize / 2, wallHeight * 0.67, cellSize);

        this.createPortalWall(scene, meshes, 85, roomCenterZ, scene.portals.first.entranceX - 5, scene.portals.first.entranceZ, false);
    }

    static createPortalWall(scene, meshes, x, z, exitX, exitZ, first)
    {
        const wall =
            new GameObject(
                "PortalWall",
                meshes.cubeMesh
            );

        wall.transform.setPosition(
            x,
            wallHeight / 2.0,
            z
        );

        wall.transform.setScale(
            cellSize,
            wallHeight,
            3.0 * cellSize
        );

        wall.color =
            vec3.fromValues(
                0.1,
                0.8,
                0.25
            );

        scene.addObject(wall);

        const portal =
            new GameObject(
                first ? "Portal1" : "Portal2",
                meshes.planeMesh
            );

        portal.transform.setPosition(
            x - 0.51 * cellSize,
            wallHeight / 2.0,
            z
        );

        portal.transform.setRotation(
            -Math.PI / 2.0,
            0.0,
            Math.PI / 2.0
        );

        portal.transform.setScale(
            0.75 * 3.0 * cellSize,
            0.01,
            wallHeight
        );

        portal.color =
            vec3.fromValues(
                0.1,
                0.3,
                1.0
            );

        scene.addObject(portal);

        if (first) {
            scene.portals.first =
            {
                entranceX: x,
                entranceZ: z,

                exitX: exitX,
                exitZ: exitZ,

                width: 0.75 * cellSize,
                height: wallHeight
            };
            scene.portalObjects.first = portal;
        }
        else {
            scene.portals.second =
            {
                entranceX: x,
                entranceZ: z,

                exitX: exitX,
                exitZ: exitZ,

                width: 0.75 * cellSize,
                height: wallHeight
            };
            scene.portalObjects.second = portal;
        }
    }
}