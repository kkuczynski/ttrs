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
  private _tmpTetroCords = [];
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _cubeSize: number;
  private _playing = false;
  private _gameOver = true;


  ngOnInit() {
    this._playground = document.getElementById('playground');
    this._canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this._ctx = this._canvas.getContext('2d');
    this.createWindow();
    window.addEventListener('resize', () => {
      this.createWindow();
    });    
    this.addKeyEvents();
    this.timers();
  }

  timers() {
    setInterval(() => {
      if(this._playing){
      this.drawCanvas();
      }
    }, 1000 / 60);
  
    setInterval(() => {
      if(this._playing){
      this.moveCurrentDown();
      }
    }, 1000 / 1.5)

  }

  addKeyEvents() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "KeyP") {
        //console.log('space');
       this.startPause()
        
      } else if (event.code === "ArrowLeft" || event.code === "KeyA") {
        this.moveCurrentHorizontally(-1);
      } else if (event.code === "ArrowRight" || event.code === "KeyD") {
        this.moveCurrentHorizontally(+1);
      } else if (event.code === "ArrowUp" || event.code === "KeyW") {
        this.rotateCurrent();
      } else if (event.code === "KeyL") {
        this.drawCanvas()
      } else if (event.code === "KeyS") {
        console.log(this.gameArray);
        this.moveCurrentDown();
        this.drawCanvas();
      }
    });
  }
  startPause(){
    if(!this._playing && this._gameOver) { //start new game
      this.initArray();
      this._playing = true;
      this._gameOver = false;
      this.generateNext();
      } else if(this._playing) { //pause game
        this._playing = false;
      } else if (!this._playing && !this._gameOver) { //resume game
        this._playing = true;
      }
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
    this._canvas.setAttribute('width', this._windowWidth.toString());
    this._canvas.setAttribute('height', this._windowHeight.toString());
    this._cubeSize = Math.round(this._windowWidth / 10);
    console.log(this._cubeSize)
  }

  initArray() {
    if(this.gameArray.length>0){ //clear array for new game
      for (let i = 0; i < 20; i++) {        
        for (let j = 0; j < 10; j++) {
         this.gameArray[i][j] = 0;
        }
    }
  } else {
    for (let i = 0; i < 20; i++) {
      let rowArray = new Array();
      for (let j = 0; j < 10; j++) {
        rowArray.push(0);
      }
      this.gameArray.push(rowArray);
    }
  }
}

  checkAllRows() {
    let destroyedRowsCount = 0;
    for (let i = 0; i < 20; i++) {
      let hasZero = false;
      for (let j = 0; j < 10; j++) {
        if (this.gameArray[i][j] === 0) {
          hasZero = true;
        }
      } if (!hasZero) {
        destroyedRowsCount++;
        for (let j = 0; j < 10; j++) {
          this.gameArray[i][j] = 0;          
        }this.fallRows(i);
      }
    }
  }

  fallRows(y: number) {
    for (let i = y; i > 0; i--) {
      for (let j = 0; j < 10; j++) {
        this.gameArray[i][j] = this.gameArray[i - 1][j];
        this.gameArray[i - 1][j] = 0;
      }
    }
  }

  drawCanvas() {
    this._ctx.fillStyle = 'black';
    this._ctx.fillRect(0, 0, this._windowWidth, this._windowHeight);
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.gameArray[i][j] > 0) {
          switch (this.gameArray[i][j]) {
            case 1:
              this._ctx.fillStyle = 'red';
              break;
            case 2:
              this._ctx.fillStyle = 'orange';
              break;
            case 3:
              this._ctx.fillStyle = 'yellow';
              break;
            case 4:
              this._ctx.fillStyle = 'green';
              break;
            case 5:
              this._ctx.fillStyle = 'blue';
              break;
            case 6:
              this._ctx.fillStyle = 'purple';
              break;
            case 7:
              this._ctx.fillStyle = 'pink';
              break;
          }
          this._ctx.fillRect(j * this._cubeSize, i * this._cubeSize, this._cubeSize, this._cubeSize);
        }
      }
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
  rotateCurrent() {
    if (this.getCurrentData(0, 'c') > 1) {// skip O shape
      let originX = this.getCurrentData(2, 'x');
      let originY = this.getCurrentData(2, 'y');
      for (let i = 0; i < 4; i++) {
        //translate to 0,0
        
        let tmpX = this.getCurrentData(i, 'x') - originX;
        let tmpY = this.getCurrentData(i, 'y') - originY;
        console.log(tmpX, tmpY);
        tmpY *= -1;
        let rotatedY = tmpY;
        let rotatedX = tmpX;
        rotatedX = tmpY * -1;
        rotatedY = tmpX * 1;
        rotatedY *= -1;
        rotatedY += originY;
        rotatedX += originX;
        console.log(rotatedY, rotatedX);
        this.setNewDataTmp(i, rotatedX, rotatedY, this.getCurrentData(i, 'c'));
        console.log(this._tmpTetroCords)
        this.removeCurrent();
        
        }
        if(this.checkCanRotate()){
          for(let i = 0; i < 4; i++) {
            this.generateCube(this.getTmpData(i, 'y'), this.getTmpData(i,'x'),this.getTmpData(i,'c'),i);
          } this.drawCurrent();
        } else {
          this.drawCurrent();
      }
    }
 
  }

  checkCanRotate(): boolean{
    let returned = true;
    for (let i = 0; i < 4; i++) {
      let x = this.getTmpData(i,'x');
      let y = this.getTmpData(i,'y');
      console.log(x,y);
      if(this.gameArray[y][x]>0) {
        returned = false;
      }      
    }
    return returned;
  }

  setNewDataTmp(index: number, x: number, y: number, c: number) {
    this._tmpTetroCords[index] = y * 10 + x + c / 10;
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
      this.checkAllRows();
      if (!this.checkIsOnTop()) {
        //console.log('collision');
        this.generateNext();
      }
      else {
        this._gameOver = true;
      }
    }
  }

  moveCurrentHorizontally(x: number) {
    if (x > 0 && this.checkCanMoveRight()) {
      this.removeCurrent();
      for (let i = 0; i < 4; i++) {
        this.changeCurrentX(i, 1);
      }
      this.drawCurrent();
      console.log(this.gameArray)
    } else if (x < 0 && this.checkCanMoveLeft()) {
      this.removeCurrent();
      for (let i = 0; i < 4; i++) {
        this.changeCurrentX(i, -1);
      }
      this.drawCurrent();
      console.log(this.gameArray)
    }
  }

  checkIsOnTop(): boolean {
    let returned = false;
    for (let i = 0; i < 4; i++) {
      if (this.getCurrentData(i, 'y') < 1) {
        returned = true;
      }
    }
    return returned;
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
      this._gameOver = true;
      this._playing = false;
    }
  }

  checkCanMoveDown(): boolean {
    let returned = true;
    for (let i = 0; i < 4; i++) {
      let x = this.getCurrentData(i, 'x');
      let y = this.getCurrentData(i, 'y');
      let collidesSelf = false;
      for (let j = 0; j < 4; j++) {
        if (this.getCurrentData(j, 'y') === y + 1 && this.getCurrentData(j, 'x') === x) { //check if below the cube is another current tetro's cube
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

  checkCanMoveRight(): boolean {
    let returned = true;
    for (let i = 0; i < 4; i++) {
      let x = this.getCurrentData(i, 'x');
      let y = this.getCurrentData(i, 'y');
      let collidesSelf = false;
      for (let j = 0; j < 4; j++) {
        if (this.getCurrentData(j, 'x') === x + 1 && this.getCurrentData(j, 'y') === y) { //check if on the right of the cube is another current tetro's cube
          collidesSelf = true;
        }
      }
      if (x + 1 >= 10) { //collision right end
        //console.log('bottom');
        returned = false
      } else if (!collidesSelf && this.gameArray[y][x + 1] !== 0) { //check if not 0 on the right that is not part of current tetro
        //console.log(collidesSelf, x, y)
        returned = false
      }
    }
    //console.log(returned);
    return returned;
  }

  checkCanMoveLeft(): boolean {
    let returned = true;
    for (let i = 0; i < 4; i++) {
      let x = this.getCurrentData(i, 'x');
      let y = this.getCurrentData(i, 'y');
      let collidesSelf = false;
      for (let j = 0; j < 4; j++) {
        if (this.getCurrentData(j, 'x') === x - 1 && this.getCurrentData(j, 'y') === y) { //check if on the right of the cube is another current tetro's cube
          collidesSelf = true;
        }
      }
      if (x - 1 <= -1) { //collision left end
        console.log('left');
        returned = false
      } else if (!collidesSelf && this.gameArray[y][x - 1] !== 0) { //check if not 0 on the right that is not part of current tetro
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
      if (this.gameArray[y][x] > 0) {
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
  getTmpData(index: number, data: string) {
    let y = Math.floor(this._tmpTetroCords[index] / 10);
    let x = Math.floor(this._tmpTetroCords[index] - y * 10);
    let c = Math.round(10 * (this._tmpTetroCords[index] - 10 * y - x));
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

  generateO() {
    this.generateCube(0, 4, 1, 0);
    this.generateCube(0, 5, 1, 1);
    this.generateCube(1, 4, 1, 2);
    this.generateCube(1, 5, 1, 3);
    //console.log('O')
  }
  generateI() {
    this.generateCube(0, 3, 2, 0);
    this.generateCube(0, 4, 2, 1);
    this.generateCube(0, 5, 2, 2);
    this.generateCube(0, 6, 2, 3);
    //console.log('I');
  }
  generateZ() {
    this.generateCube(0, 3, 3, 0);
    this.generateCube(0, 4, 3, 1);
    this.generateCube(1, 4, 3, 2); //center
    this.generateCube(1, 5, 3, 3);
    //console.log('Z');
  }
  generateS() {
    this.generateCube(0, 4, 4, 0);
    this.generateCube(0, 5, 4, 1);
    this.generateCube(1, 4, 4, 2); //center
    this.generateCube(1, 3, 4, 3);
    //console.log('S');
  }
  generateJ() {
    this.generateCube(0, 3, 5, 0);
    this.generateCube(0, 5, 5, 1);
    this.generateCube(0, 4, 5, 2); //center
    this.generateCube(1, 5, 5, 3);
    //console.log('J');
  }
  generateL() {
    this.generateCube(0, 3, 6, 0);
    this.generateCube(0, 5, 6, 1);
    this.generateCube(0, 4, 6, 2); //center
    this.generateCube(1, 3, 6, 3);
    //console.log('L');
  }
  generateV() {
    this.generateCube(0, 3, 7, 0);
    this.generateCube(0, 5, 7, 1);
    this.generateCube(0, 4, 7, 2); //center
    this.generateCube(1, 4, 7, 3);
    //console.log('V');
  }
}
