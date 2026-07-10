const canvas = document.querySelector("canvas");
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score--value");
const menu = document.querySelector("div.menu-screen");
const btnPlay = document.querySelector(".btn-play");
const h1 = document.querySelector("h1");
const ctx = canvas.getContext("2d");

const audio = new Audio('./assets/audio.mp3');

const size = 30;
let gameOn = true;
let direction, loopId;

const incrementScore = () => {
    if(parseInt(score.textContent) < 100){
        score.innerText = parseInt(score.innerText) + 10
    }else{
        score.innerText = parseInt(score.innerText) + 100
    }


}
let snake = [
    { x: 0, y: 0 },
];
const initialPosition = snake[0];
const randomNumber = (min,max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)

    return `rgb(${red}, ${green}, ${blue})`
}
const randomPosition  = () => {
    const number = randomNumber(0,canvas.width - size);
    return Math.round(number / size) * size
}

const food = {
    x: randomPosition(),
    y:randomPosition(),
    color: randomColor()
}
const checkEat = () => {
    const head = snake[snake.length - 1];

    if(head.x == food.x && head.y == food.y) {
        snake.push(head);
        incrementScore()
        audio.play()
       
        let x = randomPosition();
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const drawSnake = () => {
    snake.forEach(({ x, y }, index) => {
        // Corpo
        if (index !== snake.length - 1) {
            ctx.fillStyle = "#ddd";
            ctx.fillRect(x, y, size, size);
            return;
        }

        // Cabeça
        ctx.fillStyle = "white"
        ctx.fillRect(x, y, size, size);

        // Olhos e língua
    });
};
const drawFood = () => {
    const {x,y,color} = food
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 5
    ctx.fillRect(x,y,size,size)
    ctx.shadowBlur = 0
    
}
const moveSnake = () => {
    if (!direction) return
    const head = snake[snake.length - 1];
    snake.shift();

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    else if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    else if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    else if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
}
const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#191919'

    for(let i = 30; i < canvas.width; i += 30 ){
        ctx.beginPath()
        ctx.lineTo(i,0)
        ctx.lineTo(i,600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0,i)
        ctx.lineTo(600,i)
        ctx.stroke()
    }



}
const checkCollision = () => {
    const head = snake[snake.length - 1];
    const neckIndex = snake.length - 2;
    const canvasLimit = canvas.width - size
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position,index) => {
        return index < neckIndex && position.x == head.x && head.y == position.y
    })
    if(wallCollision || selfCollision){
        gameOver()
    }
}
const gameOver = () => {
    direction = undefined
    gameOn = false
    clearInterval(loopId)
    menu.classList.add('show')
    finalScore.innerText = score.innerText
    canvas.classList.add('blur')
  
}

const gameLoop = () => {
    ctx.clearRect(0, 0, 600, 600);
    clearInterval(loopId)
    drawGrid()
    drawFood()
    moveSnake();
    drawSnake();
    checkEat()
    checkCollision()
    loopId = setTimeout(() => {
        gameLoop()
    }, 100);
}
gameLoop()

document.addEventListener("keydown", ({key}) => {
    key = key.toLowerCase()

if ((key == "a" || key == "arrowleft") && gameOn && direction != "right") {
    direction = "left";
}

if ((key == "d" || key == "arrowright") && gameOn && direction != "left") {
    direction = "right";
}

if ((key == "s" || key == "arrowdown") && gameOn && direction != "up") {
    direction = "down";
}

if ((key == "w" || key == "arrowup") && gameOn && direction != "down") {
    direction = "up";
}

})

btnPlay.addEventListener("click",() => {
    score.innerText = "00"
    menu.classList.remove("show")
    canvas.classList.remove("blur")
    snake = [initialPosition]
    gameOn = true;
})

document.querySelectorAll(".btn-position").forEach((btn)=> {
    btn.addEventListener("click",() => {
        const position = btn.dataset.position
        direction = position
    })
})