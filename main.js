
function test_generateObstacles(parent) {
    num_obstacles = 3;
    width = 50;
    height = 100;
    obstacle_pos = [
        {top: 200, left: 200},
        {top: 400, left: 800},
        {top: 150, left: 800}
    ];
    color = "purple";
    position = "absolute";

    generatedObstacles = [];
    for (i = 0; i < num_obstacles; i++) {
        generatedObstacles[i] = document.createElement('div');
        generatedObstacles[i].id = "wall-" + (i + 1);
        generatedObstacles[i].style.width = width;
        generatedObstacles[i].style.height = height;
        generatedObstacles[i].style.top = obstacle_pos[i].top;
        generatedObstacles[i].style.left = obstacle_pos[i].left;
        generatedObstacles[i].style.backgroundColor = color;
        generatedObstacles[i].style.position = position;

        parent.appendChild(generatedObstacles[i]);
    }
}

function detectCollision(obj1, obj2) {
    const a = obj1.getBoundingClientRect();
    const b = obj2.getBoundingClientRect();
    
    collision = a.left <= b.right && 
                a.right >= b.left &&
                a.top <= b.bottom &&
                a.bottom >= b.top;

    /* *** */
    if (collision) {
        obj2.style.backgroundColor = "yellow";
    } else {
        obj2.style.backgroundColor = "purple";
    }
    /* *** */

    data = {
        dir: '',
        xy: 0,
    }


    if (collision) {
        if (state.player.vX > 0) {
            data.dir = 'left';
            data.xy = b.left - (1 + a.width); 
        } else if (state.player.vX < 0) {
            data.dir = 'right';
            data.xy = b.right + 1;
        } else if (state.player.vY > 0) {
            data.dir = 'top';
            data.xy = b.top - a.height - b.height - 1;
        } else if (state.player.vY < 0) {
            data.dir = 'bottom';
            data.xy = b.bottom - b.height + 1;
        }
    } else {
        data = false;
    }

    return data;
}

function keydown(e) {
    var key = keyMap[e.keyCode];
    keyPress[key] = true;
}

function keyup(e) {
    var key = keyMap[e.keyCode];
    keyPress[key] = false;
}

/* **************************************** */

var wWidth = window.innerWidth;
var wHeight = window.innerHeight;
var playAreaHeight = wHeight - 100; // wHeight - hud.height

var state = {
    player: {
        x: wWidth / 2,
        y: playAreaHeight / 2,
        w: 20,
        h: 20,
        vX: 0,
        vY: 0,
        vMax: 20,
        aX: 0,
        aY: 0
    },
    friction: 0.7,
}

var keyPress = {
    left: false,
    right: false,
    up: false,
    down: false,
    escape: false,
}

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down',
    27: 'escape',
}

/* **************************************** */

var hud = document.getElementById('hud');
hud.style.height = 100;
hud.style.width = wWidth;
hud.style.top = 0;

    var pXY = document.getElementById('pXY');
    pXY.innerHTML = "X: " + state.player.x + ", Y: " + state.player.y;
    var pAX = document.getElementById('pAX');
    pAX.innerHTML = "aX: " + state.player.aX;
    var pAY = document.getElementById('pAY');
    pAY.innerHTML = "aY: " + state.player.aY;
    var pV = document.getElementById('pV');
    pV.innerHTML = "vX: " + state.player.vX + ", vY: " + state.player.vY;

var playArea = document.getElementById('play-area');
playArea.style.height = playAreaHeight;
playArea.style.width = wWidth;
playArea.style.top = hud.style.height;
console.log("hud height", hud.style.height);

var player = document.getElementById('player');
player.style.height = state.player.h;
player.style.width = state.player.w;
player.style.left = state.player.x;
player.style.top = state.player.y;

/* var testWall = document.getElementById('test-wall');
testWall.style.height = 100;
testWall.style.width = 50;
testWall.style.top = playAreaHeight / 2 - 50;
testWall.style.left = wWidth / 2 + 200; */

