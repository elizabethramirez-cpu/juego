/* ================================================================
   IrregVibes — Lógica del juego
   ================================================================ */

/* ================================================================
   DATOS: 45 verbos irregulares comunes del inglés
   Formato: { base, past (Past Simple), participle (Past Participle), meaning }
   ================================================================ */
const VERBS = [
    { base: 'go',      past: 'went',    participle: 'gone',    meaning: 'ir' },
    { base: 'come',    past: 'came',    participle: 'come',    meaning: 'venir' },
    { base: 'do',      past: 'did',     participle: 'done',    meaning: 'hacer' },
    { base: 'have',    past: 'had',     participle: 'had',     meaning: 'tener / haber' },
    { base: 'eat',     past: 'ate',     participle: 'eaten',   meaning: 'comer' },
    { base: 'drink',   past: 'drank',   participle: 'drunk',   meaning: 'beber' },
    { base: 'see',     past: 'saw',     participle: 'seen',    meaning: 'ver' },
    { base: 'take',    past: 'took',    participle: 'taken',   meaning: 'tomar' },
    { base: 'give',    past: 'gave',    participle: 'given',   meaning: 'dar' },
    { base: 'make',    past: 'made',    participle: 'made',    meaning: 'hacer / fabricar' },
    { base: 'find',    past: 'found',   participle: 'found',   meaning: 'encontrar' },
    { base: 'think',   past: 'thought', participle: 'thought', meaning: 'pensar' },
    { base: 'buy',     past: 'bought',  participle: 'bought',  meaning: 'comprar' },
    { base: 'bring',   past: 'brought', participle: 'brought', meaning: 'traer' },
    { base: 'speak',   past: 'spoke',   participle: 'spoken',  meaning: 'hablar' },
    { base: 'break',   past: 'broke',   participle: 'broken',  meaning: 'romper' },
    { base: 'begin',   past: 'began',   participle: 'begun',   meaning: 'comenzar' },
    { base: 'swim',    past: 'swam',    participle: 'swum',    meaning: 'nadar' },
    { base: 'write',   past: 'wrote',   participle: 'written', meaning: 'escribir' },
    { base: 'drive',   past: 'drove',   participle: 'driven',  meaning: 'conducir' },
    { base: 'run',     past: 'ran',     participle: 'run',     meaning: 'correr' },
    { base: 'sit',     past: 'sat',     participle: 'sat',     meaning: 'sentarse' },
    { base: 'stand',   past: 'stood',   participle: 'stood',   meaning: 'estar de pie' },
    { base: 'tell',    past: 'told',    participle: 'told',    meaning: 'decir / contar' },
    { base: 'get',     past: 'got',     participle: 'got',     meaning: 'obtener / llegar' },
    { base: 'say',     past: 'said',    participle: 'said',    meaning: 'decir' },
    { base: 'know',    past: 'knew',    participle: 'known',   meaning: 'saber / conocer' },
    { base: 'grow',    past: 'grew',    participle: 'grown',   meaning: 'crecer' },
    { base: 'draw',    past: 'drew',    participle: 'drawn',   meaning: 'dibujar' },
    { base: 'fly',     past: 'flew',    participle: 'flown',   meaning: 'volar' },
    { base: 'throw',   past: 'threw',   participle: 'thrown',  meaning: 'lanzar' },
    { base: 'catch',   past: 'caught',  participle: 'caught',  meaning: 'atrapar' },
    { base: 'teach',   past: 'taught',  participle: 'taught',  meaning: 'enseñar' },
    { base: 'fall',    past: 'fell',    participle: 'fallen',  meaning: 'caer' },
    { base: 'hide',    past: 'hid',     participle: 'hidden',  meaning: 'esconder' },
    { base: 'hold',    past: 'held',    participle: 'held',    meaning: 'mantener / sostener' },
    { base: 'keep',    past: 'kept',    participle: 'kept',    meaning: 'mantener / guardar' },
    { base: 'leave',   past: 'left',    participle: 'left',    meaning: 'dejar / salir' },
    { base: 'meet',    past: 'met',     participle: 'met',     meaning: 'encontrarse' },
    { base: 'pay',     past: 'paid',    participle: 'paid',    meaning: 'pagar' },
    { base: 'put',     past: 'put',     participle: 'put',     meaning: 'poner' },
    { base: 'send',    past: 'sent',    participle: 'sent',    meaning: 'enviar' },
    { base: 'sleep',   past: 'slept',   participle: 'slept',   meaning: 'dormir' },
    { base: 'spend',   past: 'spent',   participle: 'spent',   meaning: 'gastar' },
    { base: 'win',     past: 'won',     participle: 'won',     meaning: 'ganar' },
];

