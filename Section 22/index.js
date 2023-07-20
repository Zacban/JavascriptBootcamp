const { Engine, Render, Runner, World, Bodies } = Matter;

const worldWidth = 800;
const worldHeight = 800;
const wallThickness = 40

const engine = Engine.create();

const { world } = engine;
const render = Render.create(
    {
        element: document.body,
        engine: engine,
        options: {
            wireframes: true,
            width: worldWidth,
            height: worldHeight
        }
    }
);

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    Bodies.rectangle((worldWidth / 2), 0, worldWidth, wallThickness, { isStatic: true }),
    Bodies.rectangle((worldWidth / 2), worldHeight, worldWidth, wallThickness, { isStatic: true }),
    Bodies.rectangle(0, worldHeight / 2, wallThickness, worldHeight, { isStatic: true }),
    Bodies.rectangle(worldWidth, worldHeight / 2, wallThickness, worldHeight, { isStatic: true })
];

World.add(world, walls);
