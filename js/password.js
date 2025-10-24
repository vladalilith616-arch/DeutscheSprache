// Обработчик смены пароля
document.addEventListener('DOMContentLoaded', function() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearPasswordErrors();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            const currentUser = localStorage.getItem('currentUser');
            const users = JSON.parse(localStorage.getItem('deutschUsers')) || {};
            
            if (!currentUser || !users[currentUser]) {
                showPasswordError('currentPassword', 'Ошибка: пользователь не найден!');
                return;
            }
            
            // Проверка текущего пароля
            if (users[currentUser].password !== currentPassword) {
                showPasswordError('currentPassword', 'Текущий пароль неверен!');
                return;
            }
            
            // Проверка длины нового пароля
            if (newPassword.length < 4) {
                showPasswordError('newPassword', 'Новый пароль должен содержать минимум 4 символа!');
                return;
            }
            
            // Проверка совпадения новых паролей
            if (newPassword !== confirmNewPassword) {
                showPasswordError('confirmNewPassword', 'Новые пароли не совпадают!');
                return;
            }
            
            // Сохранение нового пароля
            users[currentUser].password = newPassword;
            localStorage.setItem('deutschUsers', JSON.stringify(users));
            
            showPasswordSuccess('Пароль успешно изменен!');
            changePasswordForm.reset();
        });
    }
});

function showPasswordError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (input && errorElement) {
        input.classList.add('input-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearPasswordErrors() {
    const errorElements = document.querySelectorAll('#changePasswordForm .error-message');
    const inputs = document.querySelectorAll('#changePasswordForm input');
    
    errorElements.forEach(error => {
        error.style.display = 'none';
    });
    
    inputs.forEach(input => {
        input.classList.remove('input-error');
    });
}

function showPasswordSuccess(message) {
    // Создаем или находим элемент для сообщения об успехе
    let successElement = document.getElementById('passwordSuccessMessage');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.id = 'passwordSuccessMessage';
        successElement.className = 'success-message';
        document.querySelector('.password-change-container').prepend(successElement);
    }
    
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}