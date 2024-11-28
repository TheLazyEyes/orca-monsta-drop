// Initialize all variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var playerImage = new Image();
var playerImageOriginal = new Image();
var goodItemImage = new Image();
var badItemImage = new Image();
var surpriseItemImage = new Image();
var medicalItemImage = new Image();
var heartImage = new Image();
var gameOverImage = new Image();
var menuOverlayImage = new Image();
var gameOverPileImage = new Image();
var surpriseItemCounter = 0;
var restartButton = document.createElement("button");
var watchButton = document.createElement("button");

var playerWidth = 80; // Set the desired width for the player image
var playerHeight = 110; // Set the desired height for the player image
var goodItemWidth = 35; // Set the desired width for the good item image
var goodItemHeight = 60; // Set the desired height for the good item image
var badItemWidth = 50; // Set the desired width for the bad item image
var badItemHeight = 80; // Set the desired height for the bad item image
var surpriseItemWidth = 60; // Set the desired width for the surprise item image
var surpriseItemHeight = 60; // Set the desired height for the surprise item image
var medicalItemWidth = 60;
var medicalItemHeight = 50;
var heartWidth = 30; // Set the desired width for the heart image
var heartHeight = 30; // Set the desired height for the heart image
var playerX = canvas.width / 2 - playerWidth / 2;
var playerY = canvas.height - playerHeight;
var goodItems = []; // Array to store good item positions and speeds
var badItems = []; // Array to store bad item positions and speeds
var surpriseItems = []; // Array to store surprise item positions and speeds
var medicalItems = [];
var maxItems = 8; // Maximum number of items on the screen
var itemSpeed = 2;
var maxFallSpeed = 25; //Maximum fall speed of all items
var fallAcceleration = 0.004; // Adjust the acceleration value to control the speed increase
var spawnCounter = 1; // Counter for spawning items
var score = 0;
var hearts = 3;
var isGameOver = false;
var isPlayerImmune = false;
var immuneDuration = 10; // Duration of player immunity in seconds
var immunityTimer = 0; // Remaining time for player immunity

var backgroundMusic = new Audio("assets/game_music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.15;
backgroundMusic.play();

var goodItemSound = new Audio("assets/point_sound.mp3");
var badItemSound = new Audio("assets/damage_sound.mp3");
badItemSound.volume = 0.7;
var lowScoreSound = new Audio("assets/low_score_gameover.mp3");
lowScoreSound.volume = 0.7;
var highScoreSound = new Audio("assets/high_score_gameover.mp3");
highScoreSound.volume = 0.7;

// Update restart button style
restartButton.innerText = "Some more Monsta's?";
restartButton.style.position = "absolute";
restartButton.style.left = "50%";
restartButton.style.top = "70%";
restartButton.style.transform = "translate(-50%, -50%)";
restartButton.style.padding = "10px 20px";
restartButton.style.fontSize = "16px";
restartButton.style.fontFamily = "'Courier New', Courier, monospace";
restartButton.style.backgroundColor = "linear-gradient(90deg, #ff5722, #ff9800)";
restartButton.style.color = "black";
restartButton.style.border = "none";
restartButton.style.borderRadius = "8px";
restartButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)";
restartButton.style.cursor = "pointer";
restartButton.style.transition = "transform 0.2s, background-color 0.2s";

// Hover effect for restart button
restartButton.addEventListener("mouseenter", () => {
  restartButton.style.transform = "translate(-50%, -50%) scale(1.1)";
  restartButton.style.backgroundColor = "linear-gradient(90deg, #ff9800, #ff5722)";
});
restartButton.addEventListener("mouseleave", () => {
  restartButton.style.transform = "translate(-50%, -50%) scale(1)";
  restartButton.style.backgroundColor = "linear-gradient(90deg, #ff5722, #ff9800)";
});

// Update watch button style
watchButton.innerText = "Join ORCA Monsta";
watchButton.style.position = "absolute";
watchButton.style.left = "50%";
watchButton.style.top = "80%";
watchButton.style.transform = "translate(-50%, -50%)";
watchButton.style.padding = "10px 20px";
watchButton.style.fontSize = "16px";
watchButton.style.fontFamily = "'Courier New', Courier, monospace";
watchButton.style.backgroundColor = "linear-gradient(90deg, #4caf50, #8bc34a)";
watchButton.style.color = "black";
watchButton.style.border = "none";
watchButton.style.borderRadius = "8px";
watchButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)";
watchButton.style.cursor = "pointer";
watchButton.style.transition = "transform 0.2s, background-color 0.2s";

