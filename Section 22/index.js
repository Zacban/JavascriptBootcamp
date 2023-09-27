const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const worldWidth = window.innerWidth;
const worldHeight = window.innerHeight;
const wallThickness = 10;

const horizontalCells = 6;
const verticalCells = 4;

const cellWidth = worldWidth / horizontalCells;
const cellHeight = worldHeight / verticalCells;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create(
    {
        element: document.body,
        engine: engine,
        options: {
            wireframes: false,
            width: worldWidth,
            height: worldHeight,

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

// Maze generation

const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter--);

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;

        return arr;
    }
}
const grid = Array(verticalCells)
    .fill(null)
    .map(() => Array(horizontalCells).fill(false));

const vertical = Array(verticalCells)
    .fill(null)
    .map(() => Array(horizontalCells - 1).fill(false));

const horizontal = Array(verticalCells - 1)
    .fill(null)
    .map(() => Array(horizontalCells).fill(false));

const startRow = Math.floor(Math.random() * verticalCells);
const startCol = Math.floor(Math.random() * horizontalCells);

const stepCell = (row, column) => {
    // if we already visited this cell, then return
    if (grid[row][column] === true) {
        return;
    }

    // set value to true to indicate the cell has been visited.
    grid[row][column] = true;

    // assemble randomly-ordered list of neighbours
    const neighbours = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);

    // for each neighbour
    for (let neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;

        if (nextRow < 0 || nextRow >= verticalCells || nextColumn < 0 || nextColumn >= horizontalCells)
            continue;

        if (grid[nextRow][nextColumn])
            continue;

        if (direction === 'right' || direction === 'left') {
            vertical[row][Math.min(column, nextColumn)] = true;
        }
        else if (direction === 'up' || direction === 'down') {
            horizontal[Math.min(row, nextRow)][column] = true;
        }

        stepCell(nextRow, nextColumn);
    }


}

stepCell(startRow, startCol);

horizontal.forEach((row, rowIndex) => {
    row.forEach((open, colIndex) => {
        if (open) {
            return;
        }

        const x = cellWidth * colIndex + (cellWidth / 2);
        const y = cellHeight * (rowIndex + 1);
        const wall = Bodies.rectangle(
            x, 
            y, 
            cellWidth + (wallThickness / 2),
            wallThickness / 2, 
            { 
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            });

        World.add(world, wall)
    });
});

vertical.forEach((row, rowIndex) => {
    row.forEach((open, colIndex) => {
        if (open) {
            return;
        }

        const x = cellWidth * colIndex + cellWidth;
        const y = cellHeight * rowIndex + cellHeight / 2;
        const wall = Bodies.rectangle(
            x, 
            y, 
            wallThickness / 2, 
            cellHeight + (wallThickness / 2), 
            { 
                isStatic: true, 
                label: 'wall',
                render: {
                    fillStyle: 'red'
                }
            });

        World.add(world, wall)
    });
});


// Goal
const goal = Bodies.rectangle(
    cellWidth * horizontalCells - (cellWidth / 2),
    cellHeight * verticalCells - (cellHeight / 2),
    cellWidth * .7,
    cellHeight * .7,
    { 
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green'
        }
     }
);

World.add(world, goal);

// Ball

const ball = Bodies.circle(
    cellWidth / 2,
    cellHeight / 2,
    Math.min(cellWidth, cellHeight) * .3,
    { isStatic: false, label: 'ball' }
);

World.add(world, ball);

document.addEventListener('keydown', event => {
    const { x, y } = ball.velocity;

    if (event.key === 'w') {
        Body.setVelocity(ball, { x, y: y - 5 });
    }
    if (event.key === 'a') {
        Body.setVelocity(ball, { x: x - 5, y });
    }
    if (event.key === 's') {
        Body.setVelocity(ball, { x, y: y + 5 });
    }
    if (event.key === 'd') {
        Body.setVelocity(ball, { x: x + 5, y });
    }
});

// Win Condition

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(({bodyA, bodyB}) => {
        const labels = ['ball', 'goal'];

        if (labels.includes(bodyA.label) && labels.includes(bodyB.label)) {
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall')
                    Body.setStatic(body, false);
            })
        }
        
    });
});