/* === Constantes de juego === */
const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;
const XP_PER_CORRECT = 10;
const XP_STREAK_BONUS = 5;
const FEEDBACK_DELAY_MS = 1400;

/* === Estado global del juego === */
let state = {
    questions: [],
    current: 0,
    lives: MAX_LIVES,
    xp: 0,
    streak: 0,
    maxStreak: 0,
    correct: 0,
    wrong: 0,
    wrongVerbs: [],
    answered: false,
};

/* === Referencias a elementos del DOM === */
const $ = (sel) => document.querySelector(sel);
const screenHome      = $('#screenHome');
const screenGame      = $('#screenGame');
const screenResults   = $('#screenResults');
const livesContainer  = $('#livesContainer');
const progressFill    = $('#progressFill');
const progressText    = $('#progressText');
const xpValue         = $('#xpValue');
const questionContainer = $('#questionContainer');
const streakDisplay   = $('#streakDisplay');
const streakValue     = $('#streakValue');
const resultsCard     = $('#resultsCard');
const toastContainer  = $('#toastContainer');

/* ================================================================
   SONIDOS: Web Audio API — tonos simples sin archivos externos
   ================================================================ */
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playSound(type) {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'correct') {
            // Acorde ascendente alegre (C5 → E5 → G5)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.08);
            osc.frequency.setValueAtTime(784, now + 0.16);
            gain.gain.setValueAtTime(0.13, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
            osc.start(now);
            osc.stop(now + 0.38);
        } else if (type === 'wrong') {
            // Bajo descendente
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.28);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
            osc.start(now);
            osc.stop(now + 0.32);
        } else if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.start(now);
            osc.stop(now + 0.06);
        }
    } catch (e) {
        // Silenciar errores de audio en navegadores sin soporte
    }
}

/* ================================================================
   UTILIDADES
   ================================================================ */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showToast(message, icon = 'fa-triangle-exclamation') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/* ================================================================
   GESTIÓN DE PANTALLAS con transición suave
   ================================================================ */
