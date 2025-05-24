class End extends Phaser.Scene {
    constructor() {
        super("End");
        this.my = {sprite: {}};
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        this.snowmenCount = this.registry.get('snowmenCount');
        // const scoreText = this.add.text(500, 250, `YOUR SCORE: ${this.score}`, {
        //     fontFamily: 'Roboto',
        //     fontSize: '32px',
        //     align: 'center',
        //     color: '#ffffff'
        // });
        // scoreText.setOrigin(0.5, 0.5);

        WebFont.load({
            google: {
                families: ['Press Start 2P']
            },
            active: () => {
                this.add.text(720, 250, `You got ${this.snowmenCount} of 2 snowmen`, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '32px',
                    align: 'center',
                    color: '#ffffff'
                }).setOrigin(0.5, 0.5);

                const replayButton = this.add.text(720, 450, 'play again', { fontFamily: '"Press Start 2P"', fontSize: '32px', align: 'center', color: '#ffffff'})
                    .setInteractive()
                    .on('pointerdown', () => this.scene.start("platformerScene"));
                replayButton.setOrigin(0.5, 0.5);
            }
        });
//         this.add.text(500, 250, `YOUR SCORE: ${this.score}`, {
//             fontFamily: '"Press Start 2P"',
//             fontSize: '32px',
//             align: 'center',
//             color: '#ffffff'
//         }).setOrigin(0.5, 0.5);
//         this.add.text(500, 350, `HIGH SCORE: ${this.registry.get('highScore')}`, {
//             fontFamily: '"Press Start 2P"',
//             fontSize: '32px',
//             align: 'center',
//             color: '#ffffff'
//         }).setOrigin(0.5, 0.5);
//         const replayButton = this.add.text(500, 450, 'PLAY AGAIN?', { fontFamily: '"Press Start 2P"', fontSize: '32px', align: 'center', color: '#ffffff'})
//             .setInteractive()
//             .on('pointerdown', () => this.scene.start("Level1"));
//         replayButton.setOrigin(0.5, 0.5);
        
    }
}