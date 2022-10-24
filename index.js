const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const score = document.getElementById("score");
let key = 0;
let fullScrean;
let isGameOver = false;
let isStageClear = false;
let isStart = false;
let isCanStart = false;
let isGoTitle = false;
let isStay = false;
window.onkeydown = (event) => {
    key = event.keyCode
    if (!isGameOver && !isStageClear && !isStart && !isCanStart && !isGoTitle && !isStay){
        moveCharacter(key);
    }else if(isStart && key === 32){
        isStart = false;
        rulesExplanation();
    }else if(isCanStart && key === 32){
        isCanStart = false;
        isStay = true;
        stageShow();
    }else if(isGoTitle && key === 32){
        isGoTitle = false;
        startWindow();
    }
}
window.onkeyup = () => { key = 0; }
const MAP_WIDTH = 25;
const MAP_HEIGHT = 17;
const MAP_CELL_WIDTH = 12;
const MAP_CELL_HEIGHT = 8;
let stageCount = 1;
let playerX = 1;
let playerY = 1;
const stageShow = () => {
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    context.fillStyle = "rgba(255, 0, 0, 0.85)";
    context.font = "bold 60px CherrySwash";
    context.fillText(`Stage ${stageCount}`, 275, 280);
    setTimeout(() => {
        isStay = false;
        setStage();
    },2000);
}
const moveCharacter = (keyCode) => {
    if( keyCode === 38 ) {
        const key = stageMap[playerY - 1][playerX]
        if(key === 0 || key === 3) {
            stageMap[playerY][playerX] = stageMap[playerY - 1][playerX];
            stageMap[playerY - 1][playerX] = 11;
            playerY -= 1;
        }else if(key === 5){
            stageMap[playerY][playerX] = 0;
            stageMap[playerY - 1][playerX] = 61;
            playerY -= 1;
        }else if(key === 1 || key === 2) {
            stageMap[playerY][playerX] = 11;
        }
        drawWindow();
    }
    if( keyCode === 40 ) {
        const key = stageMap[playerY + 1][playerX]
        if( key === 0 || key === 3) {
            stageMap[playerY][playerX] = stageMap[playerY + 1][playerX]
            stageMap[playerY + 1][playerX] = 12;
            playerY += 1;
        }else if(key === 5){
            stageMap[playerY][playerX] = 0;
            stageMap[playerY + 1][playerX] = 62;
            playerY += 1;
        }else if(key === 1 || key === 2) {
            stageMap[playerY][playerX] = 12;
        }else if(key === 100){
            stageMap[playerY][playerX] = 0;
            stageMap[playerY + 1][playerX] = 112;
            playerY += 1;
        }
        drawWindow();
    }
    if( keyCode === 37 ) {
        const key = stageMap[playerY][playerX - 1]
        if(key === 0 || key === 3) {
            stageMap[playerY][playerX] = stageMap[playerY][playerX - 1];
            stageMap[playerY][playerX - 1] = 13;
            playerX -= 1;
        }else if(key === 5){
            stageMap[playerY][playerX] = 0;
            stageMap[playerY][playerX - 1] = 63;
            playerX -= 1;
        }else if(key === 1 || key === 2) {
            stageMap[playerY][playerX] = 13;
        }
        drawWindow();
    }
    if( keyCode === 39 ) {
        const key = stageMap[playerY][playerX + 1]
        if(key === 0 || key === 3) {
            stageMap[playerY][playerX] = stageMap[playerY][playerX + 1];
            stageMap[playerY][playerX + 1] = 14;
            playerX += 1;
        }else if(key === 5){
            stageMap[playerY][playerX] = 0;
            stageMap[playerY][playerX + 1] = 64;
            playerX += 1;
        }else if(key === 1 || key === 2) {
            stageMap[playerY][playerX] = 14;
        }else if(key === 100){
            stageMap[playerY][playerX] = 0;
            stageMap[playerY][playerX + 1] = 114;
            playerX += 1;
        }
        drawWindow();
    }
}

