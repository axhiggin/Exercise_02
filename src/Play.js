class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
        this.score = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        this.score = 0
        //add score tracker
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
          }
        this.scoreText = this.add.text(width*8/10, height/10, this.score, scoreConfig)
        this.scoreText.setDepth(100)

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4) //uses default y same as x
        this.cup.body.setImmovable(true)


        this.ball = this.physics.add.sprite(width/2, height*9/10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        //add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.setPushable(true)
        wallA.setCollideWorldBounds(true)
        wallA.setBounce(1)
        wallA.setVelocityX(100)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        //one way obstacle
        this.oneWay = this.physics.add.sprite(0, height*3/4, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        //valocity variables
        this.shotVelocityXMin = 700
        this.shotVelocityXMax = 1100
        this.shotVelocityYMin = 700
        this.shotVelocityYMax = 1100

        this.input.on('pointerdown', (pointer) => {
            let shotDirectionY
            let shotDirectionX
            pointer.y <= this.ball.y ? shotDirectionY = 1 : shotDirectionY = -1
            pointer.x <= this.ball.x ? shotDirectionX = 1 : shotDirectionX = -1
            this.ball.body.setVelocityX(shotDirectionX * Phaser.Math.Between(this.shotVelocityXMin, this.shotVelocityXMax))
            this.ball.body.setVelocityY(shotDirectionY * Phaser.Math.Between(this.shotVelocityYMin, this.shotVelocityYMax))
        })

        //callback function (a function you call when a certain event happens) automatically adds this.ball and this.cup as parameters
        this.physics.add.collider(this.ball, this.cup, (ball, cup, score) => {
            score += 1
            ball.setX(width/2)
            ball.setY(height*9/10)
            ball.setVelocityX(0)
            ball.setVelocityY(0)
        })

        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
        
    }

    update() {
        
    }
}