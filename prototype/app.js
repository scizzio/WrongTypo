document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const squares = Array.from(grid.querySelectorAll('div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    const colors = ['orange', 'red', 'purple', 'green', 'blue'];
    
    // Tetromino shapes
    const tetrominoes = {
      l: [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
      ],
      z: [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
      ],
      t: [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1],
      ],
      o: [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
      ],
      i: [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
      ],
    };
  
    let currentPosition = 4;
    let currentRotation = 0;
    let randomIndex = Math.floor(Math.random() * Object.keys(tetrominoes).length);
    let currentTetromino = tetrominoes[Object.keys(tetrominoes)[randomIndex]][currentRotation];
    let nextRandom = Math.floor(Math.random() * Object.keys(tetrominoes).length);
    let timerId;
    let score = 0;
  
    // Draw Tetromino
    function draw() {
      currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[randomIndex];
      });
    }
  
    // Undraw Tetromino
    function undraw() {
      currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
      });
    }
  
    // Control Tetromino movement
    function control(e) {
      switch (e.keyCode) {
        case 37: moveLeft(); break;
        case 38: rotate(); break;
        case 39: moveRight(); break;
        case 40: moveDown(); break;
      }
    }
    document.addEventListener('keyup', control);
  
    // Move Tetromino Down
    function moveDown() {
      undraw();
      currentPosition += width;
      draw();
      freeze();
    }
  
    // Freeze Tetromino
    function freeze() {
      if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'));
        randomIndex = nextRandom;
        nextRandom = Math.floor(Math.random() * Object.keys(tetrominoes).length);
        currentTetromino = tetrominoes[Object.keys(tetrominoes)[randomIndex]][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
      }
    }
  
    // Move Tetromino Left
    function moveLeft() {
      undraw();
      const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);
      if (!isAtLeftEdge) currentPosition -= 1;
      if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
      }
      draw();
    }
  
    // Move Tetromino Right
    function moveRight() {
      undraw();
      const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);
      if (!isAtRightEdge) currentPosition += 1;
      if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
      }
      draw();
    }
  
    // Check Rotation Position
    function checkRotatedPosition(P) {
      P = P || currentPosition;
      if ((P + 1) % width < 4) {
        if (isAtRight()) {
          currentPosition += 1;
          checkRotatedPosition(P);
        }
      } else if (P % width > 5) {
        if (isAtLeft()) {
          currentPosition -= 1;
          checkRotatedPosition(P);
        }
      }
    }
  
    // Rotate Tetromino
    function rotate() {
      undraw();
      currentRotation = (currentRotation + 1) % 4;
      currentTetromino = tetrominoes[Object.keys(tetrominoes)[randomIndex]][currentRotation];
      checkRotatedPosition();
      draw();
    }
  
    // Show Next Tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const upNextTetrominoes = [
      [1, displayWidth + 1, displayWidth * 2 + 1, 2],
      [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
      [1, displayWidth, displayWidth + 1, displayWidth + 2],
      [0, 1, displayWidth, displayWidth + 1],
      [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ];
  
    function displayShape() {
      displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
      });
      upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[index].classList.add('tetromino');
        displaySquares[index].style.backgroundColor = colors[nextRandom];
      });
    }
  
    // Start/Pause Button
    startBtn.addEventListener('click', () => {
        if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Start';
        } else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * Object.keys(tetrominoes).length);
        displayShape();
        startBtn.textContent = 'Pause';
        }
    });
  
    // Add Score
    function addScore() {
      for (let i = 0; i < 199; i += width) {
        const row = Array.from({ length: width }, (_, j) => i + j);
        if (row.every(index => squares[index].classList.contains('taken'))) {
          score += 10;
          scoreDisplay.innerHTML = score;
          row.forEach(index => {
            squares[index].classList.remove('taken');
            squares[index].classList.remove('tetromino');
            squares[index].style.backgroundColor = '';
          });
          squares.splice(i, width).forEach(cell => grid.appendChild(cell));
        }
      }
    }
  
    // Game Over
    function gameOver() {
      if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId);
      }
    }
  });
  