const createTrap = () => {
    const crossing = [];
    for(let i = 1; i < MAP_HEIGHT - 1; i++){
        for(let j = 1; j < MAP_WIDTH - 1; j++){
            if((stageMap[i][j] === 1 || stageMap[i][j] === 2)  && stageMap[i][j-1] !== 3 && stageMap[i][j+1] !== 3 && stageMap[i-1][j] !== 3 && stageMap[i+1][j] !== 3 && !(stageMap[i][j-1] === 1 && stageMap[i][j+1] === 1 && stageMap[i-1][j] === 1 && stageMap[i+1][j] === 1) && stageMap[i][j-1] !== 12 && stageMap[i][j+1] !== 12 && stageMap[i-1][j] !== 12 && stageMap[i+1][j] !== 12 && stageMap[i][j-1] !== 100 && stageMap[i][j+1] !== 100 && stageMap[i-1][j] !== 100 && stageMap[i+1][j] !== 100) {
                crossing.push([j,i]);
            }
        }
    }
    crossing.sort((a,b) => {return(a[0] - b[0]);});
    for(let i = 1; i < MAP_WIDTH - 1; i++){
        const widthFilter = crossing.filter((cross) => cross[0] === i);
        if(widthFilter.length !== 0){
            const loopCount = Math.floor((widthFilter.length + 0.1) / 3 + 1)
            for(let j = 0; j < loopCount; j++){
                const trap = Math.floor(Math.random() * widthFilter.length);
                stageMap[widthFilter[trap][1]][widthFilter[trap][0]] = 9;
                if(stageMap[widthFilter[trap][1] + 1][widthFilter[trap][0]] === 0){
                    stageMap[widthFilter[trap][1] + 1][widthFilter[trap][0]] = 5;
                }
                if(stageMap[widthFilter[trap][1] - 1][widthFilter[trap][0]] === 0){
                    stageMap[widthFilter[trap][1] - 1][widthFilter[trap][0]] = 5;
                }
                if(stageMap[widthFilter[trap][1]][widthFilter[trap][0] + 1] === 0){
                    stageMap[widthFilter[trap][1]][widthFilter[trap][0] + 1] = 5;
                }
                if(stageMap[widthFilter[trap][1]][widthFilter[trap][0] - 1] === 0){
                    stageMap[widthFilter[trap][1]][widthFilter[trap][0] - 1] = 5;
                }
                widthFilter.splice(trap,1);
            }

        }
    }
    drawWindow();
}

const setStage = () => {
    stageMap = [];
    for(let i = 0; i < MAP_HEIGHT; i++){
        stageMap.push([]);
        for(let j = 0; j < MAP_WIDTH; j++){
            if(i === 1 && j === 1){
                stageMap[i].push(12);
            }else if(i === 15 && j === 23){
                stageMap[i].push(100);
            }else{
                stageMap[i].push(1);
            }
        }
    }

    for (let i = 0; i < stageCount + 2; i++){
        let x = 1, y = 1;
        let load = i===0 ? 3 : 0;
        for (let j = 1; j < MAP_HEIGHT + MAP_WIDTH / 2 - 4; j++) {
            if( x + 2 < MAP_WIDTH && y + 2 < MAP_HEIGHT ) {
                const randomNumber = Math.floor(Math.random() * (MAP_CELL_HEIGHT + MAP_CELL_WIDTH - j));
                if (randomNumber <= MAP_CELL_WIDTH - Math.floor(x/2) - 1) {
                    x += 2;
                    if(stageMap[y][x - 1] !== 3){
                        stageMap[y][x - 1] = load;
                    }
                    if(i > 0) {
                    }
                }else{
                    y += 2;
                    if(stageMap[y - 1][x] !== 3){
                        stageMap[y - 1][x] = load;
                    }
                    if(i > 0) {
                    }
                }
            } else if (y + 2 < MAP_HEIGHT) {
                y += 2;
                if(stageMap[y - 1][x] !== 3) {
                    stageMap[y - 1][x] = load;
                }
                if(i > 0) {
                }
            } else if (x + 2 < MAP_WIDTH){
                x += 2;
                if(stageMap[y][x - 1] !== 3) {
                    stageMap[y][x - 1] = load;
                }
                if(i > 0) {
                }
            }
            if(stageMap[y][x] !== 3){
                stageMap[y][x] = load;
            }
            if(i > 0) {
            }
        }
    }
    stageMap[MAP_HEIGHT-2][MAP_WIDTH-2] = 100;
    createTrap();
}