// Hover effect for watch button
watchButton.addEventListener("mouseenter", () => {
  watchButton.style.transform = "translate(-50%, -50%) scale(1.1)";
  watchButton.style.backgroundColor = "linear-gradient(90deg, #5e892c, #4caf50)";
});
watchButton.addEventListener("mouseleave", () => {
  watchButton.style.transform = "translate(-50%, -50%) scale(1)";
  watchButton.style.backgroundColor = "linear-gradient(90deg, #4caf50, #5e892c)";
});

// Draw Monstas, Speed, and Immunity Counters
function drawCounters() {
  // Define styles
  const boxPadding = 10; // Padding inside the counter boxes
  const boxHeight = 40; // Height of the counter box
  const textColor = "white"; // Text color
  const backgroundColor = "rgba(0, 0, 0, 0.6)"; // Semi-transparent black background
  const borderColor = "lightgreen"; // Border color
  const shadowColor = "rgba(0, 255, 0, 0.5)"; // Green glow effect

  ctx.shadowBlur = 10; // Set glow for all boxes
  ctx.shadowColor = shadowColor;

  // Monstas Counter
  const monstasText = "Monstas: " + Math.floor(score);
  const monstasBoxWidth = ctx.measureText(monstasText).width + boxPadding * 2;
  const monstasX = 10;
  const monstasY = 10;

  // Draw Monstas Box
  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.fillRect(monstasX, monstasY, monstasBoxWidth, boxHeight);
  ctx.strokeRect(monstasX, monstasY, monstasBoxWidth, boxHeight);

  // Draw Monstas Text
  ctx.font = "20px Courier New, monospace";
  ctx.fillStyle = textColor;
  ctx.shadowBlur = 0; // Remove shadow for text
  ctx.fillText(monstasText, monstasX + boxPadding, monstasY + 28);

  // Speed Counter
  const speedText = "Speed: " + Math.floor(itemSpeed);
  const speedBoxWidth = ctx.measureText(speedText).width + boxPadding * 2;
  const speedX = 10;
  const speedY = 60;

  // Draw Speed Box
  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 10; // Restore shadow for boxes
  ctx.fillRect(speedX, speedY, speedBoxWidth, boxHeight);
  ctx.strokeRect(speedX, speedY, speedBoxWidth, boxHeight);

  // Draw Speed Text
  ctx.font = "20px Courier New, monospace";
  ctx.fillStyle = textColor;
  ctx.shadowBlur = 0; // Remove shadow for text
  ctx.fillText(speedText, speedX + boxPadding, speedY + 28);

  // Immunity Counter (if active)
  if (isPlayerImmune) {
    const immunityText = "Immunity: " + Math.ceil(immunityTimer) + "s";
    const immunityBoxWidth = ctx.measureText(immunityText).width + boxPadding * 2;
    const immunityX = 10;
    const immunityY = 110;

    // Draw Immunity Box
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = "gold"; // Immunity-specific color
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10; // Restore shadow for boxes
    ctx.fillRect(immunityX, immunityY, immunityBoxWidth, boxHeight);
    ctx.strokeRect(immunityX, immunityY, immunityBoxWidth, boxHeight);

    // Draw Immunity Text
    ctx.font = "20px Courier New, monospace";
    ctx.fillStyle = textColor;
    ctx.shadowBlur = 0; // Remove shadow for text
    ctx.fillText(immunityText, immunityX + boxPadding, immunityY + 28);
  }
}


// Load images
gameOverPileImage.src = "assets/game_over_pile.png";
playerImage.src = "assets/player.png";
playerImageOriginal.src = "assets/player_original.png";
goodItemImage.src = "assets/good_item.png";
badItemImage.src = "assets/bad_item.png";
surpriseItemImage.src = "assets/surprise_item.png";
medicalItemImage.src = "assets/medical_item.png";
heartImage.src = "assets/heart.png";
gameOverImage.src = "assets/game_over.png";
menuOverlayImage.src = "assets/menu_shader.png";

