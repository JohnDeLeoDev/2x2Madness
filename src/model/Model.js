import { config_4x4 } from './Configs.js';
import { config_5x5 } from './Configs.js';
import { config_6x6 } from './Configs.js';
import { BOXSIZE } from '../boundary/Boundary.js';
import { clearButtons } from '../boundary/Boundary.js';

export var configs = [config_4x4, config_5x5, config_6x6];

export class Square {
    constructor(column, row, color) {
        this.column = column;
        this.row = row;  
        this.color = color;
        this.size = BOXSIZE;
    }

    contains(x, y) {
        return x >= this.column && x <= (this.column + 100) && y >= this.row && y <= (this.row + 100);
    }

}

export class Group {
    constructor(id, x, y, squares) {
        this.id = id
        this.x = x;
        this.y = y;
        this.squaresInGroup = squares;
        this.match = this.matches();
    }

    matches() {
        let color = this.squaresInGroup[0].color;
        for (let p of this.squaresInGroup) {
            if (p.color !== color) {
                return false;
            }
        }
        return true;
    }

    contains(x, y) {
        return ((x >= (this.x * BOXSIZE)) && (x <= (this.x * BOXSIZE)) && ((y >= this.y * BOXSIZE) && (y <= (this.y * BOXSIZE))));
    }  
    rotate(direction) {
        if (direction) {
            let temp0 = this.squaresInGroup[0].color;
            let temp1 = this.squaresInGroup[1].color;
            let temp2 = this.squaresInGroup[2].color;
            let temp3 = this.squaresInGroup[3].color;
            this.squaresInGroup[0].color = temp2;
            this.squaresInGroup[1].color = temp0;
            this.squaresInGroup[2].color = temp3;
            this.squaresInGroup[3].color = temp1;

        } else {
            let temp0 = this.squaresInGroup[0].color;
            let temp1 = this.squaresInGroup[1].color;
            let temp2 = this.squaresInGroup[2].color;
            let temp3 = this.squaresInGroup[3].color;
            this.squaresInGroup[0].color = temp1;
            this.squaresInGroup[1].color = temp3;
            this.squaresInGroup[2].color = temp0;
            this.squaresInGroup[3].color = temp2;
        }
    } 
}

export class Board {
    constructor(numColumns, numRows, baseSquares) {
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.numGroups = (numColumns-1)**2;
        this.numGroupsRow = this.numGroups/numColumns;
        this.baseSquares = baseSquares;
        this.selected = null;
        this.victory = false;
        this.initialize(baseSquares);
    }

    initialize(squares) {
        this.squares = squares;
        this.groups = [];
        let id = 1;
        for (let i = 0; i < this.numRows-1; i++) {
            for (let j = 0; j < this.numColumns-1; j++) {
                this.groups.push(new Group(id,j,i,[this.squares[(this.numColumns*i)+j], this.squares[(this.numColumns*i)+ (j+1)], this.squares[(this.numColumns*(i+1))+j], this.squares[(this.numColumns*(i+1))+j+1]]));
                id++;
            }
        }
    }

    select(group) {
        this.selected = group;
    }
   
    checkVictory() {
        for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].matches() != true) {
                return false;
            }
        }
        return true
    }
}

export default class Model {
    constructor(configs) {
        this.configs = configs;
        this.config = configs[0];
        this.initialize(this.config); 
    }

    initialize(config) {
        this.config = config;
        this.numRows = parseInt(this.config.numRows);
        this.numColumns = parseInt(this.config.numColumns);
        this.baseSquares = this.config.baseSquares;
        this.allSquares = [];
        for (let i = 0; i < this.baseSquares.length; i++) {
            this.allSquares.push(new Square(parseInt(this.baseSquares[i].column), parseInt(this.baseSquares[i].row), this.baseSquares[i].color));
        }
        this.board = new Board(this.numColumns, this.numRows, this.allSquares);
        this.numMoves = 0;
        this.showLabels = false;
    }

    reset() {
        this.initialize(this.config);
        clearButtons();
    }

    setConfig(config) {
        this.config = config;
        this.initialize(this.config);
        clearButtons();
    }

    victory() {
        return this.board.checkVictory();
    }

}