const drawWindow = () => {
    const frontCharacter = new Image();
    const backCharacter = new Image();
    const leftCharacter = new Image();
    const rightCharacter = new Image();
    const goalImg = new Image();
    const goalImage = new Image();
    const goalCanvas = document.createElement("canvas");
    goalCanvas.height = context.canvas.clientHeight;
    goalCanvas.width = context.canvas.clientWidth;
    goalCanvas.id = "goal",
    goalCanvas.style = "position: absolute; z-index: 2;";
    canvas.appendChild(goalCanvas);
    const goalContext = goalCanvas.getContext("2d");

    const oldData = document.getElementById("view-field");
    oldData?.remove();

    const viewFieldCanvas = document.createElement("canvas");
    viewFieldCanvas.height = context.canvas.clientHeight;
    viewFieldCanvas.width = context.canvas.clientWidth;
    viewFieldCanvas.id = "view-field",
    viewFieldCanvas.style = "position: absolute; z-index: 2;";
    canvas.appendChild(viewFieldCanvas);

    const viewFieldContext = viewFieldCanvas.getContext("2d");
    document.body.appendChild(viewFieldCanvas);
    context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    viewFieldContext.beginPath();
    viewFieldContext.arc(playerX*32+16, playerY*32+16, 75, 0, Math.PI*2, true);
    viewFieldContext.clip();
    for(let i = 0; i < MAP_HEIGHT; i++){
        for(let j = 0; j < MAP_WIDTH; j++){
            switch(stageMap[i][j]){
                case(0):
                    viewFieldContext.fillStyle = "rgb(255, 255, 255)";
                    break;
                case(1):
                    viewFieldContext.fillStyle = "rgb(0, 0, 0)";
                    break;
                case(2):
                    viewFieldContext.fillStyle = "rgb(0, 0, 0)";
                    break;
                case(3):
                    viewFieldContext.fillStyle = "rgb(255, 255, 255)";
                    break;
                case(5):
                    viewFieldContext.fillStyle = "rgb(255, 255, 255)";
                    break;
                case(9):
                    viewFieldContext.fillStyle = "rgb(225, 0, 0)";
                    break;
                case(11):
                    viewFieldContext.fillStyle = "rgb(255, 255, 255)";
                    backCharacter.onload = () => {
                        viewFieldContext.drawImage(backCharacter,32*j,32*i);
                    }
                    break;
                case(12):
                    viewFieldContext.fillStyle = "rgb(255, 255, 255)";
                    frontCharacter.onload = () => {
                        viewFieldContext.drawImage(frontCharacter,32*j,32*i);
                    }
                    break;
                case(13):
                    viewFieldContext.fillStyle = "rgb(255, 255, 255)";
                    leftCharacter.onload = () => {
                        viewFieldContext.drawImage(leftCharacter,32*j,32*i);
                    }
                    break;
                case(14):
                    viewFieldContext.fillStyle = "rgb(255, 255, 255)";
                    rightCharacter.onload = () => {
                        viewFieldContext.drawImage(rightCharacter,32*j,32*i);
                    }
                    break;
                case(61):
                    backCharacter.onload = () => {
                        viewFieldContext.drawImage(backCharacter,32*j,32*i);
                    }
                    isGameOver = true;
                    break;
                case(62):
                    frontCharacter.onload = () => {
                        viewFieldContext.drawImage(frontCharacter,32*j,32*i);
                    }
                    isGameOver = true;
                    break;
                case(63):
                    leftCharacter.onload = () => {
                        viewFieldContext.drawImage(leftCharacter,32*j,32*i);
                    }
                    isGameOver = true;
                    break;
                case(64):
                    rightCharacter.onload = () => {
                        viewFieldContext.drawImage(rightCharacter,32*j,32*i);
                    }
                    isGameOver = true;
                    break;
                case(100):
                    goalImg.onload = () => {
                        context.drawImage(goalImg,32*j,32*i);
                    }
                    break;
                case(112):
                    frontCharacter.onload = () => {
                        viewFieldContext.drawImage(frontCharacter,32*j,32*i);
                    }
                    isStageClear = true;
                    break;
                case(114):
                    rightCharacter.onload = () => {
                        viewFieldContext.drawImage(rightCharacter,32*j,32*i);
                    }
                    isStageClear = true;
                    break;
            }
            if(stageMap[i][j] !== 100){
               viewFieldContext.fillRect(32*j,32*i,32,32);        
            }
        }
    }
    goalImage.onload = () => {
        goalContext.drawImage(goalImage, context.canvas.clientWidth - 64, context.canvas.clientHeight - 64);
    }
    if(isGameOver){
        gameOver();
        setTimeout(() => {
            viewFieldCanvas.remove();
        },1000);
    }else if(isStageClear){
        viewFieldCanvas.remove();
        stageClear();
    }
    frontCharacter.src = "./image/frontCharacter.jpg";
    backCharacter.src = "./image/backCharacter.jpg";
    leftCharacter.src = "./image/leftCharacter.jpg";
    rightCharacter.src = "./image/rightCharacter.jpg";
    goalImg.src = "./image/goal.jpg";
    goalImage.src = "./image/goal.jpg";
}

