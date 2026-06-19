const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var pigs = [];
var backgroundImg, platform;
var bird, slingShot;

var pigs_count = 2;
var birds = 3;
var launched = false;
var out = false;

var gameState = "play";

function preload() {
    backgroundImg = loadImage("../sprites/bg.png");
}

function setup() {
    var canvas = createCanvas(windowWidth - 4, windowHeight - 4);
    engine = Engine.create();
    world = engine.world;

    ground = new Ground(900, windowHeight, windowWidth + 200, 20);
    platform = new Ground(150, windowHeight - 95, 300, 170);

    box1 = new Box(windowWidth - 400, windowHeight - 40, 70, 70);
    box2 = new Box(windowWidth - 600, windowHeight - 40, 70, 70);
    log1 = new Log(windowWidth - 500, windowHeight - 80, 300, PI / 2);

    box3 = new Box(windowWidth - 400, windowHeight - 100, 70, 70);
    box4 = new Box(windowWidth - 600, windowHeight - 100, 70, 70);

    var fix_y = 40;
    for (var i = 0; i < pigs_count; i++) {
        pigs[i] = new Pig(windowWidth - 500, windowHeight - fix_y);
        fix_y += 60;
    }

    log3 =  new Log(windowWidth - 500, windowHeight - 180, 300, PI / 2);

    box5 = new Box(windowWidth - 500, windowHeight - 220, 70, 70);
    log4 = new Log(windowWidth - 550, windowHeight - 260, 150, PI / 7);
    log5 = new Log(windowWidth - 450, windowHeight - 260, 150, -PI / 7);

    bird = new Bird(200, windowHeight - 340);
    bird_text = new Bird(45, 57);

    game_over = new Screen(-2000, -2000, windowWidth, windowHeight, "../sprites/gameover.png");
    winscreen = new Screen(-2000, -2000, windowWidth, windowHeight, "../sprites/youwin.png");

    slingShot = new SlingShot(bird.body, { x: 200, y: windowHeight - 340 });
}

function draw() {
    // Game Over
    if (birds <= 0 && pigs.length > 0) {
        setTimeout(() => {      
            Matter.Body.setPosition(game_over.body, {x: windowWidth / 2, y: windowHeight / 2});
            game_over.display();
        }, 1000);

        gameState = "end";
    }

    if (birds >= 0 && pigs.length == 0) {
        setTimeout(() => {
            Matter.Body.setPosition(winscreen.body, {x: windowWidth / 2, y: windowHeight / 2});
            winscreen.display();
        }, 1000);

        gameState = "end";
    }

    if (gameState == "play") {
        image(backgroundImg, 0, 0, windowWidth, windowHeight);
        Engine.update(engine);
            
        box1.display();
        box2.display();
        ground.display();
        log1.display();

        for (let i = pigs.length - 1; i >= 0; i--) {
            pigs[i].display();
        }

        box3.display();
        box4.display();
        log3.display();

        box5.display();
        log4.display();
        log5.display();

        bird.display();
        platform.display();
        slingShot.display();

        bird_text.display();
        Matter.Body.setStatic(bird_text.body, true);
        textSize(20);
        fill("black");
        text(max(0, birds - 1), 45, 100);

        if ((bird.body.speed < 0.3 || bird.body.position.x >= windowWidth || bird.body.position.x <= 0 || bird.body.position.y <= 0) && launched && !out) {
            out = true;
            setTimeout(() => {
                Matter.Body.setVelocity(bird.body, { x: 0, y: 0 });
                Matter.Body.setPosition(bird.body, { x: 200, y: windowHeight - 340 });

                slingShot.attach(bird.body);
                launched = false;
                out = false;
            }, 1000);
        }

        for (let i = 0; i < pigs.length; i++) {
            if (pigs[i].body.speed > 3) {
                pigs.splice(i, 1);
            }
        }
    }
}

function mouseDragged() {
    if (launched) return;

    const slingX = 200;
    const slingY = windowHeight - 340;
    const maxPull = 180;
        
    var dx = mouseX - slingX;
    var dy = mouseY - slingY;

    var distance = sqrt(dx * dx + dy * dy);

    if (distance > maxPull) {
        var angle = atan2(dy, dx);
        Matter.Body.setPosition(bird.body, {x: slingX + cos(angle) * maxPull, y: slingY + sin(angle) * maxPull });
    } else {
       Matter.Body.setPosition(bird.body, {x: mouseX, y: mouseY });
    }
}

function mouseReleased() {
    slingShot.fly();
    launched = true;
}