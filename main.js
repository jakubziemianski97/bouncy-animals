window.onload = () => {
	game.init()
}

const animal = document.querySelector('.animal')
const gameField = document.querySelector('.game-field')
const pipesDiv = document.querySelector('.pipes')
const pipeBottom = document.querySelector('.bottom')
const pipeTop = document.querySelector('.top')
const scoreElement = document.querySelector('.score')
const settings = document.querySelector('.settings')
const startGameBtn = document.querySelector('.start-btn')
const instruction = document.querySelector('.instruction')
const settingsBtn = document.querySelector('.settings-btn')
const closeBtn = document.querySelector('.close-btn')
const animalBtns = document.querySelectorAll('.animal-btn')
const backgroundBtns = document.querySelectorAll('.background-btn')
const background = document.querySelector('.background')
const forest = document.querySelector('.forest')
const cave = document.querySelector('.cave')
const iceland = document.querySelector('.iceland')
let pipeImg = "url('/images/stumps/woodPipe.png')"

class Game {
	posX = 30
	posY = 240
	initialGravity = 1.0
	gravityIncrement1 = 0.2
	gravityIncrement2 = 0.4
	gravityIncrement3 = 0.8
	maxGravity = 6
	currentGravity = this.initialGravity
	gameStarted = false

	jumpStrength = 18
	jumping = false

	score = 0

	animalHeight = 40
	animalWidth = 40

	pipes = []
	pipeWidth = 47
	pipeHeight = 382
	pipesGap = 155

	gameFieldWidth = gameField.offsetWidth
	gameFieldHeight = gameField.offsetHeight

	// GAME INITIALIZATION
	init = () => {
		document.addEventListener('click', this.moveUp)
		document.addEventListener('keydown', e => {
			if (e.key == ' ') {
				this.moveUp()
			}
		})
		setInterval(this.addGravity, 1000 / 60)
		setInterval(this.increaseGravity, 100)
	}

	// GAME START
	startGame = () => {
		this.gameStarted = true
		const fps = 60
		setInterval(this.updateGame, 1000 / fps)
		this.addPipe()
	}

	// PIPES GENERATION
	addPipe = () => {
		let x = this.gameFieldWidth
		let y = Math.floor(Math.random() * this.pipeHeight) - this.pipeHeight

		this.pipes.push({
			top: {
				x: x,
				y: y,
				width: this.pipeWidth,
				height: this.pipeHeight,
				img: this.pipeTopImg,
			},
			bottom: {
				x: x,
				y: y + this.pipeHeight + this.pipesGap,
				width: this.pipeWidth,
				height: this.pipeHeight,
				img: this.pipeBottomImg,
			},
		})
	}

	// GAME UPDATE
	updateGame = () => {
		this.addGravity()
		this.checkCollision()
		this.render()
	}
	gravityEnabled = true

	// ADDING GRAVITY
	addGravity = () => {
		if (this.gravityEnabled) {
			this.posY += this.currentGravity
		}
	}

	// INCREASING GRAVITY OVER TIME TO MAKE IT LOOK NATURAL
	increaseGravity = () => {
		if (this.currentGravity < 1.5) {
			this.currentGravity += this.gravityIncrement1
		} else if (this.currentGravity <= 2.5) {
			this.currentGravity += this.gravityIncrement2
		} else if (this.currentGravity <= this.maxGravity) {
			this.currentGravity += this.gravityIncrement3
		}
	}

	// CHECKING THE PIPE HIT
	checkCollision = () => {
		if (this.posY > this.gameFieldHeight - this.animalHeight) {
			this.moveUp()
		}

		if (this.posY < 0) {
			this.posY = 0
		}

		const pipesToCheck = [...this.pipes]
		const animalX = this.posX
		const animalY = this.posY
		const animalW = this.animalWidth
		const animalH = this.animalHeight

		// INCREASE IN SCORES
		pipesToCheck.forEach(pipe => {
			if (animalX + animalW > pipe.top.x && animalX <= pipe.top.x + pipe.top.width) {
				if (animalY < pipe.top.y + pipe.top.height || animalY + animalH > pipe.bottom.y) {
					this.restart()
				}
			}
			if (pipe.top.x == -1) {
				this.score++
				scoreElement.textContent = `${this.score}`
				if (this.score % 2 == 0) {
					this.pipesGap--

					if (this.pipesGap < 100) {
						this.pipesGap == 100
					}
				}
			}
		})
	}

	// RESETTING THE GAME AFTER HITTING THE PIPE
	restart = () => {
		this.posX = 30
		this.posY = 240
		this.score = 0
		scoreElement.textContent = '0'

		this.pipes = []
		this.pipesGap = 135
		this.addPipe()

		this.currentGravity = this.initialGravity
	}

