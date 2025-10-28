// debug.js - УЛУЧШЕННАЯ ВЕРСИЯ
console.log('🐛 debug.js загружен');

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 🐛 ДЕБАГ ИНФОРМАЦИЯ ===');
    
    const authButton = document.getElementById('authButton');
    const modal = document.getElementById('authModal');
    
    console.log('🔘 Кнопка authButton:', !!authButton);
    console.log('🪟 Модальное окно authModal:', !!modal);
    
    if (authButton) {
        console.log('📝 Текст кнопки:', authButton.textContent);
        console.log('🏷️ HTML кнопки:', authButton.outerHTML);
    }
    
    // Проверяем обработчики после полной загрузки страницы
    setTimeout(() => {
        console.log('=== 🔍 ПРОВЕРКА ОБРАБОТЧИКОВ ===');
        const button = document.getElementById('authButton');
        if (button) {
            console.log('📋 Текст кнопки:', button.textContent);
            console.log('🖱️ onclick функция:', button.onclick);
            console.log('📛 onclick имя:', button.onclick ? button.onclick.name : 'нет');
            console.log('🔧 onclick через getAttribute:', button.getAttribute('onclick'));
            
            // Проверяем обработчики событий
            console.log('🎯 Проверяем click обработчики...');
        }
        
        // Проверяем глобальные функции
        console.log('🌐 Глобальные функции:');
        console.log('  - openAuthModal:', typeof window.openAuthModal);
        console.log('  - logout:', typeof window.logout);
    }, 1500);
});

// Функция для проверки стилей модального окна
window.checkModalStyles = function() {
    const modal = document.getElementById('authModal');
    if (!modal) {
        console.log('❌ Модальное окно не найдено');
        return;
    }
    
    const computedStyle = window.getComputedStyle(modal);
    console.log('=== 🎨 СТИЛИ МОДАЛЬНОГО ОКНА ===');
    console.log('📱 display:', computedStyle.display);
    console.log('👀 visibility:', computedStyle.visibility);
    console.log('⚫ opacity:', computedStyle.opacity);
    console.log('📌 z-index:', computedStyle.zIndex);
    console.log('📍 position:', computedStyle.position);
    console.log('🔲 background-color:', computedStyle.backgroundColor);
};

// Функция для тестирования модального окна
window.testModal = function() {
    console.log('🧪 Тестируем модальное окно...');
    if (typeof window.openAuthModal === 'function') {
        window.openAuthModal();
    } else {
        console.log('❌ openAuthModal не найдена');
    }
};

// Функция для проверки обработчиков
window.checkHandlers = function() {
    console.log('=== 🔧 ПРОВЕРКА ОБРАБОТЧИКОВ ===');
    const button = document.getElementById('authButton');
    if (!button) {
        console.log('❌ Кнопка не найдена');
        return;
    }
    
    console.log('🔘 Кнопка:', button.textContent);
    console.log('🖱️ onclick:', button.onclick);
    console.log('🔧 getAttribute(onclick):', button.getAttribute('onclick'));
    
    // Проверяем есть ли обработчики через addEventListener
    console.log('📋 Все атрибуты кнопки:');
    for (let attr of button.attributes) {
        console.log('  -', attr.name + ':', attr.value);
    }
};

console.log('🐛 debug.js инициализирован, используйте:');
console.log('  - checkModalStyles() - проверить стили модального окна');
console.log('  - testModal() - протестировать открытие модального окна');
console.log('  - checkHandlers() - проверить обработчики кнопки');
console.log('  - debugAuth() - отладочная информация из auth.js');