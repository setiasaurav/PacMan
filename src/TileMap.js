import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;

    this.yellowDot = new Image();
    this.yellowDot.src = "../images/yellowDot.png";

    this.wall = new Image();
    this.wall.src = "../images/wall.png";

    this.pinkDot = new Image();
    this.pinkDot.src = "../images/pinkDot.png";

    this.powerDot = this.pinkDot;
    this.powerDotAnimationTimerDefault = 30;
    this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
  }

  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 6, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 6, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 7, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  // 0 - Yellow dot
  // 1 - Wall
  // 4 - PacMan
  // 5 - Black
  // 6 - Enemy
  // 7 - Power Dot

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(ctx, column, row, this.tileSize);
        } else if (tile === 0) {
          this.#drawDot(ctx, column, row, this.tileSize);
        } else if (tile === 7) {
          this.#drawPowerDot(ctx, column, row, this.tileSize);
        } else {
          this.#drawBlank(ctx, column, row, this.tileSize);
        }

        //Draws tile grid
        ctx.strokeStyle = "grey";
        ctx.strokeRect(
          column * this.tileSize,
          row * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  #drawWall(ctx, column, row, size) {
    ctx.drawImage(
      this.wall,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawDot(ctx, column, row, size) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawPowerDot(ctx, column, row, size) {
    this.powerDotAnimationTimer--;
    if (this.powerDotAnimationTimer === 0) {
      this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
      if (this.powerDot == this.pinkDot) {
        this.powerDot = this.yellowDot;
      } else {
        this.powerDot = this.pinkDot;
      }
    }
    ctx.drawImage(
      this.powerDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawBlank(ctx, column, row, size) {
    ctx.fillStyle = "black";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }

  // .flat method converts 2 dimensional array into one
  // .filter method finds out if any '0' is present in the array
  #dotsLeft() {
    return this.map.flat().filter((tile) => tile === 0).length;
  }

  getPacman(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 4) {
          this.map[row][column] = 0;
          return new Pacman(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          );
        }
      }
    }
  }

  getEnemies(velocity) {
    const enemies = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile === 6) {
          this.map[row][column] = 0;
          enemies.push(
            new Enemy(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          );
        }
      }
    }
    return enemies;
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }

    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let row = 0;
      let column = 0;
      let nextColumn = 0;
      let nextRow = 0;

      switch (direction) {
        case MovingDirection.right:
          nextColumn = x + this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.left:
          nextColumn = x - this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
        case MovingDirection.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
      }
      const tile = this.map[row][column];
      if (tile === 1) {
        return true;
      }
    }
    return false;
  }

  eatDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === 0) {
        this.map[row][column] = 5;
        return true;
      }
    }
    return false;
  }

  eatPowerDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === 7) {
        this.map[row][column] = 5;
        return true;
      }
    }
    return false;
  }

  didWin() {
    return this.#dotsLeft() === 0;
  }

  printsss() {
    console.log(this.map);
  }
}
