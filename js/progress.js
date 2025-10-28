// Система прогресса
let progress = {
    a1: { completed: 0, total: 15, topics: {} },
    a2: { completed: 0, total: 15, topics: {} },
    b1: { completed: 0, total: 15, topics: {} },
    b2: { completed: 0, total: 15, topics: {} },
    c1: { completed: 0, total: 15, topics: {} }
};

// Загрузка прогресса
function loadProgress() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('deutschUsers')) || {};
    
    if (currentUser && users[currentUser]) {
        const userProgress = users[currentUser].progress;
        if (userProgress) {
            progress = userProgress;
        }
    } else {
        const savedProgress = localStorage.getItem('deutschLernenProgress');
        if (savedProgress) {
            progress = JSON.parse(savedProgress);
        }
    }
    updateProgressDisplay();
}

// Сохранение прогресса
function saveProgress() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('deutschUsers')) || {};
    
    if (currentUser && users[currentUser]) {
        users[currentUser].progress = progress;
        localStorage.setItem('deutschUsers', JSON.stringify(users));
    } else {
        localStorage.setItem('deutschLernenProgress', JSON.stringify(progress));
    }
}

// Отметить тему как пройденную
function markTopicComplete(topicId) {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('deutschUsers')) || {};
    
    if (!currentUser || !users[currentUser]) {
        alert('Пожалуйста, войдите в систему, чтобы сохранять прогресс!');
        return;
    }
    
    const level = topicId.split('-')[0];
    const topic = topicId;
    
    if (!users[currentUser].progress[level].topics[topic]) {
        users[currentUser].progress[level].topics[topic] = true;
        users[currentUser].progress[level].completed++;
        
        users[currentUser].lastActivity = new Date().toISOString();
        
        localStorage.setItem('deutschUsers', JSON.stringify(users));
        updateProgressDisplay();
        alert('Тема отмечена как пройденная! Ваш прогресс обновлен.');
        
        const topicProgressElement = document.getElementById(`progress-${topicId}`);
        if (topicProgressElement) {
            topicProgressElement.style.width = '100%';
        }
    } else {
        alert('Эта тема уже отмечена как пройденная.');
    }
}

// Обновление отображения прогресса
function updateProgressDisplay() {
    const totalTopics = 75;
    let completedTopics = 0;
    
    for (let level in progress) {
        completedTopics += progress[level].completed;
        
        const levelPercent = Math.round((progress[level].completed / progress[level].total) * 100);
        const progressElement = document.getElementById(`${level}-progress`);
        if (progressElement) {
            progressElement.textContent = `${levelPercent}%`;
        }
        
        const detailElement = document.getElementById(`detail-${level}`);
        if (detailElement) {
            detailElement.textContent = `${levelPercent}%`;
        }
    }
    
    const overallPercent = Math.round((completedTopics / totalTopics) * 100);
    const overallProgressElement = document.getElementById('overall-progress');
    if (overallProgressElement) {
        overallProgressElement.style.width = `${overallPercent}%`;
    }
    
    const overallProgressTextElement = document.getElementById('overall-progress-text');
    if (overallProgressTextElement) {
        overallProgressTextElement.textContent = `${overallPercent}% завершено`;
    }
    
    updateDashboard();
}

// Обновление дашборда
function updateDashboard() {
    let totalTopics = 0;
    let completedTopics = 0;
    
    for (let level in progress) {
        completedTopics += progress[level].completed;
        totalTopics += progress[level].total;
    }
    
    const totalTopicsCompletedElement = document.getElementById('totalTopicsCompleted');
    if (totalTopicsCompletedElement) {
        totalTopicsCompletedElement.textContent = completedTopics;
    }
    
    const totalExercisesCompletedElement = document.getElementById('totalExercisesCompleted');
    if (totalExercisesCompletedElement) {
        totalExercisesCompletedElement.textContent = completedTopics * 4;
    }
}

// Функция для обновления активности пользователя
function updateUserActivity() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('deutschUsers')) || {};
    
    if (currentUser && users[currentUser]) {
        users[currentUser].lastActivity = new Date().toISOString();
        
        const lastActivity = new Date(users[currentUser].lastActivity);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (!users[currentUser].currentStreak) {
            users[currentUser].currentStreak = 1;
        } else {
            const lastActivityDate = new Date(users[currentUser].lastActivity);
            lastActivityDate.setHours(0, 0, 0, 0);
            yesterday.setHours(0, 0, 0, 0);
            
            if (lastActivityDate.getTime() === yesterday.getTime()) {
                users[currentUser].currentStreak++;
            } else if (lastActivityDate.getTime() < yesterday.getTime()) {
                users[currentUser].currentStreak = 1;
            }
        }
        
        localStorage.setItem('deutschUsers', JSON.stringify(users));
    }
}

// Функция для обновления прогресса уровней на главной странице
function updateLevelsProgress() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('deutschUsers')) || {};
    
    const progressElements = document.querySelectorAll('.level-progress');
    
    if (currentUser && users[currentUser] && users[currentUser].progress) {
        const progress = users[currentUser].progress;
        
        progressElements.forEach(element => {
            element.style.display = 'block';
        });
        
        for (let level in progress) {
            const levelProgress = progress[level];
            const percent = Math.round((levelProgress.completed / levelProgress.total) * 100);
            
            const progressElement = document.getElementById(`${level}-progress`);
            if (progressElement) {
                progressElement.textContent = `${percent}%`;
                
                if (percent === 100) {
                    progressElement.style.backgroundColor = 'var(--green)';
                    progressElement.style.color = 'var(--white)';
                } else if (percent >= 50) {
                    progressElement.style.backgroundColor = 'var(--yellow)';
                    progressElement.style.color = 'var(--black)';
                } else {
                    progressElement.style.backgroundColor = '#f8f9fa';
                    progressElement.style.color = 'var(--dark-gray)';
                }
            }
        }
    } else {
        progressElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

// Инициализация прогресса
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUserActivity();
});