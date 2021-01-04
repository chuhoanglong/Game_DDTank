import Constants from '../Constants';
import Matter from 'matter-js';
import AsyncStore from '@react-native-async-storage/async-storage';

let xspeed = 0;
let yspeed = 0;

let xBspeed = 0;
let yBspeed = 0;

let bulletxSpeed = 0;
let bulletySpeed = 0;
let bulletNavigationX = 0;
let bulletNavigationY = -1;

let bulletxSpeed1 = 0;
let bulletySpeed1 = 0;
let bulletNavigationX1 = 0;
let bulletNavigationY1 = -1;
let bullets = [];

const scale = Constants.GRID_SIZE / Constants.BULLET_SIZE;// ti le kich thuoc giua tank va bullet

const GameLoop = (entities, { touches, events, dispatch, time }) => {

    const tank = entities.Tank;
    const bullet = entities.Bullet;
    const bullet1 = entities.Bullet1;
    const score = entities.Score;
    bullets = [bullet, bullet1];

    const enemy = entities.Enemy;

    const engine = entities.physics.engine;


    // dieu huong di chuyen
    if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {

            switch (events[i].type) {
                case 'move-up': {
                    xspeed = 0;
                    yspeed = -tank.speed;

                    const speedB = tank.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                    xBspeed = 0;
                    yBspeed = -speedB;

                    tank.rotate = 0;
                    bulletNavigationY1 = -1;
                    bulletNavigationX1 = 0;

                    bulletNavigationY = -1;
                    bulletNavigationX = 0;

                    break;
                }
                case 'move-down': {
                    xspeed = 0;
                    yspeed = tank.speed;

                    const speedB = tank.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                    xBspeed = 0;
                    yBspeed = speedB;

                    tank.rotate = 180;
                    bulletNavigationY1 = 1;
                    bulletNavigationX1 = 0;

                    bulletNavigationY = 1;
                    bulletNavigationX = 0;
                    break;
                }
                case 'move-left': {
                    xspeed = -tank.speed;
                    yspeed = 0;

                    const speedB = tank.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                    xBspeed = -speedB;
                    yBspeed = 0;

                    tank.rotate = 270;
                    bulletNavigationY1 = 0;
                    bulletNavigationX1 = -1;

                    bulletNavigationY = 0;
                    bulletNavigationX = -1;
                    break;
                }
                case 'move-right': {
                    tank.rotate = 90;
                    xspeed = tank.speed;
                    yspeed = 0;

                    const speedB = tank.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                    xBspeed = speedB;
                    yBspeed = 0;

                    bulletNavigationY1 = 0;
                    bulletNavigationX1 = 1;

                    bulletNavigationY = 0;
                    bulletNavigationX = 1;
                    break;
                }
                case 'end': {
                    xspeed = 0;
                    yspeed = 0;

                    xBspeed = 0;
                    yBspeed = 0;

                    break;
                }
                case 'bullet-shoot': {
                    if (bulletxSpeed == 0 && bulletySpeed == 0) {
                        // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                        bulletxSpeed = bullets[0].speed * bulletNavigationX;
                        bulletySpeed = bullets[0].speed * bulletNavigationY;
                    }
                    break;
                }
                case 'bullet-shoot1': {
                    if (bulletxSpeed1 == 0 && bulletySpeed1 == 0) {
                        // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                        bulletxSpeed1 = bullets[1].speed * bulletNavigationX1;
                        bulletySpeed1 = bullets[1].speed * bulletNavigationY1;
                    }
                    break;
                }
                default:
                    break;
            }

        }
    }

    // tank.nextMove = -1;
    if (tank.nextMove === 10) {
        tank.nextMove = tank.updateFrequency;
        //kiem tra tank ra khoi man hinh
        if (
            tank.body.position.x + xspeed < 0 ||
            tank.body.position.x + xspeed >= Constants.MAX_WIDTH / Constants.GRID_SIZE
        ) {
            if (tank.body.position.x + xspeed < 0) {
                // di ra khoi man hinh ben trai
                tank.body.position.x = Constants.MAX_WIDTH / Constants.GRID_SIZE;
            } else {
                // di ra khoi man hinh ben phai
                tank.body.position.x = 0;
            }
        } else if (
            tank.body.position.y + yspeed < 0 ||
            tank.body.position.y + yspeed >= Constants.MAX_HEIGHT / Constants.GRID_SIZE
        ) {
            if (tank.body.position.y + yspeed < 0) {
                // di ra khoi man hinh ben tren
                tank.body.position.y = Constants.MAX_HEIGHT / Constants.GRID_SIZE
            } else {
                // di ra khoi man hinh ben duoi
                tank.body.position.y = 0;
            }
        }

        //kiem tra bullets ra khoi man hinh
        if (bullets[0].position.x >= Constants.MAX_WIDTH / Constants.BULLET_SIZE) {
            // bullets di ra khoi man hinh ben phai;
            bullets[0].position.x = tank.body.position.x * scale;
            bullets[0].position.y = tank.body.position.y * scale;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        } else if (bullets[0].position.x < 0) {
            // bullets di ra khoi man hinh ben trai;
            const size = bullets[0].size;

            bullets[0].position.x = tank.body.position.x * size;
            bullets[0].position.y = tank.body.position.y * size;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        } else if (bullets[0].position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
            // bullets di ra khoi man hinh ben duoi;
            bullets[0].position.x = tank.body.position.x * scale;
            bullets[0].position.y = tank.body.position.y * scale;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        } else if (bullets[0].position.y < 0) {
            // bullets di ra khoi man hinh ben tren;
            bullets[0].position.x = tank.body.position.x * scale;
            bullets[0].position.y = tank.body.position.y * scale;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        }

        if (bulletxSpeed == 0 && bulletySpeed == 0) {
            // dua bullet di cung vi tri voi tank
            bullets[0].position.x += xBspeed;
            bullets[0].position.y += yBspeed;
        } else {
            // bullet di chuyen khi duoc ban
            bullets[0].position.x += bulletxSpeed;
            bullets[0].position.y += bulletySpeed;
        }

        //kiem tra bullets1 ra khoi man hinh
        if (bullets[1].position.x >= Constants.MAX_WIDTH / Constants.BULLET_SIZE) {
            // bullets di ra khoi man hinh ben phai;
            // dua bullet ve vi tri Tank.
            bullets[1].position.x = tank.body.position.x * scale;
            bullets[1].position.y = tank.body.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        } else if (bullets[1].position.x < 0) {
            // bullets di ra khoi man hinh ben trai;
            // dua bullet ve vi tri Tank.
            bullets[1].position.x = tank.body.position.x * scale;
            bullets[1].position.y = tank.body.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        } else if (bullets[1].position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
            // bullets di ra khoi man hinh ben duoi;
            // dua bullet ve vi tri Tank.
            bullets[1].position.x = tank.body.position.x * scale;
            bullets[1].position.y = tank.body.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        } else if (bullets[1].position.y < 0) {
            // bullets di ra khoi man hinh ben tren;
            // dua bullet ve vi tri Tank.
            bullets[1].position.x = tank.body.position.x * scale;
            bullets[1].position.y = tank.body.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        }

        if (bulletxSpeed1 == 0 && bulletySpeed1 == 0) {
            // dua bullet di cung vi tri voi tank
            bullets[1].position.x += xBspeed;
            bullets[1].position.y += yBspeed;
        } else {
            // bullet di chuyen khi duoc ban
            bullets[1].position.x += bulletxSpeed1;
            bullets[1].position.y += bulletySpeed1;
        }

        // tank di chuyen
        tank.body.position.x += xspeed;
        tank.body.position.y += yspeed;



        // khoi tao Rectangle cho entities de check va cham
        const bulletRectangle = new Rectangle(
            bullets[0].position.x * bullets[0].size, // position x
            bullets[0].position.y * bullets[0].size,// position y
            bullets[0].size, // width
            bullets[0].size, // height
        );
        const bulletRectangle1 = new Rectangle(
            bullets[1].position.x * bullets[1].size, // position x
            bullets[1].position.y * bullets[1].size,// position y
            bullets[1].size, // width
            bullets[1].size, // height
        );
        const enemyRectangle = new Rectangle(
            enemy.position.x * enemy.size,
            enemy.position.y * enemy.size,
            enemy.size,
            enemy.size
        );
        const birdRectangle = new Rectangle(
            tank.body.position.x * tank.size,
            tank.body.position.y * tank.size,
            tank.size,
            tank.size
        );

        // game over
        if (birdRectangle.testCollision(enemyRectangle)) {
            dispatch({ type: 'game-over', data: { message: 'day la data', score: score.score } });
            tank.body.position.x = Constants.MAX_WIDTH / Constants.GRID_SIZE / 2;
            tank.body.position.y = Constants.MAX_HEIGHT / Constants.GRID_SIZE / 2;
            tank.rotate = 0;
            bullets[0].position.x = tank.body.position.x * scale;
            bullets[0].position.y = tank.body.position.y * scale;
            bullets[1].position.x = tank.body.position.x * scale;
            bullets[1].position.y = tank.body.position.y * scale;
            bulletxSpeed = 0; bulletySpeed = 0;
            bulletxSpeed1 = 0; bulletySpeed1 = 0;
            score.score = 0;
            changeEnemy(enemy, true);
        }

        if (bulletxSpeed != 0 || bulletySpeed != 0) {
            // neu dan duoc ban thi thuc hien check va cham
            if (bulletRectangle.testCollision(enemyRectangle)) {
                // ban trung muc tieu
                bullets[0].position.x = tank.body.position.x * scale;
                bullets[0].position.y = tank.body.position.y * scale;
                bulletxSpeed = 0; bulletySpeed = 0;
                changeEnemy(enemy);
                score.score += 1;
                console.log('va cham bullet');
            }
        }
        if (bulletxSpeed1 != 0 || bulletySpeed1 != 0) {
            // neu dan duoc ban thi thuc hien check va cham
            if (bulletRectangle1.testCollision(enemyRectangle)) {
                // ban trung muc tieu
                bullets[1].position.x = tank.body.position.x * scale;
                bullets[1].position.y = tank.body.position.y * scale;
                bulletxSpeed1 = 0; bulletySpeed1 = 0;
                changeEnemy(enemy);
                score.score += 1;
                console.log('va cham bullet1');
            }
        }
    }

    return entities;
}

