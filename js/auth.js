// auth.js - ФИНАЛЬНАЯ ВЕРСИЯ
console.log('🔐 auth.js загружен!');

let currentUser = null;
let users = {};

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

function loadData() {
    console.log('📂 Загружаем данные...');
    const savedUsers = localStorage.getItem('deutschUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
        console.log('👥 Найдены пользователи:', Object.keys(users));
    }
    
    currentUser = localStorage.getItem('currentUser');
    console.log('👤 Текущий пользователь:', currentUser);
}

function saveData() {
    localStorage.setItem('deutschUsers', JSON.stringify(users));
    if (currentUser) {
        localStorage.setItem('currentUser', currentUser);
    }
}

// ==================== АВТОРИЗАЦИЯ ====================

function login(username, password) {
    console.log('🔑 Попытка входа для пользователя:', username);
    
    clearAuthErrors('login');
    
    let isValid = true;
    if (!username) {
        showFieldError('loginUsername', 'Введите имя пользователя');
        isValid = false;
    }
    if (!password) {
        showFieldError('loginPassword', 'Введите пароль');
        isValid = false;
    }
    if (!isValid) return false;
    
    if (!users[username]) {
        showFieldError('loginUsername', 'Пользователь не найден');
        return false;
    }
    
    if (users[username].password !== password) {
        showFieldError('loginPassword', 'Неверный пароль');
        return false;
    }
    
    currentUser = username;
    saveData();
    console.log('✅ Успешный вход!');
    
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    
    updateAuthInterface();
    showNotification('Добро пожаловать, ' + username + '!', 'success');
    
	setTimeout(() => {
        console.log('🔄 Перезагружаем страницу после входа...');
        window.location.reload();
    }, 1500);
	
    return true;
}

function register(username, password, confirmPassword) {
    console.log('📝 Попытка регистрации пользователя:', username);
    
    clearAuthErrors('register');
    
    let isValid = true;
    if (!username) {
        showFieldError('registerUsername', 'Введите имя пользователя');
        isValid = false;
    } else if (username.length < 3) {
        showFieldError('registerUsername', 'Имя пользователя должно быть не менее 3 символов');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('registerPassword', 'Введите пароль');
        isValid = false;
    } else if (password.length < 4) {
        showFieldError('registerPassword', 'Пароль должен быть не менее 4 символов');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showFieldError('confirmPassword', 'Подтвердите пароль');
        isValid = false;
    } else if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Пароли не совпадают');
        isValid = false;
    }
    
    if (!isValid) return false;
    
    if (users[username]) {
        showFieldError('registerUsername', 'Пользователь уже существует');
        return false;
    }
    
    users[username] = {
        password: password,
        joinDate: new Date().toISOString(),
        progress: {
            a1: { completed: 0, total: 15, topics: {} },
            a2: { completed: 0, total: 15, topics: {} },
            b1: { completed: 0, total: 15, topics: {} },
            b2: { completed: 0, total: 15, topics: {} },
            c1: { completed: 0, total: 15, topics: {} },
            c2: { completed: 0, total: 15, topics: {} }
        },
        stats: {
            correctAnswers: 0,
            incorrectAnswers: 0,
            totalExercises: 0
        }
    };
    
    currentUser = username;
    saveData();
    console.log('✅ Успешная регистрация!');
    
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.reset();
    
    updateAuthInterface();
    showNotification('Регистрация успешна! Добро пожаловать, ' + username + '!', 'success');
    
    return true;
}

// ==================== ИНТЕРФЕЙС ====================

function updateAuthInterface() {
    console.log('🔄 Обновляем интерфейс... currentUser:', currentUser);
    
    const authButton = document.getElementById('authButton');
    const userInfo = document.getElementById('userInfo');
    
    if (!authButton) return;
    
    // Пересоздаем кнопку чтобы убрать старые обработчики
    const newButton = authButton.cloneNode(true);
    authButton.parentNode.replaceChild(newButton, authButton);
    
    const cleanButton = document.getElementById('authButton');
    
    if (currentUser) {
        console.log('👤 Показываем состояние: ВОЙДЕНО');
        if (userInfo) {
            userInfo.style.display = 'flex';
            const userNameElement = document.getElementById('userName');
            const userAvatarElement = document.getElementById('userAvatar');
            
            if (userNameElement) userNameElement.textContent = currentUser;
            if (userAvatarElement) userAvatarElement.textContent = currentUser.charAt(0).toUpperCase();
        }
        cleanButton.textContent = 'Выйти';
        cleanButton.onclick = showLogoutConfirmation;
        
    } else {
        console.log('🚪 Показываем состояние: НЕ ВОЙДЕНО');
        if (userInfo) userInfo.style.display = 'none';
        cleanButton.textContent = 'Войти';
        cleanButton.onclick = openAuthModal;
    }
	if (typeof updateLevelsProgress === 'function') {
        updateLevelsProgress();
    }
    if (typeof updateMainPageProgress === 'function') {
        updateMainPageProgress();
    }
}