function showScreen(target) {
    [screenHome, screenGame, screenResults].forEach(s => {
        if (s === target) {
            s.classList.remove('hidden');
            s.style.opacity = '0';
            s.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
                s.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                s.style.opacity = '1';
                s.style.transform = 'translateY(0)';
            });
        } else {
            s.classList.add('hidden');
            s.style.transition = '';
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================================================================
   GENERADOR DE PREGUNTAS
   Rota entre 4 tipos: past MC, participle MC, past escritura, participle escritura
   ================================================================ */
function generateQuestions() {
    const pool = shuffle(VERBS).slice(0, TOTAL_QUESTIONS);
    const types = ['past-mc', 'participle-mc', 'past-write', 'participle-write'];

    return pool.map((verb, i) => {
        const type = types[i % types.length];
        const isPast = type.includes('past');
        const isMC = type.includes('mc');
        const correct = isPast ? verb.past : verb.participle;
        const label = isPast ? 'Past Simple' : 'Past Participle';

        // Generar distractores únicos para opción múltiple
        let options = null;
        if (isMC) {
            const others = VERBS.filter(v => v.base !== verb.base);
            const distractors = [];
            for (const v of shuffle(others)) {
                const form = isPast ? v.past : v.participle;
                if (form !== correct && !distractors.includes(form)) {
                    distractors.push(form);
                }
                if (distractors.length >= 3) break;
            }
            options = shuffle([correct, ...distractors]);
        }

        return { verb, type, correct, options, label };
    });
}

/* ================================================================
   RENDERIZADO DE LA INTERFAZ DE JUEGO
   ================================================================ */

// Dibujar los corazones de vidas
function renderLives() {
    livesContainer.innerHTML = '';
    for (let i = 0; i < MAX_LIVES; i++) {
        const heart = document.createElement('i');
        heart.className = `fas fa-heart heart ${i >= state.lives ? 'lost' : ''}`;
        heart.setAttribute('aria-hidden', 'true');
        livesContainer.appendChild(heart);
    }
}

// Animar un corazón rompiéndose
function animateHeartLoss() {
    const hearts = livesContainer.querySelectorAll('.heart');
    const idx = state.lives; // Índice del corazón que se pierde
    if (hearts[idx]) {
        hearts[idx].classList.add('breaking');
        setTimeout(() => {
            hearts[idx].classList.remove('breaking');
            hearts[idx].classList.add('lost');
        }, 500);
    }
}

// Actualizar la barra de progreso
function updateProgress() {
    const pct = (state.current / TOTAL_QUESTIONS) * 100;
    progressFill.style.width = pct + '%';
    progressText.textContent = `${state.current} / ${TOTAL_QUESTIONS}`;
    progressFill.parentElement.setAttribute('aria-valuenow', Math.round(pct));
}

// Actualizar XP con animación de número volador
function updateXP(added) {
    state.xp += added;
    xpValue.textContent = state.xp;

    if (added > 0) {
        const rect = $('#xpDisplay').getBoundingClientRect();
        const fly = document.createElement('div');
        fly.className = 'xp-fly';
        fly.textContent = `+${added}`;
        fly.style.left = (rect.left + rect.width / 2 - 18) + 'px';
        fly.style.top = (rect.bottom + 10) + 'px';
        document.body.appendChild(fly);
        setTimeout(() => fly.remove(), 1100);
    }
}

// Actualizar indicador de racha
function updateStreak() {
    if (state.streak >= 2) {
        streakDisplay.classList.add('visible');
        streakValue.textContent = state.streak;
        streakDisplay.classList.remove('streak-bump');
        // Forzar reflow para reiniciar la animación
        void streakDisplay.offsetWidth;
        streakDisplay.classList.add('streak-bump');
    } else {
        streakDisplay.classList.remove('visible');
    }
}

// Renderizar la pregunta actual
function renderQuestion() {
    const q = state.questions[state.current];
    state.answered = false;
    const isWrite = q.type.includes('write');
    const action = isWrite ? 'Escribe' : 'Selecciona';

    let html = '';
    html += `<div class="question-badge">${q.label}</div>`;
    html += `<h2 class="question-text">${action} el ${q.label} de <span class="question-verb">"${q.verb.base}"</span></h2>`;
    html += `<p class="question-meaning">Significado: ${q.verb.meaning}</p>`;

    if (isWrite) {
        // Modo escritura: input de texto + botón verificar
        html += `
            <div class="input-container">
                <input type="text" class="answer-input" id="answerInput"
                    placeholder="Escribe aqui..."
                    autocomplete="off" autocapitalize="off" spellcheck="false"
                    aria-label="Tu respuesta">
                <div id="correctReveal"></div>
            </div>
            <button class="btn-primary" id="btnCheck" style="width:100%">Verificar</button>`;
    } else {
        // Modo opción múltiple: 4 botones con teclas A/B/C/D
        const keys = ['A', 'B', 'C', 'D'];
        html += `<div class="options-grid" id="optionsGrid">`;
        q.options.forEach((opt, i) => {
            html += `<button class="option-btn" data-value="${opt}" aria-label="Opcion ${keys[i]}: ${opt}">
                <span class="option-key">${keys[i]}</span>
                <span>${opt}</span>
            </button>`;
        });
        html += `</div>`;
    }

    questionContainer.innerHTML = html;
    questionContainer.classList.remove('exiting');
    // Forzar reinicio de animación de entrada
    void questionContainer.offsetWidth;

    // Conectar event listeners según el tipo
    if (isWrite) {
        const input = $('#answerInput');
        const btn = $('#btnCheck');
        input.focus();
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !state.answered) btn.click();
        });
        btn.addEventListener('click', () => handleWriteAnswer(q));
    } else {
        const buttons = questionContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => handleMCAnswer(btn, q, buttons));
        });
    }
}

