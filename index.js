const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
var inMemCanvas = document.createElement('canvas');
var inMemContext = inMemCanvas.getContext('2d');

// set canvas size
const resizeCanvas = () => {
  inMemCanvas.width = canvas.width;
  inMemCanvas.height = canvas.height;
  inMemContext.drawImage(canvas, 0, 0);
  canvas.height = window.innerHeight * 0.8;
  canvas.width = window.innerWidth * 0.8;
  ctx.drawImage(inMemCanvas, 0, 0);
};
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
//

// user settings
// indicate active tool
const userButtons = document.querySelectorAll('.user-settings-inner a');
const setActive = (e) => {
  userButtons.forEach((button) => {
    button.classList.remove('active');
  });

  e.target.classList.add('active');
};
userButtons.forEach((button) => {
  button.addEventListener('click', setActive);
});

// set color
const brushColorBtn = document.querySelector('#brush-color');
let brushColor = brushColorBtn.value;
const setBrushColor = (e) => {
  brushColor = e.target.value;
  penBtn.classList.add('active');
  eraserBtn.classList.remove('active');
};
brushColorBtn.addEventListener('change', setBrushColor);

// pen active
const penBtn = document.querySelector('.pen-button');

const setPenActive = () => {
  brushColor = brushColorBtn.value;
};
penBtn.addEventListener('click', setPenActive);

// eraser

const eraserBtn = document.querySelector('.eraser-button');
eraserBtn.addEventListener('click', () => {
  brushColor = '#FFFFFF';
  console.log(brushColor);
});

// size
const brushSizeBtn = document.querySelector('.brush-size-button');
const brushSizeSlider = document.querySelector('#brush-size');
const sliderDiv = document.querySelector('.brush-size-menu');
let brushSize = 10;

const setBrushSize = (e) => {
  brushSize = e.target.value;
};
const toggleSizeSlider = () => {
  if (sliderDiv.classList.contains('open')) {
    brushSizeBtn.classList.remove('active');
    sliderDiv.classList.remove('open');
  } else {
    sliderDiv.classList.add('open');
  }
};
const closeSizeSlider = () => {
  sliderDiv.classList.remove('open');
  brushSizeBtn.classList.remove('active');

  if (brushColor === '#FFFFFF') {
    eraserBtn.classList.add('active');
  } else {
    penBtn.classList.add('active');
  }
};

brushSizeSlider.addEventListener('change', setBrushSize);
brushSizeSlider.addEventListener('blur', closeSizeSlider);
brushSizeBtn.addEventListener('click', toggleSizeSlider);

//

// painting events

const getMousePos = (e) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

let paint = false;
const startStroke = (e) => {
  paint = true;
  extendStroke(e);
};
const endStroke = () => {
  paint = false;
  ctx.beginPath();
};
const extendStroke = (e) => {
  var mouse = getMousePos(e);

  if (paint == false) return;

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);
};

canvas.addEventListener('mousedown', startStroke);
canvas.addEventListener('mousemove', extendStroke);
canvas.addEventListener('mouseup', endStroke);

// cursor
const cursor = document.querySelector('#cursor');

const setMousePos = (e) => {
  cursor.style.top = `${e.pageY - brushSize / 2}px`;
  cursor.style.left = `${e.pageX - brushSize / 2}px`;
  cursor.style.width = `${brushSize}px`;
  cursor.style.height = `${brushSize}px`;
};

canvas.addEventListener('mousemove', setMousePos);
canvas.addEventListener('mouseout', () => {
  cursor.style.opacity = 0;
  paint = false;
  ctx.beginPath();
});
canvas.addEventListener('mouseover', () => {
  cursor.style.opacity = 1;
});
