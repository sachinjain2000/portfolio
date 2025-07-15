const gameData = {
    rounds: [
        {
            question: "What's my strongest technical skill?",
            options: ["Python", "R", "SQL", "Tableau"],
            correctAnswer: "Python",
            info: "Python is my go-to language for building data pipelines, machine learning models, and automating analytics. I love its versatility and the power of its ecosystem."
        },
        {
            question: "What's my favorite part of the data science process?",
            options: ["Data cleaning & wrangling", "Model tuning", "Dashboard design", "Writing documentation"],
            correctAnswer: "Data cleaning & wrangling",
            info: "I genuinely enjoy turning messy, real-world data into something clean and insightful. I believe the best models start with great data."
        },
        {
            question: "What's one impact I'm most proud of?",
            options: ["Reduced grading resubmissions by 30% with automation", "Published a research paper", "Won a hackathon", "Built a personal website"],
            correctAnswer: "Reduced grading resubmissions by 30% with automation",
            info: "At UT Dallas, I built an automated grading feedback system that reduced resubmissions by 30% and saved 50+ hours for faculty and students."
        },
        {
            question: "What motivates me most in my work?",
            options: ["Solving real-world problems", "Learning new tech", "Earning recognition", "Working remotely"],
            correctAnswer: "Solving real-world problems",
            info: "I'm most excited when my work leads to real improvements—whether it's a smarter product, a better process, or a more informed decision."
        },
        {
            question: "What's a fun fact about me?",
            options: ["I love exploring new AI tools", "I'm a chess champion", "I speak 4 languages", "I run marathons"],
            correctAnswer: "I love exploring new AI tools",
            info: "I'm always surfing the AI wave—testing new tools, reading research, and adding the best ones to my tech stack."
        }
    ],
    currentRound: 0,
    discoveredInfo: []
};

// Confetti function (simple)
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    let particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H * 0.2,
            r: Math.random() * 6 + 4,
            d: Math.random() * 80,
            color: `hsl(${Math.random()*360},90%,60%)`,
            tilt: Math.random() * 10 - 10
        });
    }
    let angle = 0;
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        angle += 0.01;
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, false);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.y += Math.cos(angle + p.d) + 1 + p.r/2;
            p.x += Math.sin(angle) * 2;
            if (p.y > H) {
                p.x = Math.random() * W;
                p.y = -10;
            }
        }
        frame++;
        if (frame < 60) {
            requestAnimationFrame(draw);
        } else {
            canvas.style.display = 'none';
        }
    }
    draw();
}

document.addEventListener('DOMContentLoaded', () => {
    // Modal logic
    const openModalBtn = document.getElementById('open-game-modal');
    const gameModal = document.getElementById('game-modal');
    const closeModalBtn = document.getElementById('close-game-modal');
    if (openModalBtn && gameModal && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            gameModal.classList.remove('hidden');
            updateProgressBar();
        });
        closeModalBtn.addEventListener('click', () => {
            gameModal.classList.add('hidden');
        });
        // Prevent modal from closing when clicking inside modal-content
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        // Close modal on outside click
        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal) {
                gameModal.classList.add('hidden');
            }
        });
    }

    const startButton = document.getElementById('start-game');
    const gameStart = document.getElementById('game-start');
    const gameQuestion = document.getElementById('game-question');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentRoundSpan = document.getElementById('current-round');
    const discoveredInfo = document.getElementById('discovered-info');
    const infoContainer = document.getElementById('info-container');
    const progressBar = document.getElementById('game-progress-bar');
    const progressText = document.getElementById('game-progress-text');

    startButton.addEventListener('click', startGame);

    function startGame() {
        gameStart.classList.add('hidden');
        gameQuestion.classList.remove('hidden');
        gameData.currentRound = 0;
        loadRound();
        updateProgressBar();
    }

    function loadRound() {
        const round = gameData.rounds[gameData.currentRound];
        currentRoundSpan.textContent = gameData.currentRound + 1;
        questionText.textContent = round.question;
        optionsContainer.innerHTML = '';
        round.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'game-option';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option, button));
            optionsContainer.appendChild(button);
        });
        updateProgressBar();
    }

    function checkAnswer(selectedOption, button) {
        const round = gameData.rounds[gameData.currentRound];
        Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
        if (selectedOption === round.correctAnswer) {
            button.classList.add('selected', 'correct');
            setTimeout(() => {
                gameData.discoveredInfo.push(round.info);
                updateDiscoveredInfo();
                launchConfetti();
                if (gameData.currentRound < gameData.rounds.length - 1) {
                    gameData.currentRound++;
                    setTimeout(() => {
                        loadRound();
                    }, 900);
                } else {
                    gameQuestion.innerHTML = '<h3>🎉 Congratulations! 🎉</h3><p>You\'ve completed all rounds!</p>';
                    optionsContainer.innerHTML = '';
                    updateProgressBar(true);
                }
            }, 600);
        } else {
            button.classList.add('selected', 'incorrect');
            setTimeout(() => {
                button.classList.remove('selected', 'incorrect');
                Array.from(optionsContainer.children).forEach(btn => btn.disabled = false);
            }, 700);
        }
    }

    function updateDiscoveredInfo() {
        discoveredInfo.classList.remove('hidden');
        infoContainer.innerHTML = '';
        gameData.discoveredInfo.forEach((info, index) => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            infoItem.textContent = info;
            infoContainer.appendChild(infoItem);
            setTimeout(() => {
                infoItem.classList.add('visible');
            }, index * 200);
        });
    }

    function updateProgressBar(forceComplete) {
        if (!progressBar || !progressText) return;
        const total = gameData.rounds.length;
        let current = gameData.currentRound;
        if (forceComplete) current = total;
        const percent = Math.round((current) / total * 100);
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `Round ${Math.min(current+1, total)} of ${total}`;
    }
}); 