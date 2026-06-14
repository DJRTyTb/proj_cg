import { Renderer } from "./core/Renderer.js";
import { Camera } from "./core/Camera.js";

import { Scene } from "./scene/Scene.js";
import { WorldFactory } from "./scene/WorldFactory.js";

import { Minimap } from "./ui/Minimap.js";
import { PictureInPicture } from "./ui/PictureInPicture.js";

import { OBJLoader } from "./loaders/OBJLoader.js";

const vec3 = glMatrix.vec3;

const canvas =
    document.getElementById(
        "glCanvas"
    );

const loadingLabel =
    document.getElementById(
        "loadingLabel"
    );

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl =
    canvas.getContext(
        "webgl2"
    );

if (!gl)
{
    throw new Error(
        "WebGL2 is not supported."
    );
}

const renderer = new Renderer(gl, canvas);
const scene = new Scene();
const mainCamera = new Camera();

let minimap = null;
let pictureInPicture = null;

let previousTime = 0;

window.addEventListener(
    "resize",
    onResize
);

initialize();

async function initialize()
{
    await renderer.initialize();

    WorldFactory.createWorld(
        scene,
        {
            cubeMesh:
                renderer.cubeMesh,

            planeMesh:
                renderer.planeMesh
        }
    );

    const objLoader = new OBJLoader(gl);

    objLoader.load("assets/car.obj").then((carMesh) =>
    {
        const player = scene.player;

        player.mesh = carMesh;

        player.transform.setScale(
            0.1,
            0.1,
            0.1
        );

        player.color = vec3.fromValues(
            0.4,
            0.5,
            0.6
        );
    });

    initializeMainCamera();

    minimap =
        new Minimap(
            renderer,
            scene
        );

    pictureInPicture =
        new PictureInPicture(
            renderer,
            scene
        );

    loadingLabel.style.display ="none";

    requestAnimationFrame(gameLoop);
}

function initializeMainCamera()
{
    mainCamera.setPerspective(
        60.0,
        canvas.width /
        canvas.height,
        0.1,
        1000.0
    );
}

function onResize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    mainCamera.setPerspective(
        60.0,
        canvas.width /
        canvas.height,
        0.1,
        1000.0
    );
}

function updateMainCamera()
{
    const player = scene.player;
    if (!player) return;

    const playerPosition = player.transform.position;
    const playerYaw = player.currentYaw;

    const cameraDistance = 10.0;
    const cameraHeight = 6.0;

    const offsetX = Math.sin(playerYaw) * cameraDistance;
    const offsetZ = Math.cos(playerYaw) * cameraDistance;

    mainCamera.setPosition(
        playerPosition[0] - offsetX,
        playerPosition[1] + cameraHeight,
        playerPosition[2] - offsetZ
    );

    mainCamera.setTarget(
        playerPosition[0],
        playerPosition[1] + 1.0,
        playerPosition[2]
    );

    mainCamera.update();
}

function update(deltaTime)
{
    scene.update(deltaTime);

    updateMainCamera();

    minimap.update();
    pictureInPicture.update();
}

function render()
{
    minimap.render();

    pictureInPicture.render();

    renderer.renderToScreen(
        scene,
        mainCamera
    );

    minimap.draw(canvas.height);

    pictureInPicture.draw(
        canvas.width,
        canvas.height
    );
}

function gameLoop(currentTime)
{
    const deltaTime =
        (
            currentTime -
            previousTime
        ) / 1000.0;

    previousTime =currentTime;

    update(deltaTime);

    render();

    requestAnimationFrame(gameLoop);
}