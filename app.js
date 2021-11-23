const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
var inMemCanvas = document.createElement('canvas');
var inMemContext = inMemCanvas.getContext('2d');

// set canvas size
const resizeCanvas = () => {
  // redraws on resize
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
  if (e.target.classList.contains('reset-button')) {
    setTimeout(returnToTool, 100);
  }
};
userButtons.forEach((button) => {
  button.addEventListener('click', setActive);
  button.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    setActive(e);
  });
});

// return to most recent tool
const returnToTool = () => {
  if (typeof brushColor !== 'string') {
    patternBtn.classList.add('active');
  } else if (brushColor === '#FFFFFF') {
    eraserBtn.classList.add('active');
  } else {
    penBtn.classList.add('active');
  }
};

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
    closeSizeSlider(e);
  } else {
    sliderDiv.classList.add('open');
    brushSizeSlider.focus();
  }
};
const closeSizeSlider = () => {
  sliderDiv.classList.remove('open');
  brushSizeBtn.classList.remove('active');
  returnToTool();
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
    closeStencilSelect();
  } else {
    stencilMenu.classList.add('open');
    stencilSelect.focus();
  }
};

const closeStencilSelect = (e) => {
  stencilMenu.classList.remove('open');
  stencilBtn.classList.remove('active');
  returnToTool();
};

const setStencil = (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (e.target.value === 'blank') {
    canvas.style.backgroundImage = 'none';
  } else {
    canvas.style.backgroundImage = `url(./images/${e.target.value}.jpeg`;
  }
  closeStencilSelect(e);
};

stencilBtn.addEventListener('click', toggleStencilSelect);
stencilBtn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  toggleStencilSelect(e);
});
stencilSelect.addEventListener('blur', closeStencilSelect);
stencilSelect.addEventListener('change', setStencil);

// set brush pattern
const paintbrushIcon = document.querySelector('#paintbrush-icon');
const paintbrush = ctx.createPattern(paintbrushIcon, 'repeat');
const starIcon = document.querySelector('#star-icon');
const star = ctx.createPattern(starIcon, 'repeat');
const fireIcon = document.querySelector('#fire-icon');
const fire = ctx.createPattern(fireIcon, 'repeat');
const cloverIcon = document.querySelector('#clover-icon');
const clover = ctx.createPattern(cloverIcon, 'repeat');

const patternBtn = document.querySelector('.pattern-button');
const patternMenu = document.querySelector('.pattern-menu');
const patternSelect = document.querySelector('#pattern-select');

const togglePatternMenu = (e) => {
  if (patternMenu.classList.contains('open')) {
    closePatternSelect();
  } else {
    patternMenu.classList.add('open');
    patternSelect.focus();
  }
};

const closePatternSelect = (e) => {
  patternMenu.classList.remove('open');
  patternBtn.classList.remove('active');
  returnToTool();
};

const setPattern = (e) => {
  if (e.target.value === 'none') {
    brushColor = brushColorBtn.value;
  } else {
    patternChoice = e.target.value;
    brushColor = eval(patternChoice);
  }
  closePatternSelect(e);
};

patternBtn.addEventListener('click', togglePatternMenu);
patternBtn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  togglePatternMenu(e);
});
patternSelect.addEventListener('change', setPattern);
patternSelect.addEventListener('blur', closePatternSelect);

// reset canvas
const resetBtn = document.querySelector('.reset-button');

const clearCanvas = (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

resetBtn.addEventListener('click', clearCanvas);
resetBtn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  clearCanvas(e);
});

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

// cursor leaves canvas
canvas.addEventListener('mouseout', () => {
  cursor.style.opacity = 0;
  window.addEventListener('mouseup', () => {
    paint = false;
  });
  ctx.beginPath();
});
canvas.addEventListener('mouseover', () => {
  cursor.style.opacity = 1;
});
