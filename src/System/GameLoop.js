import Constants from '../Constants';

let xspeed = 0;
let yspeed = 0;

let xBspeed = 0;
let yBspeed = 0;

let xBEspeed = 0;
let yBEspeed = 0;

let enemyxSpeed = 0;
let enemyySpeed = 0;

let bulletxSpeed = 0;
let bulletySpeed = 0;
let bulletNavigationX = 1;
let bulletNavigationY = 0;

let bulletxSpeed1 = 0;
let bulletySpeed1 = 0;
let bulletNavigationX1 = 1;
let bulletNavigationY1 = 0;

let bulletxSpeedEnemy = 0;
let bulletySpeedEnemy = 0;
let bulletNavigationXEnemy = -1;
let bulletNavigationYEnemy = 0;

let bulletxSpeedEnemy1 = 0;
let bulletySpeedEnemy1 = 0;
let bulletNavigationXEnemy1 = -1;
let bulletNavigationYEnemy1 = 0;

let bullets = [];
let bulletsEnemy = [];
const scale = Constants.GRID_SIZE / Constants.BULLET_SIZE;// ti le kich thuoc giua tank va bullet
const scaleEnemyAndBullet = Constants.ENEMY_SIZE / Constants.BULLET_SIZE;

const GameLoop = (entities, { touches, events, dispatch, time }) => {

    // khai bao cac thuc the
    const tank = entities.Tank;
    const bullet = entities.Bullet;
    const bullet1 = entities.Bullet1;
    const bulletEnemy = entities.BulletEnemy;
    const bulletEnemy1 = entities.BulletEnemy;
    bullets = [bullet, bullet1];
    bulletsEnemy = [bulletEnemy, bulletEnemy1];

    const enemy = entities.Enemy;

    // dieu huong di chuyen
    if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {

            switch (events[i].type) {
                // dieu khien di chuyen cho tank
                case 'move-up': {
                    xspeed = 0;
                    yspeed = -tank.speed;

                    const speedB = tank.speed * scale;
                    xBspeed = 0;
                    yBspeed = -speedB;

                    tank.rotate = 0;
                    bulletNavigationY1 = -1;
                    bulletNavigationX1 = 0;

                    bulletNavigationY = -1;
                    bulletNavigationX = 0;

                    // const socketEnemy = enemy.socket;
                    // socketEnemy.emit('event', { type: 'move-up' });

                    break;
                }
                case 'move-down': {
                    xspeed = 0;
                    yspeed = tank.speed;

                    const speedB = tank.speed * scale;
                    xBspeed = 0;
                    yBspeed = speedB;

                    tank.rotate = 180;
                    bulletNavigationY1 = 1;
                    bulletNavigationX1 = 0;

                    bulletNavigationY = 1;
                    bulletNavigationX = 0;

                    // const socketEnemy = enemy.socket;
                    // socketEnemy.emit('event', { type: 'move-down' });

                    break;
                }
                case 'move-left': {
                    xspeed = -tank.speed;
                    yspeed = 0;

                    const speedB = tank.speed * scale;
                    xBspeed = -speedB;
                    yBspeed = 0;

                    tank.rotate = 270;
                    bulletNavigationY1 = 0;
                    bulletNavigationX1 = -1;

                    bulletNavigationY = 0;
                    bulletNavigationX = -1;

                    // const socketEnemy = enemy.socket;
                    // socketEnemy.emit('event', { type: 'move-left' });

                    break;
                }
                case 'move-right': {
                    tank.rotate = 90;
                    xspeed = tank.speed;
                    yspeed = 0;

                    const speedB = tank.speed * scale;
                    xBspeed = speedB;
                    yBspeed = 0;

                    bulletNavigationY1 = 0;
                    bulletNavigationX1 = 1;

                    bulletNavigationY = 0;
                    bulletNavigationX = 1;

                    // const socketEnemy = enemy.socket;
                    // socketEnemy.emit('event', { type: 'move-right' });

                    break;
                }
                case 'move-end': {
                    xspeed = 0;
                    yspeed = 0;

                    xBspeed = 0;
                    yBspeed = 0;

                    // enemyxSpeed = 0;
                    // enemyySpeed = 0;

                    // const socketEnemy = enemy.socket;
                    // socketEnemy.emit('event', { type: 'move-end' });

                    break;
                }

                // dieu khien ban dan
                case 'bullet-shoot': {
                    // const socketEnemy = enemy.socket;
                    // socketEnemy.emit('event', { type: 'bullet-shoot' });
                    if (bulletxSpeed == 0 && bulletySpeed == 0) {
                        // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                        bulletxSpeed = bullets[0].speed * bulletNavigationX;
                        bulletySpeed = bullets[0].speed * bulletNavigationY;
                    }
                    break;
                }
                case 'bullet-shoot1': {
                    // const socketEnemy = enemy.socket;
                    // socketEnemy.emit('event', { type: 'bullet-shoot1' });
                    if (bulletxSpeed1 == 0 && bulletySpeed1 == 0) {
                        // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                        bulletxSpeed1 = bullets[1].speed * bulletNavigationX1;
                        bulletySpeed1 = bullets[1].speed * bulletNavigationY1;
                    }
                    break;
                }

                // dieu khien di chuyen cho enemy
                case 'move-up-tank1': {
                    // góc ddi của tank
                    enemy.rotate = 0;
                    enemyySpeed = -enemy.speed;
                    enemyxSpeed = 0;

                    // góc bắn của đạn
                    bulletNavigationXEnemy = 0;
                    bulletNavigationYEnemy = -1;

                    // tốc độ của đạn
                    const speedBE = enemy.speed * scaleEnemyAndBullet;
                    xBEspeed = 0;
                    yBEspeed = -speedBE;

                    break;
                }

                case 'move-down-tank1': {
                    // góc đi của tank
                    enemy.rotate = 180;
                    enemyySpeed = enemy.speed;
                    enemyxSpeed = 0;

                    // góc bắn của đạn
                    bulletNavigationXEnemy = 0;
                    bulletNavigationYEnemy = 1;

                    // tốc độ của đạn
                    const speedBE = enemy.speed * scaleEnemyAndBullet;
                    xBEspeed = 0;
                    yBEspeed = speedBE;
                    break;
                }

                case 'move-left-tank1': {
                    // góc đi của tank
                    enemy.rotate = 270;
                    enemyySpeed = 0;
                    enemyxSpeed = -enemy.speed;

                    // góc bắn của đạn
                    bulletNavigationXEnemy = -1;
                    bulletNavigationYEnemy = 0;

                    // tốc độ của đạn
                    const speedBE = enemy.speed * scaleEnemyAndBullet;
                    xBEspeed = -speedBE;
                    yBEspeed = 0;
                    break;
                }

                case 'move-right-tank1': {
                    enemy.rotate = 90;
                    enemyySpeed = 0;
                    enemyxSpeed = enemy.speed;

                    // góc bắn của đạn
                    bulletNavigationXEnemy = 1;
                    bulletNavigationYEnemy = 0;

                    const speedBE = enemy.speed * scaleEnemyAndBullet;
                    xBEspeed = speedBE;
                    yBEspeed = 0;
                    break;
                }

                case 'move-end-tank1': {
                    enemyxSpeed = 0;
                    enemyySpeed = 0;
                    xBEspeed = 0;
                    yBEspeed = 0;
                    break;
                }

                // dieu khien ban dan
                case 'bullet-shoot-enemy': {
                    if (bulletxSpeedEnemy == 0 && bulletySpeedEnemy == 0) {
                        // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                        bulletxSpeedEnemy = bulletsEnemy[0].speed * bulletNavigationXEnemy;
                        bulletySpeedEnemy = bulletsEnemy[0].speed * bulletNavigationYEnemy;
                    }
                    break;
                }
                case 'bullet-shoot-enemy1': {
                    if (bulletxSpeedEnemy1 == 0 && bulletySpeedEnemy1 == 0) {
                        // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                        bulletxSpeedEnemy1 = bulletsEnemy[1].speed * bulletNavigationXEnemy1;
                        bulletySpeedEnemy1 = bulletsEnemy[1].speed * bulletNavigationYEnemy1;
                    }
                    break;
                }

                case 'gamestart': {
                    //reset tank1 về trạng thái bắt đầu.
                    tank.body.position.x = Constants.MAX_WIDTH / Constants.GRID_SIZE;
                    tank.body.position.y = Constants.MAX_HEIGHT / Constants.GRID_SIZE / 2.5;
                    tank.rotate = 90;
                    bullets[0].position.x = tank.body.position.x * scale;
                    bullets[0].position.y = tank.body.position.y * scale;
                    bullets[1].position.x = tank.body.position.x * scale;
                    bullets[1].position.y = tank.body.position.y * scale;
                    bulletxSpeed = 0;
                    bulletySpeed = 0;
                    bulletxSpeed1 = 0;
                    bulletySpeed1 = 0;
                    //reset tank2 về vị trí bắt đầu.
                    enemy.body.position.x = Constants.MAX_WIDTH / Constants.ENEMY_SIZE / 1.1;
                    enemy.body.position.y = Constants.MAX_HEIGHT / Constants.ENEMY_SIZE / 2;
                    bulletsEnemy[0].position.x = tank.body.position.x * scaleEnemyAndBullet;
                    bulletsEnemy[0].position.y = tank.body.position.y * scaleEnemyAndBullet;
                    enemy.rotate = 270;
                    bulletxSpeedEnemy = 0;
                    bulletySpeedEnemy = 0;
                    bulletxSpeedEnemy1 = 0;
                    bulletySpeedEnemy1 = 0;

                    tank.isLiving = true;
                    enemy.isLiving = true;
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
        checkBorderTank(tank);
        checkBorderTank(enemy);

        //kiem tra bullets ra khoi man hinh
        checkBorderBullet(bullets[0], tank);
        checkBorderBullet1(bullets[1], tank);
        checkBorderBulletEnemy(bulletsEnemy[0], enemy);
        // checkBorderBulletEnemy1(bulletsEnemy[1], enemy);

        // tank di chuyen
        tank.body.position.x += xspeed;
        tank.body.position.y += yspeed;

        // enemy di chuyen
        enemy.body.position.x += enemyxSpeed;
        enemy.body.position.y += enemyySpeed;

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

        const bulletRectangleEnemy = new Rectangle(
            bulletsEnemy[0].position.x * bulletsEnemy[0].size, // position x
            bulletsEnemy[0].position.y * bulletsEnemy[0].size,// position y
            bulletsEnemy[0].size, // width
            bulletsEnemy[0].size, // height
        )

        const enemyRectangle = new Rectangle(
            enemy.body.position.x * enemy.size,
            enemy.body.position.y * enemy.size,
            enemy.size,
            enemy.size
        );
        const tankRectangle = new Rectangle(
            tank.body.position.x * tank.size,
            tank.body.position.y * tank.size,
            tank.size,
            tank.size
        );

        // game over
        // if (tankRectangle.testCollision(enemyRectangle)) {
        //     dispatch({ type: 'game-over', data: { message: 'day la data', score: score.score } });
        //     //reset tank1 về trạng thái bắt đầu.
        //     tank.body.position.x = Constants.MAX_WIDTH / Constants.GRID_SIZE;
        //     tank.body.position.y = Constants.MAX_HEIGHT / Constants.GRID_SIZE / 2.5;
        //     tank.rotate = 90;
        //     bullets[0].position.x = tank.body.position.x * scale;
        //     bullets[0].position.y = tank.body.position.y * scale;
        //     bullets[1].position.x = tank.body.position.x * scale;
        //     bullets[1].position.y = tank.body.position.y * scale;
        //     bulletxSpeed = 0;
        //     bulletySpeed = 0;
        //     bulletxSpeed1 = 0;
        //     bulletySpeed1 = 0;
        //     //reset tank2 về vị trí bắt đầu.
        //     enemy.body.position.x = Constants.MAX_WIDTH / Constants.ENEMY_SIZE / 1.1;
        //     enemy.body.position.y = Constants.MAX_HEIGHT / Constants.ENEMY_SIZE / 2;
        //     enemy.rotate = 270;
        //     bulletxSpeedEnemy = 0;
        //     bulletySpeedEnemy = 0;
        //     bulletxSpeedEnemy1 = 0;
        //     bulletySpeedEnemy1 = 0;
        // }

        if (bulletxSpeedEnemy != 0 || bulletySpeedEnemy != 0) {
            if (bulletRectangleEnemy.testCollision(tankRectangle)) {
                dispatch({ type: 'end-game', data: { top1: 'Top 1: user2', top2: 'Top 2: user1', win: 'user2' } });
                bulletsEnemy[0].position.x = enemy.body.position.x * scaleEnemyAndBullet;
                bulletsEnemy[0].position.y = enemy.body.position.y * scaleEnemyAndBullet;
                tank.isLiving = false;
                return entities;
            }
        }

        // ////
        if (bulletxSpeed != 0 || bulletySpeed != 0) {
            // neu dan duoc ban thi thuc hien check va cham
            if (bulletRectangle.testCollision(enemyRectangle)) {
                dispatch({ type: 'end-game', data: { top1: 'Top 1: user1', top2: 'Top 2: user2', win: 'user1', } });
                // ban trung muc tieu
                bullets[0].position.x = tank.body.position.x * scale;
                bullets[0].position.y = tank.body.position.y * scale;
                bulletxSpeed = 0; bulletySpeed = 0;
                enemy.isLiving = false;
                return entities;
            }
        }
        if (bulletxSpeed1 != 0 || bulletySpeed1 != 0) {
            // neu dan duoc ban thi thuc hien check va cham
            if (bulletRectangle1.testCollision(enemyRectangle)) {
                dispatch({ type: 'end-game', data: { top1: 'Top 1: user1', top2: 'Top 2: user2', win: 'user1', } });
                // ban trung muc tieu
                bullets[1].position.x = tank.body.position.x * scale;
                bullets[1].position.y = tank.body.position.y * scale;
                bulletxSpeed1 = 0; bulletySpeed1 = 0;
                enemy.isLiving = false;
                return entities;
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

const checkBorderTank = (tank) => {
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
            tank.body.position.y = Constants.MAX_HEIGHT / Constants.GRID_SIZE;
        } else {
            // di ra khoi man hinh ben duoi
            tank.body.position.y = 0;
        }
    }
}

const checkBorderBullet = (entitie, entitie1) => {
    if (entitie.position.x >= Constants.MAX_WIDTH / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben phai;
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed = 0;
        bulletySpeed = 0;
    } else if (entitie.position.x < 0) {
        // bullets di ra khoi man hinh ben trai;
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed = 0;
        bulletySpeed = 0;
    } else if (entitie.position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben duoi;
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed = 0;
        bulletySpeed = 0;
    } else if (entitie.position.y < 0) {
        // bullets di ra khoi man hinh ben tren;
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed = 0;
        bulletySpeed = 0;
    }

    if (bulletxSpeed == 0 && bulletySpeed == 0) {
        // dua bullet di cung vi tri voi entitie1
        entitie.position.x += xBspeed;
        entitie.position.y += yBspeed;
        entitie.display = false;
    } else {
        // bullet di chuyen khi duoc ban
        entitie.position.x += bulletxSpeed;
        entitie.position.y += bulletySpeed;
        entitie.display = true;
    }
}

const checkBorderBullet1 = (entitie, entitie1) => {
    //kiem tra bullets1 ra khoi man hinh
    if (entitie.position.x >= Constants.MAX_WIDTH / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben phai;
        // dua bullet ve vi tri Tank.
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed1 = 0;
        bulletySpeed1 = 0;
    } else if (entitie.position.x < 0) {
        // bullets di ra khoi man hinh ben trai;
        // dua bullet ve vi tri Tank.
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed1 = 0;
        bulletySpeed1 = 0;
    } else if (entitie.position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben duoi;
        // dua bullet ve vi tri Tank.
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed1 = 0;
        bulletySpeed1 = 0;
    } else if (entitie.position.y < 0) {
        // bullets di ra khoi man hinh ben tren;
        // dua bullet ve vi tri Tank.
        entitie.position.x = entitie1.body.position.x * scale;
        entitie.position.y = entitie1.body.position.y * scale;
        bulletxSpeed1 = 0;
        bulletySpeed1 = 0;
    }

    if (bulletxSpeed1 == 0 && bulletySpeed1 == 0) {
        // dua bullet di cung vi tri voi entitie1
        entitie.position.x += xBspeed;
        entitie.position.y += yBspeed;
        entitie.display = false;
    } else {
        // bullet di chuyen khi duoc ban
        entitie.position.x += bulletxSpeed1;
        entitie.position.y += bulletySpeed1;
        entitie.display = true;
    }
}

const checkBorderBulletEnemy = (entitie, entitie1) => {
    if (entitie.position.x >= Constants.MAX_WIDTH / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben phai;
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy = 0;
        bulletySpeedEnemy = 0;
    } else if (entitie.position.x < 0) {
        // bullets di ra khoi man hinh ben trai;
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy = 0;
        bulletySpeedEnemy = 0;
    } else if (entitie.position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben duoi;
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy = 0;
        bulletySpeedEnemy = 0;
    } else if (entitie.position.y < 0) {
        // bullets di ra khoi man hinh ben tren;
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy = 0;
        bulletySpeedEnemy = 0;
    }

    if (bulletxSpeedEnemy == 0 && bulletySpeedEnemy == 0) {
        // dua bullet di cung vi tri voi entitie1
        entitie.position.x += xBEspeed;
        entitie.position.y += yBEspeed;
        entitie.display = false;
    } else {
        // bullet di chuyen khi duoc ban
        entitie.position.x += bulletxSpeedEnemy;
        entitie.position.y += bulletySpeedEnemy;
        entitie.display = true;
    }
}

const checkBorderBulletEnemy1 = (entitie, entitie1) => {
    //kiem tra bullets1 ra khoi man hinh
    if (entitie.position.x >= Constants.MAX_WIDTH / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben phai;
        // dua bullet ve vi tri Enemy.
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy1 = 0;
        bulletySpeedEnemy1 = 0;
    } else if (entitie.position.x < 0) {
        // bullets di ra khoi man hinh ben trai;
        // dua bullet ve vi tri Enemy.
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy1 = 0;
        bulletySpeedEnemy1 = 0;
    } else if (entitie.position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
        // bullets di ra khoi man hinh ben duoi;
        // dua bullet ve vi tri Enemy.
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy1 = 0;
        bulletySpeedEnemy1 = 0;
    } else if (entitie.position.y < 0) {
        // bullets di ra khoi man hinh ben tren;
        // dua bullet ve vi tri Enemy.
        entitie.position.x = entitie1.body.position.x * scaleEnemyAndBullet;
        entitie.position.y = entitie1.body.position.y * scaleEnemyAndBullet;
        bulletxSpeedEnemy1 = 0;
        bulletySpeedEnemy1 = 0;
    }

    if (bulletxSpeedEnemy1 == 0 && bulletySpeedEnemy1 == 0) {
        // dua bullet di cung vi tri voi entitie1
        entitie.position.x += xBEspeed;
        entitie.position.y += yBEspeed;
    } else {
        // bullet di chuyen khi duoc ban
        entitie.position.x += bulletxSpeedEnemy1;
        entitie.position.y += bulletySpeedEnemy1;
    }
}