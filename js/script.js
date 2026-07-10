const canvas = document.querySelector("canvas");
const score = document.querySelector(".score--value");
const totalScore = document.querySelector(".score-total")
const totalScoreData = document.querySelector(".score-total-data")
const finalScore = document.querySelector(".final-score--value");
const menu = document.querySelector("div.menu-screen");
const btnPlay = document.querySelector(".btn-play");
const btnViewScore = document.querySelector(".btn-view-score-total")
const h1 = document.querySelector("h1");
const ctx = canvas.getContext("2d");
let allScores = JSON.parse(localStorage.getItem("scores")) ?? []
const eat = new Audio('./assets/eat.mp3');
const death = new Audio('./assets/death.mp3');

const size = 30;
let gameOn = true;
let direction, loopId;
time = 100
const incrementScore = () => {
    let currentScore = parseInt(score.textContent);

    if (currentScore < 100) {
        currentScore += 5;
    } else if (currentScore < 1000) {
        currentScore += 10;
    } else if (currentScore < 10000) {
        currentScore += 100;
    }

    score.textContent = currentScore;
};
let snake = [
    { x: 0, y: 0 },

];
const initialPosition = snake[0];
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}
const createNewScore = (index, params, date) => {
    return `
    <li class="score-total-info">
    <span class="score-total-ranking">
    ${index}
    </span>
    <div>
    <span class="score-total--value">
    ${params}
    </span>
    <span class="score-total--date">
    ${date}
    </span>
    
    </div>
    </li>
    `
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / size) * size
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}
const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        snake.push(head);
        if (time > 10) {
            time -= score.textContent.length - 1
        }
        incrementScore()
        eat.play()

        let x = randomPosition();
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
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
    const { x, y, color } = food
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 5
    ctx.fillRect(x, y, size, size)
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
const headSnake = () => {
    const head = snake[snake.length - 1];

    ctx.fillStyle = "red";
    if (snake.length <= 1) return;
    switch (direction) {
        case "right":
            // Olhos
            ctx.fillRect(head.x + 20, head.y + 5, 5, 5);
            ctx.fillRect(head.x + 20, head.y + 20, 5, 5);

            // Boca
            ctx.fillRect(head.x + 30, head.y + 12, 25, 1);
            ctx.fillRect(head.x + 30, head.y + 13, 20, 1);
            ctx.fillRect(head.x + 30, head.y + 14, 20, 1);
            ctx.fillRect(head.x + 30, head.y + 15, 25, 1);
            break;

        case "left":
            // Olhos
            ctx.fillRect(head.x + 10, head.y + 5, 5, 5);
            ctx.fillRect(head.x + 10, head.y + 20, 5, 5);

            // Boca
            ctx.fillRect(head.x - 25, head.y + 12, 25, 1);
            ctx.fillRect(head.x - 20, head.y + 13, 20, 1);
            ctx.fillRect(head.x - 20, head.y + 14, 20, 1);
            ctx.fillRect(head.x - 25, head.y + 15, 25, 1);
            break;

        case "up":
            // Olhos
            ctx.fillRect(head.x + 5, head.y + 10, 5, 5);
            ctx.fillRect(head.x + 20, head.y + 10, 5, 5);

            // Boca
            ctx.fillRect(head.x + 12, head.y - 25, 1, 25);
            ctx.fillRect(head.x + 13, head.y - 20, 1, 20);
            ctx.fillRect(head.x + 14, head.y - 20, 1, 20);
            ctx.fillRect(head.x + 15, head.y - 25, 1, 25);
            break;

        case "down":
            // Olhos
            ctx.fillRect(head.x + 5, head.y + 20, 5, 5);
            ctx.fillRect(head.x + 20, head.y + 20, 5, 5);

            // Boca
            ctx.fillRect(head.x + 12, head.y + 30, 1, 25);
            ctx.fillRect(head.x + 13, head.y + 30, 1, 20);
            ctx.fillRect(head.x + 14, head.y + 30, 1, 20);
            ctx.fillRect(head.x + 15, head.y + 30, 1, 25);
            break;
    }
};
const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#191919'

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }



}
const checkCollision = () => {
    const head = snake[snake.length - 1];
    const neckIndex = snake.length - 2;
    const canvasLimit = canvas.width - size
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && head.y == position.y
    })
    if (wallCollision || selfCollision) {
        gameOver()
    }
}
const showAllScores = () => {
    allScores.sort((a, b) => b.score - a.score);
    totalScoreData.innerHTML = ''
    if (allScores.length > 0) {
        totalScoreData.innerHTML = allScores
            .map(({ score, date }, index) => createNewScore(index + 1, score, date))
            .join("");
        return;
    } else {
        totalScoreData.innerHTML = "Nenhum Score adicionado"
    }
};
const gameOver = () => {

    direction = undefined
    gameOn = false
    menu.classList.add('show')
    finalScore.innerText = score.innerText
    canvas.classList.add('blur')

}

const gameLoop = () => {
    ctx.clearRect(0, 0, 600, 600);
    clearTimeout(loopId)
    drawGrid()
    drawFood()
    moveSnake();
    drawSnake();
    checkEat()
    headSnake()
    checkCollision()
    showAllScores()
    loopId = setTimeout(() => {
        gameLoop()
    }, time);
}
gameLoop()
const oppositeDirection = {
    left: "right",
    right: "left",
    up: "down",
    down: "up"
};
document.addEventListener("keydown", ({ key }) => {
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

btnPlay.addEventListener("click", () => {

    score.innerText = "00"
    time = 100
    menu.classList.remove("show")
    canvas.classList.remove("blur")
    snake = [initialPosition]
    gameOn = true;


    const date = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const newScore = { score: finalScore.innerText, date: date }
    if (finalScore.textContent != "00") {
        allScores.push(newScore)
        localStorage.setItem('scores', JSON.stringify(allScores))
        return;
    }

})



document.querySelectorAll(".btn-position").forEach(btn => {
    btn.addEventListener("click", () => {
        const position = btn.dataset.position;

        if (direction !== oppositeDirection[position] && gameOn) {
            direction = position;
        }
    });
});
btnViewScore.addEventListener("click", () => {
    canvas.classList.toggle('blur')
    totalScore.classList.toggle("show")
})