// Handle player-item collision
function checkCollision() {
  for (var i = 0; i < goodItems.length; i++) {
    var goodItem = goodItems[i];
    if (
      playerX < goodItem.x + goodItemWidth &&
      playerX + playerWidth > goodItem.x &&
      playerY < goodItem.y + goodItemHeight &&
      playerY + playerHeight > goodItem.y
    ) {
      score += 10 * itemSpeed;
      goodItemSound.play();
      goodItems.splice(i, 1); // Remove the collided good item
    }
  }

  for (var i = 0; i < badItems.length; i++) {
    var badItem = badItems[i];
    if (
      playerX < badItem.x + badItemWidth &&
      playerX + playerWidth > badItem.x &&
      playerY < badItem.y + badItemHeight &&
      playerY + playerHeight > badItem.y
    ) {
      if (!isPlayerImmune) {
        hearts--;
        score -= 50;
        badItemSound.play();
        maxItems += 1;
      }
      badItems.splice(i, 1); // Remove the collided bad item
    }
  }

  for (var i = 0; i < medicalItems.length; i++) {
    var medicalItem = medicalItems[i];
    if (
      playerX < medicalItem.x + medicalItemWidth &&
      playerX + playerWidth > medicalItem.x &&
      playerY < medicalItem.y + medicalItemHeight &&
      playerY + playerHeight > medicalItem.y
    ) {
      if (hearts < 3) {
        hearts = 3;
        score += 100;
        maxItems += 1;
        medicalItems.splice(i, 1); // Remove the collided medical item
      }
    }
  }

  for (var i = 0; i < surpriseItems.length; i++) {
    var surpriseItem = surpriseItems[i];
    if (
      playerX < surpriseItem.x + surpriseItemWidth &&
      playerX + playerWidth > surpriseItem.x &&
      playerY < surpriseItem.y + surpriseItemHeight &&
      playerY + playerHeight > surpriseItem.y
    ) {
      maxItems += 1;
      score += 100;
      isPlayerImmune = true;
      immunityTimer = immuneDuration;
      surpriseItems.splice(i, 1); // Remove the collided surprise item
      if (isPlayerImmune == true) {
        playerImage.src = "assets/player.png";
      } else {
        playerImage.src = "assets/player_original.png";
      }
      surpriseItemCounter++;
    }
  }
}

// Reset item position and speed
function resetItems() {
  if (goodItems.length + badItems.length + surpriseItems.length < maxItems) {
    var randomNum = Math.random();
    if (randomNum < 0.85) {
      // Spawn a good item
      var goodItem = {
        x: Math.random() * (canvas.width - goodItemWidth),
        y: -goodItemHeight,
        speed: itemSpeed
      };
      goodItems.push(goodItem);
    } else if (randomNum < 0.985) {
      // Spawn a bad item
      var badItem = {
        x: Math.random() * (canvas.width - badItemWidth),
        y: -badItemHeight,
        speed: itemSpeed
      };
      badItems.push(badItem);
    } else if (randomNum < 0.995) {
      // Spawn a surprise item
      var surpriseItem = {
        x: Math.random() * (canvas.width - surpriseItemWidth),
        y: -surpriseItemHeight,
        speed: itemSpeed
      };
      surpriseItems.push(surpriseItem);
    } else if (randomNum < 1.0) {
      // Spawn a medical item
      var medicalItem = {
        x: Math.random() * (canvas.width - medicalItemWidth),
        y: -medicalItemHeight,
        speed: itemSpeed
      };
      medicalItems.push(medicalItem);
    }
  }
}

