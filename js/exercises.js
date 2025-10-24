// Функция для проверки упражнений
function checkExercise(exerciseId) {
    console.log('Проверка упражнения:', exerciseId);
    
    let resultDiv, correctAnswerDiv, errorAnalysisDiv, errorListDiv, message, isCorrect;
    
    switch(exerciseId) {
        case 'a1t1-ex1':
            resultDiv = document.getElementById('a1t1-ex1-result');
            correctAnswerDiv = document.getElementById('correct-answer-a1t1-ex1');
            const answersA1T1Ex1 = {
                'a1t1-ex1-1': 'heißen',
                'a1t1-ex1-2': 'heiße',
                'a1t1-ex1-3': 'Freut',
                'a1t1-ex1-4': 'Woher',
                'a1t1-ex1-5': 'aus'
            };
            
            let correctCountA1T1Ex1 = 0;
            let totalQuestionsA1T1Ex1 = Object.keys(answersA1T1Ex1).length;
            
            for (let id in answersA1T1Ex1) {
                const inputElement = document.getElementById(id);
                const userAnswer = normalizeText(inputElement.value);
                if (userAnswer === answersA1T1Ex1[id]) {
                    correctCountA1T1Ex1++;
                    inputElement.style.borderColor = "green";
                } else {
                    inputElement.style.borderColor = "red";
                }
            }
            
            if (correctCountA1T1Ex1 === totalQuestionsA1T1Ex1) {
                message = "Отлично! Все ответы правильные.";
                isCorrect = true;
                if (correctAnswerDiv) correctAnswerDiv.style.display = 'none';
            } else {
                message = `Вы правильно ответили на ${correctCountA1T1Ex1} из ${totalQuestionsA1T1Ex1} вопросов. Попробуйте еще раз!`;
                isCorrect = false;
                if (correctAnswerDiv) correctAnswerDiv.style.display = 'block';
            }
            break;
            
        case 'a1t1-ex2':
            resultDiv = document.getElementById('a1t1-ex2-result');
            correctAnswerDiv = document.getElementById('correct-answer-a1t1-ex2');
            const answersA1T1Ex2 = {
                'a1t1-ex2-1': 'Ich heiße Maria.',
                'a1t1-ex2-2': 'Wie heißt du?',
                'a1t1-ex2-3': 'Ich komme aus Russland.',
                'a1t1-ex2-4': 'Woher kommen Sie?'
            };
            
            let correctCountA1T1Ex2 = 0;
            let totalQuestionsA1T1Ex2 = Object.keys(answersA1T1Ex2).length;
            
            for (let id in answersA1T1Ex2) {
                const userAnswer = document.getElementById(id).value;
                const spellingCheck = checkGermanSpelling(userAnswer, answersA1T1Ex2[id]);
                
                if (spellingCheck.isCorrect) {
                    correctCountA1T1Ex2++;
                    document.getElementById(id).style.borderColor = "green";
                } else {
                    document.getElementById(id).style.borderColor = "red";
                }
            }
            
            if (correctCountA1T1Ex2 === totalQuestionsA1T1Ex2) {
                message = "Превосходно! Все предложения составлены правильно.";
                isCorrect = true;
                if (correctAnswerDiv) correctAnswerDiv.style.display = 'none';
            } else {
                message = `Вы правильно составили ${correctCountA1T1Ex2} из ${totalQuestionsA1T1Ex2} предложений. Обратите внимание на правильное написание (заглавные буквы, пунктуация).`;
                isCorrect = false;
                if (correctAnswerDiv) correctAnswerDiv.style.display = 'block';
            }
            break;
            
        // Добавьте другие упражнения по аналогии
            
        default:
            message = "Упражнение проверено!";
            isCorrect = true;
    }
    
    if (resultDiv) {
        resultDiv.textContent = message;
        resultDiv.className = 'result ' + (isCorrect ? 'correct' : 'incorrect');
        resultDiv.style.display = 'block';
        
        // Обновляем статистику ответов
        updateAnswerStats(isCorrect);
    }
}

// Функция для нормализации текста
function normalizeText(text) {
    return text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\s+$/, '')
        .replace(/^\s+/, '');
}

// Функция для проверки немецкой орфографии (добавьте из levels.js)
function checkGermanSpelling(text, correctAnswer) {
    // ... код из levels.js ...
}

// Функция для обновления статистики ответов
function updateAnswerStats(isCorrect) {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('deutschUsers')) || {};
    
    if (currentUser && users[currentUser]) {
        if (!users[currentUser].stats) {
            users[currentUser].stats = {
                correctAnswers: 0,
                incorrectAnswers: 0,
                totalExercises: 0
            };
        }
        
        if (isCorrect) {
            users[currentUser].stats.correctAnswers++;
        } else {
            users[currentUser].stats.incorrectAnswers++;
        }
        
        users[currentUser].stats.totalExercises++;
        users[currentUser].lastActivity = new Date().toISOString();
        
        localStorage.setItem('deutschUsers', JSON.stringify(users));
    }
}

// Функция для сброса упражнения
function resetExercise(exerciseId) {
    const exerciseElement = document.querySelector(`#${exerciseId}-result`).closest('.exercise');
    
    const inputs = exerciseElement.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '#ddd';
        if (input.type === 'radio') {
            input.checked = false;
        }
        
        if (input.classList.contains('sentence-input')) {
            input.style.width = 'auto';
        }
    });
    
    document.getElementById(`${exerciseId}-result`).style.display = 'none';
    document.getElementById(`correct-answer-${exerciseId}`).style.display = 'none';
    
    const errorAnalysis = document.getElementById(`error-analysis-${exerciseId}`);
    if (errorAnalysis) {
        errorAnalysis.style.display = 'none';
    }
}