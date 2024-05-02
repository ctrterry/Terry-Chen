const screens = document.querySelectorAll('.screen');
const choose_insect_btns = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn')
const game_container = document.getElementById('game-container')
const timeEl = document.getElementById('time')
const scoreEl = document.getElementById('score')
const message = document.getElementById('message')


const endingContainer = document.getElementById('ending-container');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const restart_container = document.getElementById('restart-Container');

// Initialize variables to store game state
let seconds = 0
let score = 0
let selected_insect = {}
// Add a click event listener to the start button that triggers when clicked
start_btn.addEventListener('click', () => screens[0].classList.add('up'))

// Add click event listeners to each 'choose insect' button
choose_insect_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        selected_insect = { src, alt }
        screens[1].classList.add('up')
        setTimeout(createInsect, 1000)
        startGame()
    })
})

// Start the game by calling the startGame function
function startGame() {
    setInterval(increaseTime, 1000)
}

// Increase the time elapsed in the game
function increaseTime() {
    let m = Math.floor(seconds / 60)
    let s = seconds % 60
    m = m < 10 ? `0${m}` : m
    s = s < 10 ? `0${s}` : s
    timeEl.innerHTML = `Time: ${m}:${s}`
    seconds++
}

// Create a new insect and add it to the game container
function createInsect() {
    const insect = document.createElement('div')
    insect.classList.add('insect')
    const { x, y } = getRandomLocation()
    insect.style.top = `${y}px`
    insect.style.left = `${x}px`
    insect.innerHTML = `<img src="${selected_insect.src}" alt="${selected_insect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`

    insect.addEventListener('click', catchInsect)

    game_container.appendChild(insect)
}

// Creative a random insect locations
function getRandomLocation() {
    const width = window.innerWidth
    const height = window.innerHeight
    const x = Math.random() * (width - 200) + 100
    const y = Math.random() * (height - 200) + 100
    return { x, y }
}

// Handing when the insect has been clicked or caught.
function catchInsect() {
    increaseScore()
    this.classList.add('caught')
    setTimeout(() => this.remove(), 2000)
    addInsects()
}

// Add more insects to the game.
function addInsects() {
    setTimeout(createInsect, 1000)
    setTimeout(createInsect, 1500)
}

// Increasing the scores, when the click has benn trigger.
function increaseScore() {
    score++
    if(score > 19) {
        message.classList.add('visible')
    }
    scoreEl.innerHTML = `Score: ${score}`
}

// My ending pages.
function showEndingPage() {
    endingContainer.classList.add('up');
    finalScoreEl.textContent = score;
}

// Creative a restartBtn to handling 
restartBtn.addEventListener('click', restartGame);

// reset the game
function restartGame() {
    screens.forEach(screen => screen.classList.remove('up'));
    endingContainer.classList.remove('up');
    seconds = 0;
    score = 0;
    scoreEl.textContent = 'Score: 0';
    timeEl.textContent = 'Time: 00:00';
}

// Modify the increaseScore function to check for the end of the game
function increaseScore() {
    score++;
    if (score > 10) {
        message.classList.add('visible');
    }
    if (score >= 15) {
        // Show the ending page if the score reaches a certain threshold
        message.classList.remove('visible');
        showEndingPage();
    }
    scoreEl.innerHTML = `Score: ${score}`;
}

