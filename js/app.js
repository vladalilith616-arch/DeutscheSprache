// Базовая инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Проверяем авторизацию через auth.js
    checkAuthStatus();
    
    // Настраиваем общие элементы
    setupCommonElements();
    
    // Обновляем прогресс уровней на главной
    if (typeof updateLevelsProgress === 'function') {
        updateLevelsProgress();
    }
}


function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && typeof updateAuthInterface === 'function') {
        // Используем функцию из auth.js вместо своей
        updateAuthInterface();
    }
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('currentUser');
        window.location.reload();
    }
}

function setupCommonElements() {
    // Настраиваем кнопку "Наверх"
    setupScrollToTop();
    
    // Настраиваем плавную прокрутку
    setupSmoothScroll();
}

function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('nav a, .btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}