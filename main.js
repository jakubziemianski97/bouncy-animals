window.onload = () => {
	game.init()
}

const animal = document.querySelector('.animal')
const gameField = document.querySelector('.game-field')
const pipeBottom = document.querySelector('.bottom')
const pipeTop = document.querySelector('.top')
const scoreElement = document.querySelector('.score')
class Game {
	posX = 30
	posY = 240
	gravity = 1.5
	score = 0

	pipes = []
	pipeTopImg = getComputedStyle(pipeTop).backgroundImage
	pipeBottomImg = getComputedStyle(pipeBottom).backgroundImage
	pipeTopY = 0
	pipeTopX = 0
	pipeBottomY = 0
	pipeBottomX = 0
	pipeWidth = 47
	pipeHeight = 382
	pipesGap = 120

	gameFieldWidth = gameField.offsetWidth
	gameFieldHeight = gameField.offsetHeight

	init = () => {
		// this.canvas = document.getElementById('canvas')
		// this.context = this.canvas.getContext('2d')

		document.addEventListener('click', this.moveUp)
		document.addEventListener('keydown', e => {
			if (e.key == ' ') {
				this.moveUp()
			}
		})
		this.startGame()
	}

	startGame = () => {
		const fps = 60
		setInterval(this.updateGame, 1000 / fps)

		this.addPipe()
	}

	addPipe = () => {
		let x = this.gameFieldWidth
		let y = Math.floor(Math.random() * this.pipeWidth) - this.pipeHeight

		this.pipes.push({
			top: {
				x: x,
				y: y,
				width: this.pipeWidth,
				height: this.pipeHeight,
			},
			bottom: {
				x: x,
				y: y + this.pipeHeight + this.pipesGap,
				width: this.pipeWidth,
				height: this.pipeHeight,
			},
		})
	}

	updateGame = () => {
		// Logika gry
		this.addGravity()
		this.render()
	}

	addGravity = () => {
		this.posY += this.gravity
	}

	render = () => {
		// this.drawPipes()
		animal.style.top = this.posY + 'px'
		pipeTop.style.top = this.pipeTopY + 'px'
		pipeTop.style.right = this.pipeTopX + 'px'
		pipeBottom.style.bottom = this.pipeBottomY + 'px'
		pipeBottom.style.right = this.pipeBottomX + 'px'
	}
	// drawPipes = () => {
	// 	const pipesToDraw = [...this.pipes]
	// 	drawPipe(pipeTopImg, pipeTopX, pipeTopY)

	// 	this.pipeTopX--
	// }

	moveUp = () => {
		this.posY -= 30
	}
}

const game = new Game()