export default GameLoop;


const Rectangle = function (x, y, width, height) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Rectangle.prototype = {
    // get the four side coordinates of the rectangle
    get bottom() { return this.y + this.height; },
    get left() { return this.x; },
    get right() { return this.x + this.width; },
    get top() { return this.y; },

    testCollision: function (rectangle) {
        if (
            this.top > rectangle.bottom ||
            this.right < rectangle.left ||
            this.bottom < rectangle.top ||
            this.left > rectangle.right
        ) {
            // khong va cham
            return false;
        }
        // co va cham
        return true;
    }

};

const changeEnemy = (enemy, gameOver) => {
    Constants.playSound('explosion');
    if (gameOver) {
        enemy.position.x = Constants.randomEnemy(1, Constants.MAX_WIDTH / Constants.ENEMY_SIZE - 1);
        enemy.position.y = Constants.randomEnemy(1, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE - 1);
        return;
    }
    enemy.isLiving = false;
    setTimeout(() => {
        enemy.position.x = Constants.randomEnemy(1, Constants.MAX_WIDTH / Constants.ENEMY_SIZE - 1);
        enemy.position.y = Constants.randomEnemy(1, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE - 1);
        enemy.isLiving = true;
    }, 250);
}

const subPosition = (position, position1) => {
    const { x, y } = position; //enemy
    const { x1, y1 } = position1;//tank
    const vx = x - x1;
    const vy = -(y - y1);
    // vx*(c-x) + vy*(d-y) = 0;
}