	// APPEARANCE OF THE HERO AND PIPES
	render = () => {
		this.drawPipes()
		animal.style.top = this.posY + 'px'
	}

	// GENERATION OF PIPES
	drawPipes = () => {
		pipesDiv.innerHTML = ''

		const pipesToDraw = [...this.pipes]

		pipesToDraw.forEach(pipe => {
			let createNewPipeTop = document.createElement('div')
			let createNewPipeBottom = document.createElement('div')

			createNewPipeTop.classList.add('top')
			createNewPipeBottom.classList.add('bottom')

			createNewPipeTop.style.top = pipe.top.y + 'px'
			createNewPipeTop.style.height = pipe.top.height + 'px'
			createNewPipeTop.style.backgroundImage = pipeImg

			createNewPipeBottom.style.top = pipe.bottom.y + 'px'
			createNewPipeBottom.style.height = pipe.bottom.height + 'px'
			createNewPipeBottom.style.backgroundImage = pipeImg

			pipeTop.style.left = --pipe.top.x + 'px'
			pipeBottom.style.left = --pipe.bottom.x + 'px'

			createNewPipeTop.style.left = pipe.top.x + 'px'
			createNewPipeBottom.style.left = pipe.bottom.x + 'px'

			pipesDiv.appendChild(createNewPipeTop)
			pipesDiv.appendChild(createNewPipeBottom)

			if (pipe.top.x + this.pipeWidth < -100) {
				this.pipes.shift()
			}

			if (pipe.top.x === 150) {
				this.addPipe()
			}
		})
	}

	// HERO JUMP
	moveUp = () => {
		this.currentGravity = this.initialGravity
		if (this.gameStarted && !this.jumping) {
			this.jumping = true
			this.gravityEnabled = false
			this.jump()
		}
	}

	jump = () => {
		let jumpHeight = 0
		const jumpInterval = setInterval(() => {
			this.posY -= this.jumpStrength - jumpHeight
			jumpHeight += 4

			if (jumpHeight >= this.jumpStrength) {
				clearInterval(jumpInterval)
				this.jumping = false
				this.gravityEnabled = true
			}
		}, 16)
	}
}

// OPENING SETTINGS
const showSettings = () => {
	if (!(settings.style.display === 'flex')) {
		settings.style.display = 'flex'
		settings.classList.add('settings-show')
		settings.classList.remove('settings-close')
	}
}

// CLOSING SETTINGS
const closeSettings = () => {
	if (!(settings.style.display === 'none')) {
		settings.style.display = 'none'
		settings.classList.add('settings-close')
		settings.classList.remove('settings-show')
	}
}

// HERO SELECTION
const selectAnimal = e => {
	if (e.target.matches('.animal-btn')) {
		animalBtns.forEach(btn => btn.classList.remove('active-animal'))
		e.target.classList.add('active-animal')
		if (e.target.matches('.dog')) {
			animal.style.backgroundImage = `url(/images/animals/animal1.png)`
		} else if (e.target.matches('.bear')) {
			animal.style.backgroundImage = `url(/images/animals/animal2.png)`
		} else if (e.target.matches('.dino')) {
			animal.style.backgroundImage = `url(/images/animals/animal3.png)`
		}
	}
}

// BACKGROUND SELECTION
const selectBackground = e => {
	if (e.target.matches('.background-btn')) {
		backgroundBtns.forEach(btn => btn.classList.remove('active-background'))
		e.target.classList.add('active-background')
		if (e.target.matches('.forest')) {
			background.style.backgroundImage = `url(/images/bg/bg1.png)`
			pipeImg = `url('/images/stumps/woodPipe.png')`
		} else if (e.target.matches('.cave')) {
			background.style.backgroundImage = `url(/images/bg/bg2.png)`
			pipeImg = `url('/images/stumps/stonePipe.png')`
		} else if (e.target.matches('.iceland')) {
			background.style.backgroundImage = `url(/images/bg/bg3.png)`
			pipeImg = `url('/images/stumps/icePipe.png')`
		}
	}
}

// GAME START
startGameBtn.addEventListener('click', () => {
	game.startGame()
	instruction.style.opacity = '0'
	game.posY = 240
})

// FUNCTION CALL
backgroundBtns.forEach(btn => btn.addEventListener('click', selectBackground))
animalBtns.forEach(btn => btn.addEventListener('click', selectAnimal))
settingsBtn.addEventListener('click', showSettings)
closeBtn.addEventListener('click', closeSettings)

const game = new Game()
