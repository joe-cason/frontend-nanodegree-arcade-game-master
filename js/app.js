'use strict';

// *****************Define Objects************************** //
function Enemy() {
  const startX = [0, 101, 202, 303, 404, 505];
  // Randomly chooses between starting preset starting points on the X axis
  this.x = startX[Math.floor(Math.random(5) * startX.length)];
  // Steps down starting points on Y axis as enemies are added
  this.y = 50 + allEnemies.length * 85;
  // Randomly sets a speed factor for each enemy, with a floor increasing per difficulty level
  this.speed = 25 * game.level;
  this.sprite = 'images/enemy-bug.png';
}

function Player() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 404;
}

function UserInterface() {
  this.level = 1;
  this.lives = 3;
  this.score = 0;
  this.scoreText = 'Score: ' + this.score;
  this.finishText = '';
  this.levelText = '';
  this.sprite = 'images/Heart.png';
  this.prompt = '';
}

// ************** Draw the objects on the screen****************** //
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  console.log('Enemy: render');
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

UserInterface.prototype.render = function() {
  ctx.lineWidth = 8;
  ctx.fillStyle = 'gold';
  ctx.font = '20pt Arial Black';
  ctx.strokeStyle = '#000';

  ctx.strokeText(this.finishText, 160, 200);
  ctx.fillText(this.finishText, 160, 200);
  ctx.strokeText(this.levelText, 350, 100);
  ctx.fillText(this.levelText, 350, 100);
  ctx.strokeText(this.scoreText, 10, 110);
  ctx.fillText(this.scoreText, 10, 110);

  ctx.lineWidth = 8;
  ctx.fillStyle = 'gold';
  ctx.font = '10pt Arial Black';
  ctx.strokeStyle = '#000';

  ctx.strokeText(this.prompt, 145, 310);
  ctx.fillText(this.prompt, 145, 310);

  // Draws 1 heart per life left, scaled down from original with a sligth offset so they stack a little
  for (let i = 0; i < this.lives; i++) {
    let heartXPosition = [10, 45, 80];
    ctx.drawImage(Resources.get(this.sprite), heartXPosition[i], 50, 40, 40);
  }
};

UserInterface.prototype.reset = function() {
  this.level = 1;
  this.lives = 3;
  this.score = 0;
};

// ****************** Update Objects **************************** //
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  // Changes X axis according to speed and dt
  this.x += this.speed * dt;
  // If enemy falls out of canvas, send it to the other side so it falls back in
  if (this.x > 505) {
    this.x = -Resources.get(this.sprite).width;
  }

  // reset the player if a collision occurs with the enemy
  if (this.y - 50 <= player.y && this.y + 50 >= player.y) {
    if (this.x >= player.x - 45 && this.x <= player.x + 45) {
      game.lives--;
      player.x = 200;
      player.y = 404;

      // If no lives left go to endGame
      if (game.lives == 0) {
        game.endGame();
      }
    }
  }
};

Player.prototype.update = function(dt) {
  if (this.y == -21) {
    this.y = 404;
    game.update();
  }
  if (this.y == 489) {
    this.y = 404;
  }
  if (this.x == -100) {
    this.x = 0;
  }
  if (this.x == 500) {
    this.x = 400;
  }
};

UserInterface.prototype.update = function(dt) {
  this.levelText = `Level ${this.level}`;
  this.level += 1;
  this.score += 10;
  this.scoreText = `Score: ${this.score}`;

  if (allEnemies.length == 4) {
    allEnemies = [];
    allEnemies.push(new Enemy());
  } else {
    allEnemies.push(new Enemy());
  }
  console.log('you reached UserInterface.prototype.update');
};

//All lives have been lost, so show the game results
UserInterface.prototype.endGame = function(dt) {
  allEnemies = [];
  game.finishText = 'GAME OVER';
  this.prompt = 'press spacebar to play again';
};

//Reset all the variables and restart the game
UserInterface.prototype.reset = function(dt) {
  this.level = 1;
  this.levelText = `Level ${this.level}`;
  this.finishText = '';
  this.lives = 3;
  this.score = 0;
  this.scoreText = 'Score: ' + this.score;
  this.prompt = '';

  allEnemies = [];
  allEnemies.push(new Enemy());
};

// ********************** handlers ************************* //
Player.prototype.handleInput = function(key) {
  if (game.finishText !== 'GAME OVER') {
    switch (key) {
      case 'left':
        this.x -= 100;
        break;
      case 'right':
        this.x += 100;
        break;
      case 'up':
        this.y -= 85;
        break;
      case 'down':
        this.y += 85;
    }
    this.update();
  } else if (key == 'spacebar') {
    //allow spacebar to reset the game
    game.reset();
  }
  console.log('x/y = ' + this.x + '/' + this.y);
};

// ********************** listen for keypresses ******************** //
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'spacebar'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

// ********************** Instantiate objects ******************* //

let game = new UserInterface();
let allEnemies = [];
allEnemies.push(new Enemy());
let player = new Player();
