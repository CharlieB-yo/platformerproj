class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 350;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.SCALE = 2.5;
        this.snowmenCount = 0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        //this.map = this.add.tilemap("level", 18, 18, 45, 80);
        this.map = this.add.tilemap("level", 6, 6, 135, 240);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("platformer_tiles", "tilemap_tiles");
        this.backTileset = this.map.addTilesetImage("tilemap-backgrounds", "backTilemap_tiles");

        // Create a layer
        this.backLayer = this.map.createLayer("background", this.backTileset, 0, 0);
        this.groundLayer = this.map.createLayer("Stage", this.tileset, 0, 0);
        this.snowLayer = this.map.createLayer("Snow", this.tileset, 0, 0);
        

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.snowmen = this.map.createFromObjects("objects", {
            name: "snowman",
            key: "tilemap_sheet",
            frame: 145
        });

        this.flag = this.map.createFromObjects("objects", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 111
        });

        this.flagpole = this.map.createFromObjects("objects", {
            name: "flagpole",
            key: "tilemap_sheet",
            frame: 131
        });


        // TODO: Add turn into Arcade Physics here
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.snowmen, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.snowmanGroup = this.add.group(this.snowmen);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 450, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // TODO: Add coin collision handler
        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.snowmanGroup, (obj1, obj2) => {
            this.snowmenCount += 1;
            this.sound.play("collect");
            obj2.destroy(); // remove coin on overlap
        });

        this.physics.add.overlap(my.sprite.player, this.flag, (obj1, obj2) => {
            this.registry.set('snowmenCount', this.snowmenCount);
            this.scene.restart();
            this.scene.start("End");
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: {start: 0.03, end: 0.06},
            lifespan: 200,
            alpha: {start: 1, end: 0.5},
            frequency: 150,
        });

        my.vfx.walking.stop();

        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {
            frame: ['light_01.png', 'light_02.png'],
            scale: {start: 0.04, end: 0.08},
            lifespan: 200,
            alpha: {start: 1, end: 0.5},
        });

        my.vfx.jump.stop();

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(100, 100);
        this.cameras.main.setZoom(this.SCALE);

        this.physics.world.drawDebug = false;
        my.sprite.player.body.setMaxVelocity(250, 600);

    }

    update() {
        if(my.sprite.player.body.y > 800){
            this.scene.restart();
        }

        if(cursors.left.isDown) {
            if(my.sprite.player.body.velocity.x < 0){
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
            }else{
                my.sprite.player.setAccelerationX(-this.ACCELERATION - this.DRAG);
            }
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(0, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            if(my.sprite.player.body.velocity.x > 0){
                my.sprite.player.setAccelerationX(this.ACCELERATION);
            }else{
                my.sprite.player.setAccelerationX(this.ACCELERATION + this.DRAG);
            }
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(0, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.walking.stop();
            my.vfx.jump.stop();
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jump.start();
            my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}