// ==================== ВЫХОД ИЗ СИСТЕМЫ ====================

function showLogoutConfirmation() {
    console.log('🚪 Показываем подтверждение выхода');
    
    // Удаляем существующее модальное окно, если есть
    const existingModal = document.getElementById('logoutConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.id = 'logoutConfirmModal';
    modal.className = 'modal';
    
    // HTML структура модального окна
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="notification-icon">🚪</span>
                <h2>Подтверждение выхода</h2>
            </div>
            <p>Вы уверены, что хотите выйти из аккаунта?</p>
            <div class="form-actions">
                <button id="confirmLogoutBtn" class="btn btn-red">Да, выйти</button>
                <button id="cancelLogoutBtn" class="btn">Отмена</button>
            </div>
        </div>
    `;
    
    // Добавляем на страницу
    document.body.appendChild(modal);
    
    // Показываем с анимацией
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Обработчики кнопок
    document.getElementById('confirmLogoutBtn').onclick = function(e) {
        e.preventDefault();
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            performLogout();
        }, 300);
    };
    
    document.getElementById('cancelLogoutBtn').onclick = function(e) {
        e.preventDefault();
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    };
    
    // Закрытие по клику вне окна
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };
    
    // Закрытие по ESC
    const keyHandler = function(event) {
        if (event.key === 'Escape') {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                document.removeEventListener('keydown', keyHandler);
            }, 300);
        }
    };
    
    document.addEventListener('keydown', keyHandler);
}

function showAuthRequiredNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification warning';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🔒</span>
            <div class="notification-body">
                <div class="notification-title">Требуется авторизация</div>
                <div class="notification-text">Для доступа к этому разделу необходимо войти в систему</div>
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
    
    // При клике переходим к авторизации
    notification.addEventListener('click', function() {
        openAuthModal();
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

function performLogout() {
    console.log('✅ Выполняем выход из системы');
    const oldUser = currentUser;
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    updateAuthInterface();
    showLogoutNotification(oldUser);
	
	setTimeout(() => {
        console.log('🔄 Перезагружаем страницу после выхода...');
        window.location.reload();
    }, 1500);
}

function showLogoutNotification(username) {
    const notification = document.createElement('div');
    notification.className = 'notification logout';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🚪</span>
            <div class="notification-body">
                <div class="notification-title">Выход из системы</div>
                <div class="notification-text">Вы вышли из аккаунта ${username ? username : ''}</div>
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

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (input && errorElement) {
        input.classList.add('input-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearAuthErrors(formType) {
    const fields = formType === 'login' 
        ? ['loginUsername', 'loginPassword'] 
        : ['registerUsername', 'registerPassword', 'confirmPassword'];
    
    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (input) input.classList.remove('input-error');
        if (errorElement) errorElement.style.display = 'none';
    });
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = 'block';
    setupAuthModal();
}

function setupAuthModal() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeAuthModal');
    
    if (!modal) return;
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    const tabs = document.querySelectorAll('.modal-tab');
    tabs.forEach(tab => {
        tab.onclick = function() {
            const tabName = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const activeTab = document.getElementById(tabName + 'Tab');
            if (activeTab) {
                activeTab.classList.add('active');
            }
        };
    });
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (login(username, password)) {
                modal.style.display = 'none';
                loginForm.reset();
            }
        };
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.onsubmit = function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (register(username, password, confirmPassword)) {
                modal.style.display = 'none';
                registerForm.reset();
            }
        };
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
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

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация auth system...');
    loadData();
    updateAuthInterface();
});

// ГЛОБАЛЬНЫЕ ФУНКЦИИ
window.openAuthModal = openAuthModal;
window.logout = showLogoutConfirmation;
window.updateAuthInterface = updateAuthInterface;
window.login = login;
window.register = register;