const startWindow = () => {
    let cat = localStorage.getItem("Run away record");
    if(cat === null){
        localStorage.setItem('Run away record', 0);
        cat = localStorage.getItem("Run away record");
    }
    score.innerHTML = `Best Score: ${cat}`;
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    context.fillStyle = "rgba(255, 0, 0, 0.85)";
    context.font = "bold 60px CherrySwash";
    context.fillText('Run away', 250, 210);
    context.font = "bold 20px CherrySwash";
    context.fillText('~ press spacebar to start ~', 260, 390);
    isStart = true;
}

const rulesExplanation = () => {
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    context.fillStyle = "rgba(255, 0, 0, 0.85)";
    context.font = "bold 60px CherrySwash";
    context.fillText('Rules', 310, 150);

    context.font = "bold 20px CherrySwash";
    context.fillText('I. Move the player with the D-Pad', 210, 225);

    context.font = "bold 20px CherrySwash";
    context.fillText('II. Move the player to the goal', 210, 300);

    context.font = "bold 20px CherrySwash";
    context.fillText('III. Do not walk next to red squares', 210, 375);

    context.font = "bold 20px CherrySwash";
    context.fillText('~ press spacebar to start ~', 260, 450);

    isCanStart = true;
}

const stageClear = () => {
    isStageClear = false;
    playerX = 1, playerY = 1;
    stageCount += 1;
    if (stageCount < 21){
        context.fillStyle = "rgba(0, 255, 0, 0.85)";
        context.font = "bold 60px CherrySwash";
        context.fillText('Stage Clear', 220, 210);
        context.font = "bold 20px CherrySwash";
        context.fillText('~ press spacebar to next stage ~', 230, 390);
        isCanStart = true;
    }else{
        localStorage.setItem('Run away record', stageCount-1);
        score.innerHTML = `Best Score: ${stageCount-1}`;
        context.fillStyle = "rgba(0, 255, 0, 0.85)";
        context.font = "bold 60px CherrySwash";
        context.fillText('congratulations!!', 140, 210);
        context.font = "bold 50px CherrySwash";
        context.fillText(`Score:${stageCount-1}`, 290, 280);
        context.font = "bold 20px CherrySwash";
        context.fillText('~ press spacebar to title ~', 260, 390);
        stageCount = 1;
        isGoTitle = true;
    }
}

const gameOver = () => {
    const handCanvas = document.getElementById("hand");
    const hendContext = handCanvas.getContext("2d");
    const handImage = new Image();
    const music = new Audio('./03.mp3');
    let x = playerX , y = playerY;
    switch (stageMap[playerY][playerX]){
        case(62):
            y += 1;
            break;
        case(61):
            y -= 1;
            handImage.style = `rotate("180"deg)`
            break;
        case(64):
            x += 1;
            handImage.style = `rotate("-90"deg)`
            break;
        case(63):
            x -= 1;
            handImage.style = `rotate("90"deg)`
            break;
    }
    handImage.onload = () => {
        hendContext.drawImage(handImage,32*x,32*y);
    }
    setTimeout(() => {
        hendContext.clearRect(0, 0, hendContext.canvas.clientWidth, hendContext.canvas.clientHeight);
        context.clearRect(0, 0, hendContext.canvas.clientWidth, hendContext.canvas.clientHeight);
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
        music.play();
    },1000);

    setTimeout(() => {
        isGameOver = false;
        playerX = 1, playerY = 1;
        let cat = localStorage.getItem("Run away record");
        if(cat < stageCount){
            localStorage.setItem('Run away record', stageCount-1);
            cat = localStorage.getItem("Run away record");
        }
        score.innerHTML = `Best Score: ${cat}`;
        context.fillStyle = "rgba(255, 0, 0, 0.85)";
        context.font = "bold 60px CherrySwash";
        context.fillText('GAME OVER', 220, 210);
        context.font = "bold 50px CherrySwash";
        context.fillText(`Score:${stageCount-1}`, 310, 280);
        context.font = "bold 20px CherrySwash";
        context.fillText('~ press spacebar to title ~', 270, 390);
        isGoTitle = true;
        stageCount = 1;
    },2000);
    handImage.src = "./image/hand.jpg";
}
