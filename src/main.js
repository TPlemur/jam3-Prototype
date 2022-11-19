//config for the phaser game
const screenWidth = 1920;
const screenHeight = 1080;

let config= {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,  
    
    //keeps aspect ratio to 16:9 (1920x1080)
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Play],
}

//define game object
let game = new Phaser.Game(config);