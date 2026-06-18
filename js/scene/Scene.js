export class Scene
{
    constructor()
    {
        this.gameObjects = [];

        this.player = null;

        this.portalObjects =
        {
            first: null,
            second: null
        };

        this.portals =
        {
            first: null,
            second: null
        };
    }

    addObject(gameObject)
    {
        this.gameObjects.push(gameObject);
        return gameObject;
    }

    setPlayer(player)
    {
        this.player = player;
        this.addObject(player);
    }

    update(deltaTime)
    {
        for (const gameObject of this.gameObjects)
            gameObject.update(deltaTime);
    }

    draw(shaderProgram)
    {
        for (const gameObject of this.gameObjects)
            gameObject.draw(shaderProgram);
    }
}