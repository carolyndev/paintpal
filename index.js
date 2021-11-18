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
const userButtons = document.querySelectorAll('.user-input');
const setActive = (e) => {
  userButtons.forEach((button) => {
    button.classList.remove('active');
  });
  e.target.classList.add('active');
};
userButtons.forEach((button) => {
  button.addEventListener('click', setActive);
  button.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    setActive(e);
  });
});

// set pen active
const penBtn = document.querySelector('.pen-button');
const setPenActive = () => {
  brushColor = brushColorBtn.value;
};
penBtn.addEventListener('click', setPenActive);
penBtn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  setPenActive(e);
});

// set eraser active
const eraserBtn = document.querySelector('.eraser-button');
eraserBtn.addEventListener('click', () => {
  brushColor = '#FFFFFF';
});
eraserBtn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  brushColor = '#FFFFFF';
});

// set brush size
const brushSizeBtn = document.querySelector('.brush-size-button');
const brushSizeSlider = document.querySelector('#brush-size');
const sliderDiv = document.querySelector('.brush-size-menu');
let brushSize = 10;

const setBrushSize = (e) => {
  brushSize = e.target.value;
};
const toggleSizeSlider = (e) => {
  if (sliderDiv.classList.contains('open')) {
    // brushSizeBtn.classList.remove('active');
    sliderDiv.classList.remove('open');

    if (brushColor === '#FFFFFF') {
      eraserBtn.classList.add('active');
    } else {
      penBtn.classList.add('active');
    }
  } else {
    sliderDiv.classList.add('open');
    brushSizeSlider.focus();
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

brushSizeBtn.addEventListener('click', toggleSizeSlider);
brushSizeBtn.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;
  toggleSizeSlider(e);
});
brushSizeSlider.addEventListener('change', setBrushSize);
brushSizeSlider.addEventListener('blur', closeSizeSlider);

// set color
const brushColorBtn = document.querySelector('#brush-color');
let brushColor = brushColorBtn.value;
const setBrushColor = (e) => {
  brushColor = e.target.value;
  penBtn.classList.add('active');
  eraserBtn.classList.remove('active');
};
brushColorBtn.addEventListener('input', setBrushColor);

// set stencil
const stencilBtn = document.querySelector('.stencil-button');
const stencilMenu = document.querySelector('.stencil-menu');
const stencilSelect = document.querySelector('#stencil-select');

const toggleStencilSelect = (e) => {
  if (stencilMenu.classList.contains('open')) {
    stencilMenu.classList.remove('open');

    if (brushColor === '#FFFFFF') {
      eraserBtn.classList.add('active');
    } else {
      penBtn.classList.add('active');
    }
  } else {
    stencilMenu.classList.add('open');
    stencilSelect.focus();
  }
};

const closeStencilSelect = (e) => {
  stencilMenu.classList.remove('open');
  stencilBtn.classList.remove('active');

  if (brushColor === '#FFFFFF') {
    eraserBtn.classList.add('active');
  } else {
    penBtn.classList.add('active');
  }
};

stencilBtn.addEventListener('click', toggleStencilSelect);
stencilBtn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  toggleStencilSelect(e);
});
stencilSelect.addEventListener('blur', closeStencilSelect);

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

// canvas cursor
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
