import { Component, Pipe, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, animate, style, state, group, keyframes } from '@angular/core';

import { MinesweeperService } from '../services';

@Component({
    selector: 'minesweeper',
    templateUrl: './minesweeper.template.html',
    styleUrls: [ './minesweeper.styles.css' ]
})
export class MinesweeperComponent {
    @Input() size: number = 10;
    @Input() mines: number = 10;
    @Input() time: number = -1;
    flagged: number = 0;
    status: string = 'ok';
    curr_time: number = 0;
    last_time: number = 0;

    colours: string[] = [
        '#F44336',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#009688',
        '#4CAF50',
        '#FFEB3B',
        '#FF9800'
    ]

    grid_squares: any[] = [];
    timer: any = null;
    display_time: string = '00:00';

    constructor(private service: MinesweeperService) {

    }

    ngOnInit() {
        this.newGame();
    }

    ngOnChanges(changes: any) {
        if(changes.size || changes.mines) {
            this.newGame();
        }
    }

    activate(square: any) {
        if(this.status === 'loss') return;
        if(square.flagged !== 'no') return;
        if(square.mine) {
            this.lose();
        } else {
            square.visible = true;
            if(square.number <= 0) {
                this.propagateShow(square);
            }
        }
    }

    check(square: any, e: any) {
        if(this.status === 'loss') return;
        if(e) {
            e.preventDefault();
        }
        if(square) {
            square.flagged = square.flagged === 'yes' ? 'maybe' : ( square.flagged === 'no' ? 'yes' : 'no');
            if(square.flagged === 'yes') {
                this.flagged++;
            } else if(square.flagged === 'no') {
                this.flagged--;
            }
        }
    }

    checkDown() {
        if(this.status === 'ok') {
            this.status = 'check';
        }
    }

    checkUp() {
        if(this.status === 'check') {
            this.status = 'ok';
        }
    }

    propagateShow(square: any) {
        let list = this.getNextCells(Math.floor(square.id % this.size), Math.floor(square.id / this.size));
        for(let i = 0; i < list.length; i++) {
            let sq = this.grid_squares[list[i].y * this.size + list[i].x];
            if(sq.number === 0 && !sq.visible && !sq.mine) {
                sq.visible = true;
                this.propagateShow(sq);
            }
        }
    }

    lose() {
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.status = 'loss';
        for(let i = 0; i < this.grid_squares.length; i++) {
            if(this.grid_squares[i].mine) {
                this.grid_squares[i].visible = true;
            }
        }
    }

    checkWin() {

    }

    win() {
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

    }

    newGame() {
        if(!this.size) this.size = 10;
        if(!this.mines) this.mines = 10;
        if(this.mines > this.size * this.size / 2) this.mines = this.size * this.size / 2;
        this.status = 'ok';
            // Start timer
        if(this.timer) {
            clearInterval(this.timer);
        }
        this.time = 0;
        let now = new Date();
        this.last_time = now.getTime();
        this.timer = setInterval(() => {
            this.updateTime();
        }, 200);
        this.flagged = 0;
        this.initGrid();
    }

    updateTime() {
        let now = new Date();
        this.time += now.getTime() - this.last_time;
        this.last_time = now.getTime();
        let mins = Math.floor(this.time / (60 * 1000));
        let secs = Math.floor((this.time / 1000) % 60);
        this.display_time = (mins < 10 ? '0' + mins : mins ) + ':' + (secs < 10 ? '0' + secs : secs );
    }

    initGrid() {
        this.grid_squares = [];
        let grid_size = this.size * this.size;
            // Create grid squares
        for(let i = 0; i < grid_size; i++) {
            this.grid_squares.push({
                id: i,
                mine: false,
                flagged: 'no',
                visible: false,
                number: 0
            })
        }
            // Add mines to grid
        for(let i = 0; i < this.mines; i++) {
            let pos = Math.floor(Math.random() * grid_size);
            if(!this.grid_squares[pos].mine) {
                this.grid_squares[pos].mine = true;
                let list = this.getAdjacentCells(Math.floor(pos%this.size), Math.floor(pos/this.size));
                for(let k = 0; k < list.length; k++) {
                    this.grid_squares[list[k].y * this.size + list[k].x].number++;
                }
            } else {
                i--;
            }
        }
    }

    diff = [-1, 0, 1];

    getAdjacentCells(x: number, y: number) {
        let list: any[] = [];
        for(let i = 0; i < this.grid_squares.length; i++) {
            let n_x = Math.floor(i % this.size);
            let n_y = Math.floor(i / this.size);
            if(this.diff.indexOf(n_x-x) >= 0 && this.diff.indexOf(n_y-y) >= 0) {
                list.push({ x: n_x, y: n_y });
            }
        }
        return list;
    }

    diff2 = [-1, 1];

    getNextCells(x: number, y: number) {
        let list: any[] = [];
        for(let i = 0; i < this.grid_squares.length; i++) {
            let n_x = Math.floor(i % this.size);
            let n_y = Math.floor(i / this.size);
            if(this.diff2.indexOf(n_x-x) >= 0 && n_y-y === 0) {
                list.push({ x: n_x, y: n_y });
            } else if(this.diff2.indexOf(n_y-y) >= 0 && n_x-x === 0) {
                list.push({ x: n_x, y: n_y });
            }
        }
        return list;
    }
}
