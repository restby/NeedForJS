const MAX_ENEMY = 8;
const HEIGHT_ELEM = 100;
const score = document.querySelector('.score');
const topScore = document.querySelector('.topScore');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const audio = document.createElement('embed');
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};
const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 0,
  level: 0,
};
const localScore = +localStorage.getItem('nfjs_score', setting.score);
let level = setting.level;

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
/*
  const audio = document.createElement('audio');
  audio.src = 'audio.mp3';
  audio.volume = 0.5;
*/
audio.src = 'audio.mp3';
audio.type = 'audio/mp3';
/**/
audio.style.cssText = `position: absolute; left: 0; top: 0;`;
car.classList.add('car');
gameArea.style.height = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM) * HEIGHT_ELEM;
topScore.textContent = localScore ? localScore : 0;

function startGame(event) {
  /*
  audio.play();
  audio.pause();
  */

  const target = event.target;
  if (target === start) {
    return;
  }
  switch (target.id) {
    case 'easy':
      setting.speed = 4;
      setting.traffic = 4;
      break;
    case 'medium':
      setting.speed = 6;
      setting.traffic = 4;
      break;
    case 'hard':
      setting.speed = 7;
      setting.traffic = 3;
      break;
    default:

      break;
  }

  start.classList.add('hide');
  gameArea.innerHTML = '';

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.height = HEIGHT_ELEM / 2 + 'px';
    line.style.top = `${i * HEIGHT_ELEM}px`;
    // line.style.top = (i * HEIGHT_ELEM) + 'px';
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');

    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add('enemy');
    const periodEnemy = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.y = periodEnemy < 100 ? -100 * setting.traffic * (i + 1) : periodEnemy;
    enemy.style.top = enemy.y + 'px';
    enemy.style.backgroundImage = `url("image/enemy${randomEnemy}.png")`;
    // enemy.style.backgroundImage = 'url("image/enemy.png")';
    gameArea.append(enemy);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
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
  // document.body.append(audio);
  /**/
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  setting.level = Math.floor(setting.score / 4000);
  if (setting.level !== level) {
    level = setting.level;
    setting.speed++;
  }


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
  return (gameArea.offsetHeight / heightElement) + 1;
}

function addLocalStorage() {
  if (localScore < setting.score) {
    localStorage.setItem('nfjs_score', setting.score);
    topScore.textContent = setting.score;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(item => {
    item.y += setting.speed;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM;
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
      audio.remove();
      console.warn('Crash!!');
      start.classList.remove('hide');
      // score.style.top = `${start.offsetHeight}px`;
      score.style.top = start.offsetHeight + 'px';
      addLocalStorage();
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
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