/* ================================================================
   LÓGICA DE RESPUESTAS
   ================================================================ */

// Manejar respuesta de opción múltiple
function handleMCAnswer(selectedBtn, q, allButtons) {
    if (state.answered) return;
    state.answered = true;
    playSound('click');

    const selected = selectedBtn.dataset.value.toLowerCase().trim();
    const isCorrect = selected === q.correct.toLowerCase().trim();

    // Marcar todos como deshabilitados y resaltar la correcta
    allButtons.forEach(btn => {
        btn.classList.add('disabled');
        if (btn.dataset.value.toLowerCase().trim() === q.correct.toLowerCase().trim()) {
            btn.classList.add('correct');
        }
    });

    if (isCorrect) {
        processCorrect();
    } else {
        selectedBtn.classList.add('wrong');
        processWrong(q);
    }
}

// Manejar respuesta escrita
function handleWriteAnswer(q) {
    if (state.answered) return;

    const input = $('#answerInput');
    const btn = $('#btnCheck');
    const answer = input.value.trim().toLowerCase();

    if (!answer) {
        showToast('Escribe una respuesta antes de verificar', 'fa-pen');
        input.focus();
        return;
    }

    state.answered = true;
    btn.disabled = true;
    input.disabled = true;

    const isCorrect = answer === q.correct.toLowerCase().trim();

    if (isCorrect) {
        input.classList.add('correct');
        processCorrect();
    } else {
        input.classList.add('wrong');
        // Revelar la respuesta correcta
        $('#correctReveal').innerHTML = `
            <div class="correct-answer-reveal">
                <i class="fas fa-lightbulb" style="margin-right:0.35rem"></i>
                La respuesta correcta es: <strong>${q.correct}</strong>
            </div>`;
        processWrong(q);
    }
}

// Procesar acierto
function processCorrect() {
    playSound('correct');
    state.correct++;
    state.streak++;
    if (state.streak > state.maxStreak) state.maxStreak = state.streak;

    let xp = XP_PER_CORRECT;
    if (state.streak >= 3) xp += XP_STREAK_BONUS;
    updateXP(xp);
    updateStreak();

    setTimeout(nextQuestion, FEEDBACK_DELAY_MS);
}

// Procesar error
function processWrong(q) {
    playSound('wrong');
    state.wrong++;
    state.streak = 0;
    state.lives--;
    state.wrongVerbs.push(q.verb);
    updateStreak();
    animateHeartLoss();

    if (state.lives <= 0) {
        setTimeout(showResults, FEEDBACK_DELAY_MS);
    } else {
        setTimeout(nextQuestion, FEEDBACK_DELAY_MS);
    }
}

// Avanzar a la siguiente pregunta
function nextQuestion() {
    state.current++;

    if (state.current >= TOTAL_QUESTIONS) {
        showResults();
        return;
    }

    // Animación de salida de la pregunta actual
    questionContainer.classList.add('exiting');
    setTimeout(() => {
        updateProgress();
        renderQuestion();
    }, 300);
}

/* ================================================================
   PANTALLA DE RESULTADOS
   ================================================================ */
