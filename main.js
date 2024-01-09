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
const settingsBtn = document.querySelector('.settings-btn')
const closeBtn = document.querySelector('.close-btn')
const animalBtns = document.querySelectorAll('.animal-btn')
const backgroundBtns = document.querySelectorAll('.background-btn')
const background = document.querySelector('.background')
const forest = document.querySelector('.forest')
const cave = document.querySelector('.cave')
const iceland = document.querySelector('.iceland')

class Game {
	posX = 30
	posY = 240
	gravity = 1.5
	score = 0

	animalHeight = 50
	animalWidth = 50

	pipes = []
	pipeWidth = 47
	pipeHeight = 382
	pipesGap = 135
	pipeTopImg = getComputedStyle(pipeTop).backgroundImage
	pipeBottomImg = getComputedStyle(pipeBottom).backgroundImage

	gameFieldWidth = gameField.offsetWidth
	gameFieldHeight = gameField.offsetHeight

	init = () => {
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

	updateGame = () => {
		this.addGravity()
		this.checkCollision()
		this.render()
	}

	addGravity = () => {
		this.posY += this.gravity
	}

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
		const animalW = this.animalHeight
		const animalH = this.animalWidth

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

	restart = () => {
		this.posX = 30
		this.posY = 240
		this.score = 0
		scoreElement.textContent = '0'

		this.pipes = []
		this.pipesGap = 135

		this.addPipe()
	}

	render = () => {
		this.drawPipes()
		animal.style.top = this.posY + 'px'
	}
	drawPipes = () => {
		pipesDiv.innerHTML = ''

		const pipesToDraw = [...this.pipes]

		pipesToDraw.forEach(pipe => {
			const createNewPipeTop = document.createElement('div')
			const createNewPipeBottom = document.createElement('div')

			createNewPipeTop.classList.add('top')
			createNewPipeBottom.classList.add('bottom')

			createNewPipeTop.style.top = pipe.top.y + 'px'
			createNewPipeTop.style.height = pipe.top.height + 'px'
			createNewPipeTop.style.backgroundImage = getComputedStyle(pipeTop).backgroundImage

			createNewPipeBottom.style.top = pipe.bottom.y + 'px'
			createNewPipeBottom.style.height = pipe.bottom.height + 'px'
			createNewPipeBottom.style.backgroundImage = getComputedStyle(pipeBottom).backgroundImage

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

	moveUp = () => {
		this.posY -= 30
	}
}

const showSettings = () => {
	if (!(settings.style.display === 'flex')) {
		settings.style.display = 'flex'
		settings.classList.add('settings-show')
		settings.classList.remove('settings-close')
	}
}
const closeSettings = () => {
	if (!(settings.style.display === 'none')) {
		settings.style.display = 'none'
		settings.classList.add('settings-close')
		settings.classList.remove('settings-show')
	}
}

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
const selectBackground = e => {
	if (e.target.matches('.background-btn')) {
		backgroundBtns.forEach(btn => btn.classList.remove('active-background'))
		e.target.classList.add('active-background')
		if (e.target.matches('.forest')) {
			background.style.backgroundImage = `url(/images/bg/bg1.png)`
			pipeBottom.style.backgroundImage = `url(/images/pipe1.png)`
			pipeTop.style.backgroundImage = `url(/images/pipe1.png)`
		} else if (e.target.matches('.cave')) {
			background.style.backgroundImage = `url(/images/bg/bg2.png)`
			pipeBottom.style.backgroundImage = `url(/images/pipeBottom.png)`
			pipeTop.style.backgroundImage = `url(/images/pipeBottom.png)`
		} else if (e.target.matches('.iceland')) {
			background.style.backgroundImage = `url(/images/bg/bg3.png)`
			pipeBottom.style.backgroundImage = `url(/images/pipe3.png)`
			pipeTop.style.backgroundImage = `url(/images/pipe3.png)`
		}
	}
}

backgroundBtns.forEach(btn => btn.addEventListener('click', selectBackground))
animalBtns.forEach(btn => btn.addEventListener('click', selectAnimal))
settingsBtn.addEventListener('click', showSettings)
closeBtn.addEventListener('click', closeSettings)

const game = new Game()
