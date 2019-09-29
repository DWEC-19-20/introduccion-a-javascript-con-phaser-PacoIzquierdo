// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 100;

var venenos;
var vidas = 3;
var pierdes = false;

var estrella;


// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  venenos = game.add.physicsGroup();
  estrella = game.add.physicsGroup();
    //coins
    for(var c = 0 ; c < 4 ; c++)createItem(Math.random() * 800, Math.random() * 600, 'coin');
    
    //poison
    var z = Math.random() * 10;
    for(var c = 0 ; c < z ; c++)createPoison(Math.random() * 800, Math.random() * 600, 'poison');
    
    //estrella
    for(var c = 0 ; c < z - 2 ; c++)createStar(Math.random() * 800, Math.random() * 600, 'star');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(150, 225, 'platform');
  platforms.create(450, 225, 'platform1');
  platforms.create(150, 460, 'platform1');
  platforms.create(450, 460, 'platform');
  platforms.create(400, 300, 'platform1');
    
  platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(150, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  currentScore = currentScore + 25;
  if (currentScore === winningScore) {
      createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

//veneno
function createPoison(left, top, image) {
    var v1 = venenos.create(left, top, image);
    v1.animations.add('spin');
    v1.animations.play('spin', 5, true);
}

function poisonHandler(player, venenos) {
    if(!won) {
        venenos.kill();
        vidas = vidas - 1;
        if (vidas == 0) {
            player.kill();
            pierdes = true;
        }
    }
}

//estrellas

function createStar(left, top, image) {
    var s1 = estrella.create(left, top, image);
    s1.animations.add('spin');
    s1.animations.play('spin', 5, true);
}

function starHandler(player, estrella) {
    estrella.kill();
    vidas = vidas + 1;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#5db1ad';
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform1', 'platform_2.png');
    
    //Load spritesheets
    //game.load.spritesheet('player', 'chalkers.png', 48, 62);
    game.load.spritesheet('player', 'mikethefrog.png', 32, 32);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    textstar = game.add.text(650, 16, "★ ", { font: "bold 24px Arial", fill: "yellow" });
    text2 = game.add.text(680, 16, "Vidas: " + vidas, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    text2.text = "Vidas: " + vidas;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, venenos, poisonHandler);
    game.physics.arcade.overlap(player, estrella, starHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!\nSCORE: "+currentScore;
    }
      
    if(pierdes){
        winningMessage.text = "Has perdido...\nSCORE: "+currentScore;
    }
 
  }

  function render() {

  }

};