var gameover = document.getElementById('gameover');
gameover.style.top = (playAreaHeight / 2) - 50;

/* **************************************** */

document.addEventListener("keydown", keydown, false);
document.addEventListener("keyup", keyup, false);

/* **************************************** */

function update(delta) {

    state.player.aX = 0;
    state.player.aY = 0;

    //const collision = detectCollision(player, testWall);
    collision = false;
    //testing... we know there are 3 obstacles
    for (i = 0; i < 3; i++) {
        obstacle = document.getElementById('wall-' + (i + 1));
        
        collision = detectCollision(player, obstacle);
        if (collision) {
            break;
        }
    }

    if (keyPress.right) {
        state.player.aX = .1;
        state.player.vX += (state.player.aX * delta) - state.friction;
    } else if (keyPress.left) {
        state.player.aX = -.1;
        state.player.vX += (state.player.aX * delta) + state.friction;
    }
    if (keyPress.up) {
        state.player.aY = -.1;
        state.player.vY += (state.player.aY * delta) + state.friction;
    } else if (keyPress.down) {
        state.player.aY = .1;
        state.player.vY += (state.player.aY * delta) - state.friction;
    }

    if (state.player.vX > 0) {
        state.player.vX += ( (state.player.aX * delta) - state.friction );
    } else if (state.player.vX < 0) {
        state.player.vX += ( (state.player.aX * delta) + state.friction );
    }
    if (Math.floor(state.player.vX) == 0 || Math.ceil(state.player.vX) == 0) {
        state.player.vX = 0;
    }

    if (state.player.vY > 0) {
        state.player.vY += ( (state.player.aY * delta) - state.friction );
    } else if (state.player.vY < 0) {
        state.player.vY += ( (state.player.aY * delta) + state.friction );
    }
    if (Math.floor(state.player.vY) == 0 || Math.ceil(state.player.vY) == 0) {
        state.player.vY = 0;
    }

    if (state.player.vX > state.player.vMax) {
        state.player.vX = state.player.vMax;
    }
    if (state.player.vX < -state.player.vMax) {
        state.player.vX = -state.player.vMax;
    }
    if (state.player.vY > state.player.vMax) {
        state.player.vY = state.player.vMax;
    }
    if (state.player.vY < -state.player.vMax) {
        state.player.vY = -state.player.vMax;
    }

    if (collision.dir === 'left' || collision.dir === 'right') {
        state.player.vX = 0;
        state.player.x = collision.xy;
    }
    if (collision.dir === 'top' || collision.dir === 'bottom') {
        state.player.vY = 0;
        state.player.y = collision.xy;
    }

    state.player.x += state.player.vX;
    state.player.y += state.player.vY;

    if (state.player.x > wWidth) {
        state.player.x = 0;
    } else if (state.player.x < 0) {
        state.player.x = wWidth - 1;
    }

    if (state.player.y > playAreaHeight) {
        state.player.y = 0;
    } else if (state.player.y < 0) {
        state.player.y = playAreaHeight;
    }

}

function draw() {

    player.style.left = state.player.x;
    player.style.top = state.player.y;

    pXY.innerHTML = "X: " + state.player.x.toFixed(2) + ", Y: " + state.player.y.toFixed(2);
    pAX.innerHTML = "aX: " + state.player.aX.toFixed(2);
    pAY.innerHTML = "aY: " + state.player.aY.toFixed(2);
    pV.innerHTML = "vX: " + state.player.vX.toFixed(2) + ", vY: " + state.player.vY.toFixed(2);

    if (keyPress.escape) {
        gameover.style.display = "block";
    }
}

function loop(timestamp) {

    var delta = timestamp - lastRender;

    update(delta);
    draw();

    if (!keyPress.escape) {

        lastRender = timestamp;
        window.requestAnimationFrame(loop);

    }
}

test_generateObstacles(playArea);

var lastRender = 0;
window.requestAnimationFrame(loop);
