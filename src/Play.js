//Menu.js

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class Play extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload(){
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.image('launchButton', './assets/Launch.png');

    }
    create(){
        var elementOps = ['fire', 'water', 'earth'];
        var secondOps = ['beam','shield'];
        var thirdOps = ['buffAtk','buffDef'];

        //tracked things
        this.theMon = new monster;



        this.theMon.randomize()

        this.firstWiz = CreateDropDownList(this, screenWidth/4, 800, elementOps).layout().setScale(4);
        this.secondWiz = CreateDropDownList(this, 2*screenWidth/4,800, secondOps).layout().setScale(4);
        this.thirdWiz = CreateDropDownList(this,3*screenWidth/4,800,thirdOps).layout().setScale(4);
        this.monText = CreateTextObject(this,this.theMon.position + ' ' + this.theMon.element).setScale(4);
        this.monText.x = screenWidth/2 - 400;
        this.monText.y = 100;
        
        this.launchBtn = this.add.sprite(screenWidth/2, screenHeight-100, 'launchButton').setInteractive().setScale(0.4); //Initialize the button
        this.launchBtn.on('pointerdown', ()=>onPress(this.firstWiz,this.secondWiz,this.thirdWiz,this.theMon));   
    }

    update(){
        this.monText.text = this.theMon.position + ' ' + this.theMon.element;
    }
}

function onPress(eWiz,sWiz,bWiz,mon){
    var monBoost = 1;
    var playerBoost = 1;
    var playeratk = 0;
    var playerdef = 0;
    var monatk = 0;
    var mondef = 0;


    if(sWiz.children[2].text == 'beam'){playeratk = 5;}
    else{playerdef = 5;}
    if(mon.position == 'offensive'){monatk = 6;}
    else{mondef=5}
    if(     mon.buff == 'buffAtk'){playeratk +=1}
    else if(mon.buff == 'buffDef'){playerdef +=1}
    else{console.log('no buff')}
    mon.buff = bWiz.children[2].text;


    if(eWiz.children[2].text == mon.element){
        //do nothing
    }
    else if(eWiz.children[2].text == 'water' && mon.element == 'earth' || 
            eWiz.children[2].text == 'fire'  && mon.element == 'water' || 
            eWiz.children[2].text == 'earth' && mon.element == 'fire'  ){
                monBoost += 1;
    }
    else if(eWiz.children[2].text == 'earth' && mon.element == 'water' || 
            eWiz.children[2].text == 'water'  && mon.element == 'fire' || 
            eWiz.children[2].text == 'fire' && mon.element == 'earth'  ){
                playerBoost +=1;
    }
    else{
        console.log('error');
    }

    playeratk *= playerBoost;
    playerdef *= playerBoost;
    monatk *= monBoost;
    mondef *= monBoost;
    mondam = playeratk - mondef;
    playerdam = monatk - playerdef;
    if(mondam < 0){mondam = 0;}
    if(playerdam < 0){playerdam = 0;}

    console.log("player damage: " + playerdam)
    console.log("monster damage: " + mondam)
    mon.randomize();
}

class monster{
    elementOps = ['fire', 'water', 'earth'];
    monPos = ['offensive','defensive'];
    position = 'offensive';
    element = 'fire';
    prevBuff= 'none';
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
      }
    randomize(){
        this.position = this.monPos[Math.floor(Math.random() * 2)];
        this.element = this.elementOps[Math.floor(Math.random() * 3)];
    }
}

var CreateDropDownList = function (scene, x, y, options) {
    var maxTextSize = GetMaxTextObjectSize(scene, options);

    var label = scene.rexUI.add.label({
        x: x, y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),

        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_LIGHT),

        text: CreateTextObject(scene, '')
            .setFixedSize(maxTextSize.width, maxTextSize.height),

        // action:

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10
        }
    })
        .setData('value', '');

    label.data.events.on('changedata-value', function (parent, value, previousValue) {
        label.text = value;
    })
    if (options[0]) {
        label.setData('value', options[0])
    }

    var menu;
    scene.rexUI.add.click(label)
        .on('click', function () {
            if (!menu) {
                var menuX = label.getElement('text').getTopLeft().x,
                    menuY = label.bottom;
                menu = CreatePopupList(scene, menuX, menuY, options, function (button) {
                    label.setData('value', button.text);
                    menu.collapse();
                    menu = undefined;
                });
            } else {
                menu.collapse();
                menu = undefined;
            }
        })
    return label;
}

var CreatePopupList = function (scene, x, y, options, onClick) {
    var items = options.map(function (option) { return { label: option } });
    var menu = scene.rexUI.add.menu({
        x: x,
        y: y,
        orientation: 'y',

        items: items,
        createButtonCallback: function (item, i, options) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_DARK),

                text: CreateTextObject(scene, item.label),

                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10
                }
            })
        },

        // easeIn: 500,
        easeIn: {
            duration: 500,
            orientation: 'y'
        },

        // easeOut: 100,
        easeOut: {
            duration: 100,
            orientation: 'y'
        }

        // expandEvent: 'button.over'
    });

    menu
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        })
        .on('button.click', function (button) {
            onClick(button);
        })

    return menu;
}

var GetMaxTextObjectSize = function (scene, contentArray) {
    var textObject = CreateTextObject(scene, '');
    var width = 0, height = 0;
    for (var i = 0, cnt = contentArray.length; i < cnt; i++) {
        textObject.text = contentArray[i];
        width = Math.max(textObject.width, width);
        height = Math.max(textObject.height, height);
    }
    textObject.destroy();

    return { width: width, height: height };
}

var CreateTextObject = function (scene, text) {
    var textObject = scene.add.text(0, 0, text, {
        fontSize: '20px'
    })
    return textObject;
}
