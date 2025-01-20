const cube = document.getElementById('cube');
const poemDisplay = document.getElementById('poem-display');
const instructions = document.getElementById('instructions');
let rotationX = -30;
let rotationY = 45;
let isDragging = false;
let draggedCell = null;
let startX, startY;
let lastX, lastY;
let isTouching = false;

const haikus = [
    ['viejo', 'estanque', 'una', 'rana', 'salta', 'el', 'sonido', 'del', 'agua'],
    ['brisa', 'de', 'primavera', 'el', 'sauce', 'acaricia', 'el', 'agua', 'lenta'],
    ['atardecer', 'de', 'otoño', 'el', 'cuervo', 'se', 'posa', 'en', 'silencio'],
    ['luna', 'de', 'invierno', 'sombras', 'se', 'alargan', 'sobre', 'la', 'nieve'],
    ['noche', 'de', 'verano', 'el', 'canto', 'de', 'las', 'cigarras', 'cesa'],
    ['hojas', 'caen', 'silenciosas', 'el', 'viento', 'susurra', 'secretos', 'del', 'bosque']
];

function updateCubeRotation() {
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function resetCube() {
    rotationX = -30;
    rotationY = 45;
    updateCubeRotation();
    initializeCube();
}

function startDragging(e) {
    if (e.target.classList.contains('word-cell')) {
        isDragging = true;
        draggedCell = e.target;
        draggedCell.classList.add('dragging');
    }
}

function stopDragging(e) {
    if (isDragging) {
        isDragging = false;
        draggedCell.classList.remove('dragging');
        const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
        if (dropTarget === poemDisplay || poemDisplay.contains(dropTarget)) {
            addWordToPoem(draggedCell.textContent);
        } else if (dropTarget && dropTarget.classList.contains('word-cell') && dropTarget !== draggedCell) {
            swapCells(draggedCell, dropTarget);
        }
        draggedCell = null;
    }
}

function dragCell(e) {
    if (isDragging) {
        e.preventDefault();
    }
}

function handleTouchStart(e) {
    if (e.target.classList.contains('word-cell')) {
        e.preventDefault();
        isTouching = true;
        draggedCell = e.target;
        draggedCell.classList.add('dragging');
        
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        lastX = startX;
        lastY = startY;
    }
}

function handleTouchMove(e) {
    if (isTouching) {
        e.preventDefault();
        const touch = e.touches[0];
        
        if (draggedCell) {
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            lastX = currentX;
            lastY = currentY;
        } else {
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            rotationY += deltaX * 0.5;
            rotationX += deltaY * 0.5;
            
            updateCubeRotation();
            
            startX = touch.clientX;
            startY = touch.clientY;
        }
    }
}

function handleTouchEnd(e) {
    if (isTouching && draggedCell) {
        e.preventDefault();
        const endTouch = document.elementFromPoint(lastX, lastY);
        draggedCell.classList.remove('dragging');
        
        if (endTouch === poemDisplay || poemDisplay.contains(endTouch)) {
            addWordToPoem(draggedCell.textContent);
        } else if (endTouch && endTouch.classList.contains('word-cell') && endTouch !== draggedCell) {
            swapCells(draggedCell, endTouch);
        }
        
        draggedCell = null;
    }
    isTouching = false;
}

function swapCells(cell1, cell2) {
    const temp = cell1.textContent;
    cell1.textContent = cell2.textContent;
    cell2.textContent = temp;
}

function shuffleWords() {
    const allCells = Array.from(document.querySelectorAll('.word-cell'));
    const allWords = allCells.map(cell => cell.textContent);
    
    for (let i = allWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    
    allCells.forEach((cell, index) => {
        cell.textContent = allWords[index];
    });
}

function addWordToPoem(word) {
    if (poemDisplay.firstChild.textContent === 'Arrastre palabras aquí para crear su haiku') {
        poemDisplay.innerHTML = '';
    }
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word + ' ';
    poemDisplay.appendChild(wordSpan);
}

function clearPoem() {
    poemDisplay.innerHTML = '<p>Arrastre palabras aquí para crear su haiku</p>';
}

function initializeCube() {
    const faces = document.querySelectorAll('.face');
    faces.forEach((face, index) => {
        face.innerHTML = '';
        const haiku = haikus[index];
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('word-cell');
            cell.textContent = haiku[i];
            face.appendChild(cell);
        }
    });
}

// Event Listeners
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: false });

document.addEventListener('mousedown', startDragging);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('mousemove', dragCell);

document.addEventListener('keydown', (e) => {
    const rotationSpeed = 5;
    switch(e.key) {
        case 'ArrowLeft':
            rotationY -= rotationSpeed;
            break;
        case 'ArrowRight':
            rotationY += rotationSpeed;
            break;
        case 'ArrowUp':
            rotationX -= rotationSpeed;
            break;
        case 'ArrowDown':
            rotationX += rotationSpeed;
            break;
    }
    updateCubeRotation();
});

// Initialize
initializeCube();
