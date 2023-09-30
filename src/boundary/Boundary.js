export var buttons = [];
export var BOXSIZE = 100;
export var CIRCLESIZE = 10;
export const OFFSET = 5;
export const GROUPOFFSET = OFFSET;
export const BUTTONOFFSET = 5;

export function clearButtons() {
    buttons = [];
}

export class SquareShape {
    constructor(row, column, size, color) {
        this.color = color;
        this.row = row;
        this.column = column;
        this.size = size;
    } 
}

export class GroupShape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class ButtonShape {
    constructor(id, x, y) {
        this.id = id;
        this.x = x + BUTTONOFFSET;
        this.y = y + BUTTONOFFSET;
        this.radius = CIRCLESIZE;
    }
    contains(x, y) {
        return x >= this.x - 50 && x <= this.x + 50 && y >= this.y - 50 && y <= this.y + 50;
    }
}

export function computeSquare(square) {
    let c = square;
    return new SquareShape(c.row * BOXSIZE + OFFSET, c.column * c.size + OFFSET, BOXSIZE, c.color);                        
}

export function computeBox(group) {
    let g = group;
    return new GroupShape((g.x * BOXSIZE) + GROUPOFFSET, (g.y * BOXSIZE) + GROUPOFFSET);
}

export function computeButtons(id,button) {
    let b = button;
    return new ButtonShape(id, b.x * BOXSIZE + 100, b.y * BOXSIZE + 100);
}

export function drawBoard(ctx, board) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.width = window.innerWidth;
    ctx.height = window.innerHeight - 100;

    let selected = board.selected;

    board.baseSquares.forEach(baseSquare => {
        ctx.beginPath();
        let shape = computeSquare(baseSquare);
        ctx.fillStyle = baseSquare.color;
        ctx.fillRect(shape.column, shape.row, shape.size, shape.size);
        ctx.strokeRect(shape.column, shape.row, shape.size, shape.size);
    })
    clearButtons();
    let id=1;
    board.groups.forEach(group => {
        buttons.push(computeButtons(id, group));
        id++;
    })
    for (let i = 0; i < buttons.length; i++) {
        if (selected && buttons[i].id === selected.id) {
            ctx.beginPath();
            ctx.arc(buttons[i].x, buttons[i].y, buttons[i].radius, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 0;
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(buttons[i].x, buttons[i].y, buttons[i].radius, 0, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 0;
            ctx.fill();
            ctx.stroke();
        }
    }
    if (selected) {
        let box = computeBox(selected);
        ctx.beginPath();
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = "rgba(255, 0, 0, 0.75";  
        ctx.lineWidth = 10;
        ctx.fillRect(box.x, box.y, BOXSIZE * 2, BOXSIZE * 2);
        ctx.strokeRect(box.x, box.y, BOXSIZE * 2, BOXSIZE * 2);
    }  
}

export function redrawCanvas(model, canvasObj) {
    const ctx = canvasObj.getContext('2d');
    if (ctx === null) { return; }

    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
    if (model.board) {
        drawBoard(ctx, model.board);
    }
}
