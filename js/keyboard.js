// Функции для немецкой клавиатуры
let activeInput = null;
let isCapsLock = false;
let isShiftPressed = false;

function toggleKeyboard() {
    const keyboard = document.getElementById('keyboard');
    if (keyboard.style.display === 'block') {
        keyboard.style.display = 'none';
    } else {
        keyboard.style.display = 'block';
    }
}

function setupKeyboard() {
    const keyboardKeys = document.querySelectorAll('.keyboard-key');
    const inputs = document.querySelectorAll('input, textarea');
    
    // Обработка фокуса на полях ввода
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            activeInput = this;
        });
        
        input.addEventListener('blur', function() {
            setTimeout(() => {
                activeInput = null;
            }, 200);
        });
    });
    
    // Обработка кликов по клавишам
    keyboardKeys.forEach(key => {
        key.addEventListener('click', function(e) {
            e.preventDefault();
            if (!activeInput) return;
            
            const keyValue = this.getAttribute('data-key');
            
            if (keyValue === 'backspace') {
                activeInput.value = activeInput.value.slice(0, -1);
            } else if (keyValue === 'space') {
                activeInput.value += ' ';
            } else if (keyValue === 'clear') {
                activeInput.value = '';
            } else if (keyValue === 'enter') {
                activeInput.value += '\n';
            } else if (keyValue === 'caps') {
                isCapsLock = !isCapsLock;
                this.classList.toggle('active', isCapsLock);
            } else if (keyValue === 'shift') {
                isShiftPressed = !isShiftPressed;
                this.classList.toggle('active', isShiftPressed);
            } else {
                let charToAdd = keyValue;
                
                if (isCapsLock || isShiftPressed) {
                    charToAdd = charToAdd.toUpperCase();
                }
                
                activeInput.value += charToAdd;
                
                if (isShiftPressed && keyValue !== 'shift') {
                    isShiftPressed = false;
                    document.querySelectorAll('.keyboard-key[data-key="shift"]').forEach(shiftKey => {
                        shiftKey.classList.remove('active');
                    });
                }
            }
            
            activeInput.focus();
            activeInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            if (activeInput.classList.contains('sentence-input')) {
                resizeInput(activeInput);
            }
        });
    });
    
    // Закрытие клавиатуры при клике вне её
    document.addEventListener('click', function(e) {
        const keyboard = document.getElementById('keyboard');
        const keyboardToggle = document.querySelector('.keyboard-toggle');
        if (keyboard && 
            !keyboard.contains(e.target) && 
            e.target !== keyboardToggle) {
            keyboard.style.display = 'none';
        }
    });
}

// Функция для адаптивного изменения размера поля ввода
function resizeInput(input) {
    input.style.width = 'auto';
    input.style.width = (input.scrollWidth + 10) + 'px';
}

// Инициализация клавиатуры
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboard();
    
    // Инициализация авто-расширения полей ввода
    document.querySelectorAll('.sentence-input').forEach(input => {
        resizeInput(input);
        input.addEventListener('input', function() {
            resizeInput(this);
        });
    });
});