function showResults() {
    const won = state.lives > 0;
    const perfect = won && state.wrong === 0;

    let html = '';

    // Icono según resultado
    if (perfect) {
        html += `<div class="results-icon success"><i class="fas fa-crown"></i></div>`;
        html += `<h2 class="results-title">Perfecto</h2>`;
        html += `<p class="results-subtitle">Todas las respuestas correctas. Increible.</p>`;
    } else if (won) {
        html += `<div class="results-icon success"><i class="fas fa-trophy"></i></div>`;
        html += `<h2 class="results-title">Leccion completada</h2>`;
        html += `<p class="results-subtitle">Buen trabajo, sigue practicando para mejorar.</p>`;
    } else {
        html += `<div class="results-icon failure"><i class="fas fa-heart-crack"></i></div>`;
        html += `<h2 class="results-title">Se acabaron los corazones</h2>`;
        html += `<p class="results-subtitle">No te rindas, cada intento te acerca mas a tu meta.</p>`;
    }

    // Cuadrícula de estadísticas
    html += `<div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value green">${state.correct}</div>
            <div class="stat-label">Correctas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value red">${state.wrong}</div>
            <div class="stat-label">Incorrectas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value purple">${state.xp}</div>
            <div class="stat-label">XP total</div>
        </div>
        <div class="stat-card">
            <div class="stat-value yellow">${state.maxStreak}</div>
            <div class="stat-label">Mejor racha</div>
        </div>
    </div>`;

    // Lista de verbos erróneos para repasar
    if (state.wrongVerbs.length > 0) {
        html += `<div class="wrong-verbs-section">
            <div class="wrong-verbs-title">
                <i class="fas fa-rotate-right"></i> Verbos para repasar
            </div>`;
        // Eliminar duplicados manteniendo el orden
        const unique = [...new Map(state.wrongVerbs.map(v => [v.base, v])).values()];
        unique.forEach(v => {
            html += `<div class="wrong-verb-item">
                <strong style="color:var(--fg)">${v.base}</strong>
                <div class="wrong-verb-forms">
                    <span>${v.past}</span>
                    <span>${v.participle}</span>
                </div>
            </div>`;
        });
        html += `</div>`;
    }

    // Botones de acción
    html += `<div class="results-buttons">
        <button class="btn-primary" id="btnRetry">Reintentar</button>
        <button class="btn-secondary" id="btnHome">Inicio</button>
    </div>`;

    resultsCard.innerHTML = html;

    // Conectar eventos de los botones de resultados
    $('#btnRetry').addEventListener('click', startGame);
    $('#btnHome').addEventListener('click', () => showScreen(screenHome));

    showScreen(screenResults);
}

/* ================================================================
   INICIO DEL JUEGO
   ================================================================ */
function startGame() {
    // Reiniciar todo el estado
    state = {
        questions: generateQuestions(),
        current: 0,
        lives: MAX_LIVES,
        xp: 0,
        streak: 0,
        maxStreak: 0,
        correct: 0,
        wrong: 0,
        wrongVerbs: [],
        answered: false,
    };

    renderLives();
    updateProgress();
    xpValue.textContent = '0';
    updateStreak();
    showScreen(screenGame);

    // Pequeño retardo para que la transición de pantalla se complete
    setTimeout(() => renderQuestion(), 120);
}

/* ================================================================
   ATAJOS DE TECLADO: A/B/C/D para opciones múltiples
   ================================================================ */
document.addEventListener('keydown', (e) => {
    // Solo activo en la pantalla de juego
    if (screenGame.classList.contains('hidden')) return;
    if (state.answered) return;

    const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    const index = keyMap[e.key.toLowerCase()];

    if (index !== undefined) {
        const buttons = questionContainer.querySelectorAll('.option-btn');
        if (buttons[index]) buttons[index].click();
    }
});

/* ================================================================
   INICIALIZACIÓN
   ================================================================ */
 $('#btnStart').addEventListener('click', startGame);
showScreen(screenHome);
