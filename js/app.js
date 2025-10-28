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
function showLessonCompleteNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification warning';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🎓</span>
            <div class="notification-body">
                <div class="notification-title">Урок завершен</div>
                <div class="notification-text">Урок успешно завершен!</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    notification.addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}
function completeLesson() {
    // Ваша логика завершения урока
    showLessonCompleteNotification();
}
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}</span>
            <div class="notification-body">
                <div class="notification-text">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    notification.addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

function showLessonCompleteNotification() {
    showNotification('Урок успешно завершен!', 'warning');
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'block';
        // Если есть функция из auth.js - используем ее
        if (typeof window.setupAuthModal === 'function') {
            window.setupAuthModal();
        }
    }
}