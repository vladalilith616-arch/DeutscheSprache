// Функции для работы с уровнями и темами
function showTopic(topicId) {
    document.querySelectorAll('.topic-container').forEach(container => {
        container.classList.remove('active-topic');
    });
    
    document.getElementById(topicId).classList.add('active-topic');
    
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function nextTopic(level) {
    const currentTopic = document.querySelector('.topic-container.active-topic');
    const nextTopic = currentTopic.nextElementSibling;
    
    if (nextTopic && nextTopic.classList.contains('topic-container')) {
        const topicId = nextTopic.id;
        document.querySelector(`.topic-btn[onclick="showTopic('${topicId}')"]`).click();
    } else {
        alert('Это последняя тема в данном уровне.');
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

// Функция для проверки немецкой орфографии
function checkGermanSpelling(text, correctAnswer) {
    const normalizedText = normalizeText(text);
    const normalizedCorrect = normalizeText(correctAnswer);
    
    if (normalizedText === normalizedCorrect) {
        return { isCorrect: true, errors: [] };
    }
    
    const errors = [];
    
    // Проверка заглавной буквы в начале предложения
    if (text.length > 0 && text[0] !== text[0].toUpperCase()) {
        errors.push({
            type: 'capitalization',
            message: 'Предложение должно начинаться с заглавной буквы.',
            example: `Вместо: "${text}" -> "${text.charAt(0).toUpperCase() + text.slice(1)}"`
        });
    }
    
    // Проверка заглавных букв для существительных, имен, стран, городов
    const mustBeCapitalized = [
        'Ich', 'Maria', 'Thomas', 'Anna', 'Max', 'Julia', 'Peter', 'Lisa',
        'Deutschland', 'Russland', 'Berlin', 'Moskau', 'Frankreich', 'Paris',
        'Haus', 'Buch', 'Tisch', 'Stuhl', 'Auto', 'Schule', 'Lehrer'
    ];
    
    mustBeCapitalized.forEach(word => {
        if (text.toLowerCase().includes(word.toLowerCase()) && 
            !text.includes(word)) {
            errors.push({
                type: 'capitalization',
                message: `"${word}" должно писаться с заглавной буквы.`,
                example: `Вместо: "${word.toLowerCase()}" -> "${word}"`
            });
        }
    });
    
    // Проверка знаков препинания
    if (!text.includes('?') && correctAnswer.includes('?')) {
        errors.push({
            type: 'punctuation',
            message: 'Вопросительное предложение должно заканчиваться знаком вопроса.',
            example: `Добавьте "?" в конце предложения`
        });
    }
    
    if (!text.includes('.') && correctAnswer.includes('.') && !correctAnswer.includes('?')) {
        errors.push({
            type: 'punctuation',
            message: 'Повествовательное предложение должно заканчиваться точкой.',
            example: `Добавьте "." в конце предложения`
        });
    }
    
    return { isCorrect: false, errors };
}

// Функция для анализа текста и поиска ошибок
function analyzeText(text) {
    const errors = [];
    
    // Проверка заглавных букв после точки
    const sentences = text.split('.');
    for (let i = 0; i < sentences.length - 1; i++) {
        const nextSentence = sentences[i+1].trim();
        if (nextSentence && nextSentence[0] === nextSentence[0].toLowerCase()) {
            errors.push({
                type: 'capitalization',
                message: 'После точки предложение должно начинаться с заглавной буквы.',
                example: `Вместо: "${nextSentence}" -> "${nextSentence.charAt(0).toUpperCase() + nextSentence.slice(1)}"`
            });
        }
    }
    
    // Проверка орфографических ошибок
    const spellingMistakes = {
        'russsland': 'Russland',
        'deutchland': 'Deutschland',
        'heise': 'heiße',
        'komst': 'kommst',
        'komest': 'kommst',
        'bist du': 'bist du',
        'bin ich': 'bin ich',
        'ist er': 'ist er'
    };
    
    for (const [mistake, correction] of Object.entries(spellingMistakes)) {
        if (text.toLowerCase().includes(mistake)) {
            errors.push({
                type: 'spelling',
                message: `Орфографическая ошибка: "${mistake}"`,
                example: `Правильно: "${correction}"`
            });
        }
    }
    
    // Проверка согласования глаголов и местоимений
    if (text.includes('ich bist') || text.includes('Ich bist')) {
        errors.push({
            type: 'grammar',
            message: 'Грамматическая ошибка: несоответствие местоимения и глагола.',
            example: 'С местоимением "ich" используется форма "bin". Правильно: "ich bin"'
        });
    }
    
    if (text.includes('du bin') || text.includes('Du bin')) {
        errors.push({
            type: 'grammar',
            message: 'Грамматическая ошибка: несоответствие местоимения и глагола.',
            example: 'С местоимением "du" используется форма "bist". Правильно: "du bist"'
        });
    }
    
    if ((text.includes('er bin') || text.includes('Er bin')) || 
        (text.includes('sie bin') || text.includes('Sie bin')) && 
        !text.includes('Sie bin') && text.includes('sie bin')) {
        errors.push({
            type: 'grammar',
            message: 'Грамматическая ошибка: несоответствие местоимения и глагола.',
            example: 'С местоимениями "er", "sie" (она), "es" используется форма "ist". Правильно: "er/sie/es ist"'
        });
    }
    
    if (text.includes('kommst Sie') || text.includes('Kommst Sie')) {
        errors.push({
            type: 'grammar',
            message: 'Грамматическая ошибка: несоответствие местоимения и глагола.',
            example: 'С местоимением "Sie" используется форма "kommen". Правильно: "kommen Sie" или с местоимением "du" - "kommst du"'
        });
    }
    
    if (text.includes('kommst sie') && !text.includes('kommst sie ')) {
        errors.push({
            type: 'grammar',
            message: 'Грамматическая ошибка: несоответствие местоимения и глагола.',
            example: 'С местоимением "sie" (они) используется форма "kommen". Правильно: "kommen sie" или с местоимением "du" - "kommst du"'
        });
    }
    
    // Проверка пробелов после запятых
    if (text.includes(',') && !text.includes(', ')) {
        errors.push({
            type: 'punctuation',
            message: 'После запятой должен быть пробел.',
            example: 'Вместо: "Hallo,wie" -> "Hallo, wie"'
        });
    }
    
    return errors;
}

// Функция для адаптивного изменения размера поля ввода
function resizeInput(input) {
    input.style.width = 'auto';
    input.style.width = (input.scrollWidth + 10) + 'px';
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

// Функция для проверки упражнений
function checkExercise(exerciseId) {
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
                const userAnswer = normalizeText(document.getElementById(id).value);
                if (userAnswer === answersA1T1Ex1[id]) {
                    correctCountA1T1Ex1++;
                    document.getElementById(id).style.borderColor = "green";
                } else {
                    document.getElementById(id).style.borderColor = "red";
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
            
        case 'a1t1-ex3':
            resultDiv = document.getElementById('a1t1-ex3-result');
            correctAnswerDiv = document.getElementById('correct-answer-a1t1-ex3');
            errorAnalysisDiv = document.getElementById('error-analysis-a1t1-ex3');
            errorListDiv = document.getElementById('error-list-a1t1-ex3');
            const userText = document.getElementById('a1t1-ex3-text').value.trim();
            
            if (userText.length > 0) {
                const errors = analyzeText(userText);
                
                if (errors.length === 0) {
                    const keywords = ['heiße', 'komme', 'aus', 'freut'];
                    let foundKeywords = keywords.filter(word => userText.toLowerCase().includes(word.toLowerCase()));
                    
                    if (foundKeywords.length >= 2) {
                        message = "Отлично! Ваш текст грамматически правильный и содержит необходимые элементы.";
                        isCorrect = true;
                        if (correctAnswerDiv) correctAnswerDiv.style.display = 'none';
                        if (errorAnalysisDiv) errorAnalysisDiv.style.display = 'none';
                    } else {
                        message = "Текст грамматически правильный, но попробуйте использовать больше ключевых слов из урока (например, heiße, komme, aus, freut).";
                        isCorrect = false;
                        if (correctAnswerDiv) correctAnswerDiv.style.display = 'block';
                        if (errorAnalysisDiv) errorAnalysisDiv.style.display = 'none';
                    }
                } else {
                    if (errorListDiv) {
                        errorListDiv.innerHTML = '';
                        errors.forEach(error => {
                            const errorItem = document.createElement('div');
                            errorItem.className = 'error-item';
                            errorItem.innerHTML = `
                                <strong>${error.type === 'capitalization' ? 'Заглавные буквы' : 
                                          error.type === 'spelling' ? 'Орфография' : 
                                          error.type === 'grammar' ? 'Грамматика' : 
                                          'Пунктуация'}:</strong> ${error.message}<br>
                                <em>${error.example}</em>
                            `;
                            errorListDiv.appendChild(errorItem);
                        });
                    }
                    
                    message = "В вашем тексте есть ошибки. Ознакомьтесь с анализом ниже.";
                    isCorrect = false;
                    if (correctAnswerDiv) correctAnswerDiv.style.display = 'block';
                    if (errorAnalysisDiv) errorAnalysisDiv.style.display = 'block';
                }
            } else {
                message = "Пожалуйста, напишите текст перед проверкой.";
                isCorrect = false;
                if (correctAnswerDiv) correctAnswerDiv.style.display = 'none';
                if (errorAnalysisDiv) errorAnalysisDiv.style.display = 'none';
            }
            break;
            
        case 'a1t1-ex4':
            resultDiv = document.getElementById('a1t1-ex4-result');
            correctAnswerDiv = document.getElementById('correct-answer-a1t1-ex4');
            const selectedOption = document.querySelector('input[name="a1t1-ex4"]:checked');
            
            if (selectedOption) {
                if (selectedOption.value === 'correct') {
                    message = "Правильно! 'Wie heißen Sie?' - это формальное обращение.";
                    isCorrect = true;
                    if (correctAnswerDiv) correctAnswerDiv.style.display = 'none';
                } else {
                    message = "Неправильно. Попробуйте еще раз!";
                    isCorrect = false;
                    if (correctAnswerDiv) correctAnswerDiv.style.display = 'block';
                }
            } else {
                message = "Пожалуйста, выберите вариант ответа.";
                isCorrect = false;
                if (correctAnswerDiv) correctAnswerDiv.style.display = 'none';
            }
            break;
            
        case 'a1t2-ex1':
            resultDiv = document.getElementById('a1t2-ex1-result');
            correctAnswerDiv = document.getElementById('correct-answer-a1t2-ex1');
            const answersA1T2Ex1 = {
                'a1t2-ex1-1': 'sieben',
                'a1t2-ex1-2': 'fünfzehn',
                'a1t2-ex1-3': 'dreiundzwanzig',
                'a1t2-ex1-4': 'achtundvierzig',
                'a1t2-ex1-5': 'hundert'
            };
            
            let correctCountA1T2Ex1 = 0;
            let totalQuestionsA1T2Ex1 = Object.keys(answersA1T2Ex1).length;
            
            for (let id in answersA1T2Ex1) {
                const userAnswer = normalizeText(document.getElementById(id).value.toLowerCase());
                if (userAnswer === answersA1T2Ex1[id]) {
                    correctCountA1T2Ex1++;
                    document.getElementById(id).style.borderColor = "green";
                } else {
                    document.getElementById(id).style.borderColor = "red";
                }
            }
            
            if (correctCountA1T2Ex1 === totalQuestionsA1T2Ex1) {
                message = "Отлично! Все числа написаны правильно.";
                isCorrect = true;
                if (correctAnswerDiv) correctAnswerDiv.style.display = 'none';
            } else {
                message = `Вы правильно написали ${correctCountA1T2Ex1} из ${totalQuestionsA1T2Ex1} чисел. Попробуйте еще раз!`;
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
    }
}

// Инициализация авто-расширения полей ввода
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sentence-input').forEach(input => {
        resizeInput(input);
        input.addEventListener('input', function() {
            resizeInput(this);
        });
    });
});
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

// Обновите функцию checkExercise для использования статистики
function checkExercise(exerciseId) {
    // ... существующий код проверки ...
    
    // В конце каждой проверки добавляем:
    updateAnswerStats(isCorrect);
    
    // ... остальной код ...
}