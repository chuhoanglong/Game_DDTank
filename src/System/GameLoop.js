import Constants from '../Constants';

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

const scale = Constants.GRID_SIZE / Constants.BULLET_SIZE;// ti le kich thuoc giua bird va bullet

const GameLoop = (entities, { touches, events, dispatch }) => {

    const bird = entities.Bird;
    const bullet = entities.Bullet;
    const bullet1 = entities.Bullet1;
    bullets = [bullet, bullet1];

    const enemy = entities.Enemy;

    // dieu huong di chuyen
    if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
            if (events[i].type == 'move-up') {
                xspeed = 0;
                yspeed = -bird.speed;

                const speedB = bird.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                xBspeed = 0;
                yBspeed = -speedB;

                bird.rotate = '0deg';
                bulletNavigationY1 = -1;
                bulletNavigationX1 = 0;

                bulletNavigationY = -1;
                bulletNavigationX = 0;
            } else if (events[i].type == 'move-down') {
                xspeed = 0;
                yspeed = bird.speed;

                const speedB = bird.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                xBspeed = 0;
                yBspeed = speedB;

                bird.rotate = '180deg';
                bulletNavigationY1 = 1;
                bulletNavigationX1 = 0;

                bulletNavigationY = 1;
                bulletNavigationX = 0;
            } else if (events[i].type == 'move-left') {
                xspeed = -bird.speed;
                yspeed = 0;

                const speedB = bird.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                xBspeed = -speedB;
                yBspeed = 0;

                bird.rotate = '270deg';
                bulletNavigationY1 = 0;
                bulletNavigationX1 = -1;

                bulletNavigationY = 0;
                bulletNavigationX = -1;
            } else if (events[i].type == 'move-right') {
                bird.rotate = '90deg';
                xspeed = bird.speed;
                yspeed = 0;

                const speedB = bird.speed * Constants.GRID_SIZE / Constants.BULLET_SIZE;
                xBspeed = speedB;
                yBspeed = 0;

                bulletNavigationY1 = 0;
                bulletNavigationX1 = 1;

                bulletNavigationY = 0;
                bulletNavigationX = 1;
            } else if (events[i].type == 'bullet-shoot') {

                if (bulletxSpeed == 0 && bulletySpeed == 0) {
                    // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                    bulletxSpeed = bullets[0].speed * bulletNavigationX;
                    bulletySpeed = bullets[0].speed * bulletNavigationY;
                }
            } else if (events[i].type == 'bullet-shoot1') {

                if (bulletxSpeed1 == 0 && bulletySpeed1 == 0) {
                    // đạn ở trạng thái chưa bắn mới cho phép thực hiện bắn.
                    bulletxSpeed1 = bullets[1].speed * bulletNavigationX1;
                    bulletySpeed1 = bullets[1].speed * bulletNavigationY1;
                }
            }
        }
    }

    // bird.nextMove = -1;
    if (bird.nextMove === 10) {
        bird.nextMove = bird.updateFrequency;
        //kiem tra bird ra khoi man hinh
        if (
            bird.position.x + xspeed < 0 ||
            bird.position.x + xspeed >= Constants.MAX_WIDTH / Constants.GRID_SIZE
        ) {
            if (bird.position.x + xspeed < 0) {
                // di ra khoi man hinh ben trai
                bird.position.x = Constants.MAX_WIDTH / Constants.GRID_SIZE;
            } else {
                // di ra khoi man hinh ben phai
                bird.position.x = 0;
            }
        } else if (
            bird.position.y + yspeed < 0 ||
            bird.position.y + yspeed >= Constants.MAX_HEIGHT / Constants.GRID_SIZE
        ) {
            if (bird.position.y + yspeed < 0) {
                // di ra khoi man hinh ben tren
                bird.position.y = Constants.MAX_HEIGHT / Constants.GRID_SIZE
            } else {
                // di ra khoi man hinh ben duoi
                bird.position.y = 0;
            }
        }

        //kiem tra bullets ra khoi man hinh
        if (bullets[0].position.x >= Constants.MAX_WIDTH / Constants.BULLET_SIZE) {
            // bullets di ra khoi man hinh ben phai;
            bullets[0].position.x = bird.position.x * scale;
            bullets[0].position.y = bird.position.y * scale;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        } else if (bullets[0].position.x < 0) {
            // bullets di ra khoi man hinh ben trai;
            const size = bullets[0].size;

            bullets[0].position.x = bird.position.x * size;
            bullets[0].position.y = bird.position.y * size;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        } else if (bullets[0].position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
            // bullets di ra khoi man hinh ben duoi;
            bullets[0].position.x = bird.position.x * scale;
            bullets[0].position.y = bird.position.y * scale;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        } else if (bullets[0].position.y < 0) {
            // bullets di ra khoi man hinh ben tren;
            bullets[0].position.x = bird.position.x * scale;
            bullets[0].position.y = bird.position.y * scale;
            bulletxSpeed = 0;
            bulletySpeed = 0;
        }

        if (bulletxSpeed == 0 && bulletySpeed == 0) {
            // dua bullet di cung vi tri voi bird
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
            // dua bullet ve vi tri Bird.
            bullets[1].position.x = bird.position.x * scale;
            bullets[1].position.y = bird.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        } else if (bullets[1].position.x < 0) {
            // bullets di ra khoi man hinh ben trai;
            // dua bullet ve vi tri Bird.
            bullets[1].position.x = bird.position.x * scale;
            bullets[1].position.y = bird.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        } else if (bullets[1].position.y >= Constants.MAX_HEIGHT / Constants.BULLET_SIZE) {
            // bullets di ra khoi man hinh ben duoi;
            // dua bullet ve vi tri Bird.
            bullets[1].position.x = bird.position.x * scale;
            bullets[1].position.y = bird.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        } else if (bullets[1].position.y < 0) {
            // bullets di ra khoi man hinh ben tren;
            // dua bullet ve vi tri Bird.
            bullets[1].position.x = bird.position.x * scale;
            bullets[1].position.y = bird.position.y * scale;
            bulletxSpeed1 = 0;
            bulletySpeed1 = 0;
        }

        if (bulletxSpeed1 == 0 && bulletySpeed1 == 0) {
            // dua bullet di cung vi tri voi bird
            bullets[1].position.x += xBspeed;
            bullets[1].position.y += yBspeed;
        } else {
            // bullet di chuyen khi duoc ban
            bullets[1].position.x += bulletxSpeed1;
            bullets[1].position.y += bulletySpeed1;
        }

        bird.position.x += xspeed;
        bird.position.y += yspeed;
        // enemy.position.x += 0.1;
        // enemy.position.y += 0.1;

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
            bird.position.x * bird.size,
            bird.position.y * bird.size,
            bird.size,
            bird.size
        );

        // game over
        if (birdRectangle.testCollision(enemyRectangle)) {
            dispatch({ type: 'game-over', data: { message: 'day la data' } });
            bird.position.x = Constants.MAX_WIDTH / Constants.GRID_SIZE / 2;
            bird.position.y = Constants.MAX_HEIGHT / Constants.GRID_SIZE / 2;
            bird.rotate = '0deg';

            bullets[0].position.x = bird.position.x * scale;
            bullets[0].position.y = bird.position.y * scale;
            bullets[1].position.x = bird.position.x * scale;
            bullets[1].position.y = bird.position.y * scale;
            bulletxSpeed = 0; bulletySpeed = 0;
            bulletxSpeed1 = 0; bulletySpeed1 = 0;
            changeEnemy(enemy, true);
        }

        if (bulletxSpeed != 0 || bulletySpeed != 0) {
            // neu dan duoc ban thi thuc hien check va cham
            if (bulletRectangle.testCollision(enemyRectangle)) {
                // ban trung muc tieu
                bullets[0].position.x = bird.position.x * scale;
                bullets[0].position.y = bird.position.y * scale;
                bulletxSpeed = 0; bulletySpeed = 0;
                changeEnemy(enemy);
                console.log('va cham bullet');
            }
        }
        if (bulletxSpeed1 != 0 || bulletySpeed1 != 0) {
            // neu dan duoc ban thi thuc hien check va cham
            if (bulletRectangle1.testCollision(enemyRectangle)) {
                // ban trung muc tieu
                bullets[1].position.x = bird.position.x * scale;
                bullets[1].position.y = bird.position.y * scale;
                bulletxSpeed1 = 0; bulletySpeed1 = 0;
                changeEnemy(enemy);
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
        enemy.position.x = Constants.randomEnemy(0, Constants.MAX_WIDTH / Constants.ENEMY_SIZE);
        enemy.position.y = Constants.randomEnemy(0, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE);
        return;
    }
    enemy.isLiving = false;
    setTimeout(() => {
        enemy.position.x = Constants.randomEnemy(0, Constants.MAX_WIDTH / Constants.ENEMY_SIZE);
        enemy.position.y = Constants.randomEnemy(0, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE);
        enemy.isLiving = true;
    }, 250);
}