// Update game objects and render
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  if (isPlayerImmune) {
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
  } else {
    ctx.drawImage(
      playerImageOriginal,
      playerX,
      playerY,
      playerWidth,
      playerHeight
    );
  }

  // Draw good items
  for (var i = 0; i < goodItems.length; i++) {
    var goodItem = goodItems[i];
    ctx.drawImage(
      goodItemImage,
      goodItem.x,
      goodItem.y,
      goodItemWidth,
      goodItemHeight
    );
    goodItem.y += goodItem.speed;
    if (goodItem.y > canvas.height) {
      goodItems.splice(i, 1); // Remove the off-screen good item
    }
  }

  // Draw bad items
  for (var i = 0; i < badItems.length; i++) {
    var badItem = badItems[i];
    ctx.drawImage(
      badItemImage,
      badItem.x,
      badItem.y,
      badItemWidth,
      badItemHeight
    );
    badItem.y += badItem.speed;
    if (badItem.y > canvas.height) {
      badItems.splice(i, 1); // Remove the off-screen bad item
    }
  }

  // Draw surprise items
  for (var i = 0; i < surpriseItems.length; i++) {
    var surpriseItem = surpriseItems[i];
    ctx.drawImage(
      surpriseItemImage,
      surpriseItem.x,
      surpriseItem.y,
      surpriseItemWidth,
      surpriseItemHeight
    );
    surpriseItem.y += surpriseItem.speed;
    if (surpriseItem.y > canvas.height) {
      surpriseItems.splice(i, 1); // Remove the off-screen surprise item
    }
  }

  // Draw medical items
  for (var i = 0; i < medicalItems.length; i++) {
    var medicalItem = medicalItems[i];
    ctx.drawImage(
      medicalItemImage,
      medicalItem.x,
      medicalItem.y,
      medicalItemWidth,
      medicalItemHeight
    );
    medicalItem.y += medicalItem.speed;
    if (medicalItem.y > canvas.height) {
      medicalItems.splice(i, 1); // Remove the off-screen medical item
    }
  }

  // Check player-item collision
  checkCollision();

  // Draw score
  drawCounters();

  // Draw hearts
  for (var i = 0; i < hearts; i++) {
    var heartX = canvas.width - (i + 1) * (heartWidth + 10);
    var heartY = 10;
    ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);
  }

 // Draw immunity timer
if (isPlayerImmune) {
    ctx.font = "24px Courier New ";
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "black"; // Set the outline color to black
    ctx.lineWidth = 2; // Set the outline width
    ctx.strokeText("Immunity: " + Math.floor(immunityTimer) + "s", 10, 60);
    ctx.fillText("Immunity: " + Math.floor(immunityTimer) + "s", 10, 60);
  };  

  // Check if player lost all hearts
  if (hearts <= 0) {
    isGameOver = true;
  
    // Dynamically calculate the game-over image size and position
    const gameOverWidth = canvas.width; // 80% of canvas width
    const gameOverHeight = canvas.height * 0.4; // 40% of canvas height
    const gameOverX = (canvas.width - gameOverWidth) / 2;
    const gameOverY = (canvas.height - gameOverHeight) / 2;
  
    // Gradual hover appearing effect (fade-in)
    let opacity = 0; // Initial opacity
    const fadeInInterval = setInterval(() => {
      if (opacity < 1) {
        opacity += 0.05; // Increase opacity incrementally
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.globalAlpha = opacity; // Set current opacity
        ctx.drawImage(gameOverImage, gameOverX, gameOverY, gameOverWidth, gameOverHeight);
        ctx.globalAlpha = 1; // Reset alpha for next draw calls
      } else {
        clearInterval(fadeInInterval); // Stop the fade-in process
      }
    }, 50); // Adjust fade speed as needed
    if (score < 10000) {
        lowScoreSound.play();
      } else {
        highScoreSound.play();
      }
    document.body.appendChild(restartButton);
    document.body.appendChild(watchButton);
    return; // Exit the update function
    
  }

  // Update immunity timer
  if (isPlayerImmune) {
    immunityTimer -= 1 / 60; // Decrement timer by 1 second per frame
    if (immunityTimer <= 0) {
      isPlayerImmune = false;
      playerImage.src = "assets/player_original.png";
    }
  }

  // Increase overall fall speed
  itemSpeed += fallAcceleration;
  if (itemSpeed > maxFallSpeed) {
    itemSpeed = maxFallSpeed;
  }
  

  // Spawn new items
  spawnCounter++;
  if (spawnCounter % 10 === 0) {
    resetItems();
  }

  requestAnimationFrame(update);
}

// restart button listener
restartButton.addEventListener("click", function () {
    window.location.reload();
  });

// Add click event listener to URL button
watchButton.addEventListener("click", function() {
    window.location.href = ("https://orca-monsta.vercel.app/"); // Replace with your desired URL
  });

// Handle mouse movement
canvas.addEventListener("mousemove", function (event) {
  var rect = canvas.getBoundingClientRect();
  playerX = event.clientX - rect.left - playerWidth / 2;
});


// Start the game loop
resetItems();
update();
