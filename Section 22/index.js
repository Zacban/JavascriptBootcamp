const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

const worldWidth = 800;
const worldHeight = 600;
const objectCount = 50;

const engine = Engine.create();

const { world } = engine;
const render = Render.create(
    {
        element: document.body,
        engine: engine,
        options: {
            wireframes: false,
            width: worldWidth,
            height: worldHeight
        }
    }
);

Render.run(render);
Runner.run(Runner.create(), engine);

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}));

// Walls
const wallThickness = 40
const walls = [
    Bodies.rectangle((worldWidth / 2), 0, worldWidth, wallThickness, { isStatic: true }),
    Bodies.rectangle((worldWidth / 2), worldHeight, worldWidth, wallThickness, { isStatic: true }),
    Bodies.rectangle(0, worldHeight / 2, wallThickness, worldHeight, { isStatic: true }),
    Bodies.rectangle(worldWidth, worldHeight / 2, wallThickness, worldHeight, { isStatic: true })
];

World.add(world, walls);

// Random shapes
for (let i = 0; i < objectCount; i++) {
    if (Math.random() > 0.5) {
        World.add(world,
            Bodies.rectangle(
                Math.random() * worldWidth,
                Math.random() * worldHeight, 20, 20));
    }
    else {
        World.add(world,
            Bodies.circle(
                Math.random() * worldWidth,
                Math.random() * worldHeight, 35, {
                    render: {
                        fillStyle: '#453'
                    }
                }));
    }
}