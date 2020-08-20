import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ttrs';
  private _windowHeight: number = 0;
  private _windowWidth: number = 0;
  private _heightToWidthRatio: number = 2;
  private _playground: HTMLElement;
  public gameArray = [];
  private _currentTetroCords = [];


  ngOnInit() {
    this._playground = document.getElementById('playground');
    this.createWindow();
    window.addEventListener('resize', () => {
      this.createWindow();
    });
    this.initArray();
    this.addKeyEvents();
  }

  addKeyEvents() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "KeyP") {
        //console.log('space');
        this.generateJ();
      } else if (event.code === "ArrowLeft" || event.code === "KeyA") {
        document.getElementById('backward').click();
      } else if (event.code === "ArrowRight" || event.code === "KeyD") {
        document.getElementById('forward').click();
      } else if (event.code === "KeyL") {
        document.getElementById('loop').click();
      } else if (event.code === "KeyS") {
        console.log(this.gameArray);
        this.moveCurrentDown();

      }
    });
  }
  createWindow() {
    let height = window.innerHeight - 10;
    let width = window.innerWidth - 10;
    if (height / this._heightToWidthRatio > width) {
      this._windowWidth = Math.floor(width / 10) * 10;
      this._windowHeight = width * this._heightToWidthRatio;
    } else {
      this._windowWidth = Math.floor(height / this._heightToWidthRatio / 10) * 10;
      this._windowHeight = this._windowWidth * 2;
    }
    let left = (width - this._windowWidth) / 2;
    let bottom = (height - this._windowHeight) / 2;
    //console.log('hght:' + this._windowHeight);
    //console.log('wdth:' + this._windowWidth);
    this._playground.style.width = this._windowWidth.toString() + "px";
    this._playground.style.height = this._windowHeight.toString() + "px";
    this._playground.style.left = left.toString() + "px";
    this._playground.style.bottom = bottom.toString() + "px";
  }

  initArray() {
    for (let i = 0; i < 20; i++) {
      let rowArray = new Array();
      for (let j = 0; j < 10; j++) {
        rowArray.push(0);
      }
      this.gameArray.push(rowArray);
    }
  }

  generateCube(y: number, x: number, color: number, indexOfCurrentTetro: number) {
    //this.gameArray[y][x] = color;
    this._currentTetroCords[indexOfCurrentTetro] = y * 10 + x + color * 0.1; // YX,C, three numbers held in one cell
  }

  removeCurrent() {
    for (let i = 0; i < 4; i++) {
      this.gameArray[this.getCurrentData(i, 'y')][this.getCurrentData(i, 'x')] = 0;
    }
  }

  drawCurrent() {
    for (let i = 0; i < 4; i++) {
      this.gameArray[this.getCurrentData(i, 'y')][this.getCurrentData(i, 'x')] = this.getCurrentData(i, 'c');
    }
  }

  moveCurrentDown() {
    if (this.checkCanMoveDown()) {
      this.removeCurrent();
      for (let i = 0; i < 4; i++) {
        this.changeCurrentY(i, 1);
      }
      this.drawCurrent();
      //console.log(this.gameArray);
    } else {
      //console.log('collision');
      this.generateNext();
    }
  }

  generateNext() {
    let random = Math.floor((Math.random() * 7));
    console.log('generating');
    switch (random) {
      case 0:
        this.generateI();
        break;
      case 1:
        this.generateO();
        break;
      case 2:
        this.generateZ();
        break;
      case 3:
        this.generateS();
        break;
      case 4:
        this.generateL();
        break;
      case 5:
        this.generateJ();
        break;
      case 6:
        this.generateV();
        break;
    }
    if (this.checkCanGenerate) {
      console.log('can')
      this.drawCurrent();
    }
    else {
      console.log('GAME OVER')
    }
  }

  checkCanMoveDown(): boolean {
    let returned = true;
    for (let i = 0; i < 4; i++) {
      let x = this.getCurrentData(i, 'x');
      let y = this.getCurrentData(i, 'y');
      let collidesSelf = false;
      for (let j = 0; j < 4; j++) {
        if (this.getCurrentData(j, 'y') === y + 1) { //check if below the cube is another current tetro's cube
          collidesSelf = true;
        }
      }
      if (y + 1 >= 20) { //collision with bottom end
        //console.log('bottom');
        returned = false
      } else if (!collidesSelf && this.gameArray[y + 1][x] !== 0) { //check if not 0 below that is not part of current tetro
        //console.log(collidesSelf, x, y)
        returned = false
      }
    }
    //console.log(returned);
    return returned;
  }

  checkCanGenerate(): boolean {
    let returned = true;
    for (let i = 0; i < 4; i++) {
      let x = this.getCurrentData(i, 'x');
      let y = this.getCurrentData(i, 'y');
      if (this.gameArray[y][x] !== 0) {
        returned = false;
        console.log(false);
      }

      return returned;
    }
  }

  getCurrentData(index: number, data: string) {
    let y = Math.floor(this._currentTetroCords[index] / 10);
    let x = Math.floor(this._currentTetroCords[index] - y * 10);
    let c = Math.round(10 * (this._currentTetroCords[index] - 10 * y - x));
    if (data === 'y') {
      return y;
    } else if (data === 'x') {
      return x;
    } else if (data === 'c') {
      //console.log(c);
      return c;
    }
  }

  changeCurrentY(index: number, y: number) {
    this._currentTetroCords[index] += 10 * y;
  }

  changeCurrentX(index: number, x: number) {
    this._currentTetroCords[index] += x;
  }
  generateI() {
    this.generateCube(0, 3, 1, 0);
    this.generateCube(0, 4, 1, 1);
    this.generateCube(0, 5, 1, 2);
    this.generateCube(0, 6, 1, 3);
    //console.log('I');
  }

  generateO() {
    this.generateCube(0, 4, 2, 0);
    this.generateCube(0, 5, 2, 1);
    this.generateCube(1, 4, 2, 2);
    this.generateCube(1, 5, 2, 3);
    //console.log('O')
  }
  generateZ() {
    this.generateCube(0, 3, 3, 0);
    this.generateCube(0, 4, 3, 1);
    this.generateCube(1, 4, 3, 2);
    this.generateCube(1, 5, 3, 3);
    //console.log('Z');
  }
  generateS() {
    this.generateCube(0, 4, 4, 0);
    this.generateCube(0, 5, 4, 1);
    this.generateCube(1, 3, 4, 2);
    this.generateCube(1, 4, 4, 3);
    //console.log('S');
  }
  generateJ() {
    this.generateCube(0, 3, 5, 0);
    this.generateCube(0, 4, 5, 1);
    this.generateCube(0, 5, 5, 2);
    this.generateCube(1, 5, 5, 3);
    //console.log('J');
  }
  generateL() {
    this.generateCube(0, 3, 6, 0);
    this.generateCube(0, 4, 6, 1);
    this.generateCube(0, 5, 6, 2);
    this.generateCube(1, 3, 6, 3);
    //console.log('L');
  }
  generateV() {
    this.generateCube(0, 3, 7, 0);
    this.generateCube(0, 4, 7, 1);
    this.generateCube(0, 5, 7, 2);
    this.generateCube(1, 4, 7, 3);
    //console.log('V');
  }
}
