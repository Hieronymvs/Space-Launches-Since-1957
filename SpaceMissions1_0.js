// use native Javascript in draw when possible (for performance reasons)
// instead of assigning a specific color to a specific company, use the company name as a 'seed' for the color.
// use the first 3 or 4 characters to determine color from an array
// there are 57 unique names in this file
// display year only once on the spokes
//
// https://www.kaggle.com/datasets/agirlcoding/all-space-missions-from-1957

let quiteaFew;
let rot = 0;
let missionArray= [];
let columnArray=[];

let detailArray=[];

let uiFont;
let _UItext;

const surface =100;
const LEO = 300;
let message = "All space missions from 1957";
let counter =0;
let table;
let yearArray = [];
let  spacing = 150;

let uiOverlay;
let button;
function setup() {

  createCanvas(window.innerWidth - 10, window.innerHeight - 10, WEBGL);
  cursor(CROSS);

  uiOverlay = createGraphics(width, 100);
  //button = createButton('back');

  smooth();
  background(100);
  textFont(uiFont);

  print("quiteaFew: " + quiteaFew );
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');

  print(table.getColumn('Company Name'));

  uiMessage = message.split("");

  let rowCount = table.getRowCount();
  readTable(rowCount);
}



function draw() {
  background(10);
  fill(255);
  drawuiOverlay();
  image(uiOverlay, -0.5*width, 0.5*height-100);

  UI();
  rot += (TAU/360)*0.1;// auto-rotate
  orbits();
  if (mouseIsPressed) {
    rot += (TWO_PI/360)*((mouseX-(0.5*width))/500);
    if (rot <0) rot =0;
  }
}

function orbits() {
  noStroke();
  counter = (quiteaFew/TAU)*rot;
  if (counter >quiteaFew) counter = quiteaFew;

  for (let i = 0; i <  counter; i++) {
    // spacing += 0.5;// increase spacing for spiral

    rotateZ((TAU/counter));

    fill(255);
    push();
    translate(spacing-10, 0, 0);
    box (5);//
    pop();

    // company name
    textSize(10);
    text(detailArray[i], spacing, 0);//


    // launch year
    textSize(16);
    text(yearArray[i], spacing*0.6, 0);//
  }
}

function UI() {
  // Static UI
  rotateY(map(mouseX, 0, width, -2, 2));
  rotateX(map(mouseY, 0, height, -2, 2));

  // Static text
  //fill(150);
  //textSize(42);
  //text("Succesful space launches to date", -width*0.45, height*0.5-50);
  //textSize(12);
  //text("A kaggle dataset: https://www.kaggle.com/datasets/agirlcoding/all-space-missions-from-1957", -width*0.45, height*0.5-30);

  // center globe
  push();
  noFill();
  strokeWeight(0.8);
  stroke(255);
  rotateY(frameCount * 0.005);
  sphere (70);
  pop();

  // curved text
  textSize(18);
  push();
  fill(150);
  rotateZ(-0.65*PI);
  for (let i = 0; i < uiMessage.length; i++) {
    rotateZ(TAU/360*8);
    text(uiMessage[i], 0, -75);
  }
  pop();
  noFill();
  strokeWeight(2);
  stroke(150);
  arc(0, 0, 160, 160, 0.15*PI, 0.85*PI);
}

function drawuiOverlay() {
  //uiOverlay.button.position(0, 0);
  uiOverlay.background(10);
  uiOverlay.fill(150);
  uiOverlay.noStroke();
  uiOverlay.textSize(42);
  uiOverlay.text("active space launches to date", 10, uiOverlay.height*0.5);
  uiOverlay.textSize(12);
  uiOverlay.text("A kaggle dataset: https://www.kaggle.com/datasets/agirlcoding/all-space-missions-from-1957", 10, uiOverlay.height*0.5+20);
  uiOverlay.text("www.atmospherical.net", 10, uiOverlay.height*0.5+40);
  uiOverlay.stroke(150);
  uiOverlay.strokeWeight(2);
  uiOverlay.line (0.01*uiOverlay.width, 2, 0.99*uiOverlay.width, 2);
}

function readTable(rowCount) {
  //alert("This is a string in an alert.");

  // the first launch with 'StatusActive' dates from 1982
  // start at last row to zero or, alternatively, sort CSV in reverse
  // discriminate statusCheck and omit 'StatusRetired' for better performance
  for (let i = rowCount-1; i > 0; i--) {
    var statusCheck = table.getString(i, 6);
    let detailString = table.getString(i, 5);
    //if (statusCheck == "StatusActive"||statusCheck == "StatusRetired") {
    if (statusCheck == "StatusActive") {
      detailArray.push(detailString);
      let v = createVector(Math.random(surface, LEO), Math.random(0, TAU));
      missionArray.push(v);

      let companyString = table.getString(i, 2);

      // string to ascii
      let t0 = companyString.charCodeAt(0)-65;
      let t1 = companyString.charCodeAt(1)-65;
      let t2 = companyString.charCodeAt(2)-65;

      let dateString = table.getString(i, 4);
      let theYear = dateString.substr(12, 4);

      if (yearArray.includes(theYear)) {
        yearArray.push(" ");// a character if no year
      } else yearArray.push(theYear);
    }
  }
  quiteaFew = detailArray.length;
  console.log("quiteaFew:", quiteaFew);
  console.log(" yearArray.length: ", yearArray.length);
}

function preload() {

  table = loadTable('Space_Corrected.csv', 'csv', 'header');
  uiFont = loadFont('assets/consola.ttf');
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");

  //table = loadTable("Space_Corrected.csv", "header");//Processing
}

/*
Loads an opentype font file (.otf, .ttf) from a file or a URL, and returns a PFont Object.
 This method is asynchronous, meaning it may not finish before the next line in your sketch is executed.
 
 The path to the font should be relative to the HTML file that links in your sketch.
 Loading fonts from a URL or other remote location may be blocked due to your browser's built-in security.
 */
