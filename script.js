const MAX_ENEMY = 7;
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const audio = document.createElement('embed');
/*
  const audio = document.createElement('audio');
  audio.src = 'audio.mp3';
  audio.volume = 0.5;
*/

audio.src = 'audio.mp3';
audio.type = 'audio/mp3';

/**/
audio.style.cssText = `position: absolute; left: 0; top: 0;`;
//audio.remove();
car.classList.add('car');
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
};

function startGame() {
  /*
  audio.play();
  audio.pouse();
  */
  start.classList.add('hide');
  gameArea.innerHTML = '';

  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * 100}px`;
    // line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.top = enemy.y + 'px';
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.backgroundImage = `url("image/enemy${randomEnemy}.png")`;
    // enemy.style.backgroundImage = 'url("image/enemy.png")';
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.start = true;
  score.style.top = 0;
  gameArea.append(car);
  // car.style.left = '125px';
  car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2) + 'px';
  // car.style.left = `${(gameArea.offsetWidth / 2) - (car.offsetWidth / 2)}px`;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  document.body.append(audio);
  /**/
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}



function playGame() {
  if (setting.start === true) {
    setting.score += setting.speed;
    score.textContent = 'SCORE: ' + setting.score;
    moveRoad();
    moveEnemy();

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
}

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(item => {
    item.y += setting.speed;
    item.style.top = item.y + 'px';

    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100;
    }
  });
}

function moveEnemy() {
  let enemies = document.querySelectorAll('.enemy');
  enemies.forEach(item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      console.warn('Crash!!');
      start.classList.remove('hide');
      // score.style.top = `${start.offsetHeight}px`;
      score.style.top = start.offsetHeight + 'px';
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
  }
  keys[event.key] = true;
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
  }
  keys[event.key] = false;
}