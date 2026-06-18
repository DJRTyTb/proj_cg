import { Renderer } from "./rendering/Renderer.js";

import { Camera } from "./rendering/camera/Camera.js";

import { Scene } from "./scene/Scene.js";
import { WorldFactory } from "./scene/WorldFactory.js";

import { OBJLoader } from "./loaders/OBJLoader.js";

import { Vec3 } from "./math/Vec3.js";

const canvas = document.getElementById("glCanvas");
const loadingLabel = document.getElementById("loadingLabel");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext("webgl2");

if (!gl)
{
    throw new Error(
        "WebGL2 is not supported."
    );
}

const renderer = new Renderer(gl, canvas);
const scene = new Scene();
const mainCamera = new Camera();

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

    setupMainCamera();

    renderer.initializeScene(
        scene,
        mainCamera
    );

    setupPortalTextures();

    await loadPlayerModel();

    window.scene = scene;
    window.renderer = renderer;

    loadingLabel.style.display = "none";

    requestAnimationFrame(gameLoop);
}

function setupMainCamera()
{
    mainCamera.setPerspective(
        60.0,
        canvas.width /
        canvas.height,
        0.1,
        1000.0
    );
}

function setupPortalTextures()
{
    scene.portalObjects.first.useTexture = true;
    scene.portalObjects.first.texture = renderer.framebuffers.portalA.colorTexture;

    scene.portalObjects.second.useTexture = true;
    scene.portalObjects.second.texture = renderer.framebuffers.portalB.colorTexture;
}

async function loadPlayerModel()
{
    const objLoader = new OBJLoader(gl);

    const carMesh =
        await objLoader.load(
            "assets/car.obj"
        );

    const player = scene.player;
    player.mesh = carMesh;

    player.transform.setScale(
        0.1,
        0.1,
        0.1
    );

    player.color =
        Vec3.fromValues(
            0.4,
            0.5,
            0.6
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

function gameLoop(
    currentTime
)
{
    const deltaTime =
        (
            currentTime -
            previousTime
        ) / 1000.0;

    previousTime = currentTime;

    renderer.update(deltaTime);
    renderer.render();

    requestAnimationFrame(gameLoop);
}