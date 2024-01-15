let cols = 5;
let rows = 5;
let size = 76;
let table;
let palette;
let col;
let angle = 100;
let startingAngle = 70;
let colors = [];
let frames = 10;

// let block_hash = 'GHNHsSL2jTeb3cNPrbCZR1NyLBySgbqbPauMpy5WEphs'
// let block_hash = '5bpiV9BY1kwxRxWUhvBQVCKbMBef82MyXoSNRPzHWSjr'
// let block_hash = '3hQswdR5fXvr24UozdiKDhPg9ZT1ZU16fDYW38LP4H4N'
// let block_hash = 'Df53Bg4aJwAZLHHTbCvJ8otZg7BAGTnC4eUUjutej14a'

// const extracted_ints = block_hash.match(/\d+/g).map(Number);
// const combined_int = parseInt(extracted_ints.join(""));
// console.log(combined_int);


let chars=['6e', '4H','44', '3w', '2Y','5i','5C','3s','pc','59','2U','5R','5K','5w','5R','5K','FW','2M','3r','43','2u','4r','La','4z','2U','Sw'];
// let chars=['6f', '4o','26', '3s', '2G','4C','3r','58','4U','32','42','5X','4j','cG','3B','D1','4U','4N','4W','2j','3F','3t','3n','2e','yb','5p'];
// let chars=['4c', '4N','5C', 'Zb', '3p','25','4x','3j','35','39','3P','uQ','36','5q','3N','5S','T1','57','49','3A','2H','2T','4v','iw','5v','48'];
// let chars=['4d', '5x','4o', '3j', 'hx','36','4z','5T','ZF','4v','qi','H9','GN','3B','5m','2o','5g','54','5U','3e','4c','3V','gS','5d','4A','3i'];

function preload() {
  table = loadTable("color.csv", "csv", "header");
}

function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
  palette = floor(random(table.getRowCount()));
  col = floor(random(table.getColumnCount()));
  
  // palette = floor(combined_int % table.getRowCount());
  // col = floor(combined_int % table.getColumnCount());

  // Generate random colors for each cell
  for (let i = 0; i < cols; i++) {
    colors[i] = [];
    for (let j = 0; j < rows; j++) {
      let col = floor(random(5));
      let r = table.get(palette, col * 3);
      let g = table.get(palette, col * 3 + 1);
      let b = table.get(palette, col * 3 + 2);
      let lerpColor1 = color(r, g, b);
      let lerpColor2 = color(r, g, b);
      colors[i][j] = { lerpColor1, lerpColor2 };
    }
  }
  
  frameRate(10); 
  
  pg = createGraphics(150, 150);
  pg.textSize(150);
  
}

function draw() {
  background(255);

  translate(size / 2 - size * cols / 2, size / 2 - size * rows / 2);

  // Draw boxes
  let count = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let percentX = i / cols;
      let percentY = j / rows;

      let lerpedColor1 = colors[i][j].lerpColor1;
      let lerpedColor2 = colors[i][j].lerpColor2;

      let lerpedColor = lerpColor(lerpedColor1, lerpedColor2, percentX);

      push();
      translate(i * size, j * size);
      rotateX(angle + i * startingAngle + j * startingAngle);
      rotateY(angle);

      // lerpedColor.setAlpha(220);
      fill(lerpedColor);
      
      pg.background(lerpedColor);
      pg.text(chars[count], 0, 100);
      
      
      // pg.fill("white")
      if (isColorTooLight(lerpedColor)) {
        pg.fill("black");
      } else {
        pg.fill("white");
      }
      
      count += 1;
      texture(pg);
      box(size / 2);
      pop();
    }
  }

  // Draw lines connecting adjacent boxes
  strokeWeight(1);
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows; j++) {
      // Connect right
      if (random() > 0.98) {
        drawMessageLine(i * size, j * size, (i + 1) * size, j * size);
      }
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows - 1; j++) {
      // Connect down
      if (random() > 0.98) {
        drawMessageLine(i * size, j * size, i * size, (j + 1) * size);
      }
    }
  }

  angle += 3;
}

function drawMessageLine(x1, y1, x2, y2) {
  
  let messageLength = size * 1; 
  let angle = atan2(y2 - y1, x2 - x1);
  let offsetX = cos(angle) * messageLength;
  let offsetY = sin(angle) * messageLength;

    for (let i = 0; i < 10; i++) {
    let dashLength = messageLength / 10;
    let dashStartX = x1 + offsetX * (i / 10);
    let dashStartY = y1 + offsetY * (i / 10);
    let dashEndX = x1 + offsetX * ((i + 0.5) / 10);
    let dashEndY = y1 + offsetY * ((i + 0.5) / 10);

    line(dashStartX, dashStartY, dashEndX, dashEndY);
    }
  
}

function keyPressed() {
  if(key == 'r'){
    options = {
      unit:"frames",
    }
    saveGif('animation.gif', frames, options);
  }
}

function isColorTooLight(color) {
  // Calculate lightness using the RGB values
  let lightness = (color.levels[0] + color.levels[1] + color.levels[2]) / 3;
  // You can adjust the threshold value based on your preference
  let threshold = 150;
  return lightness > threshold;
}
