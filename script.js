/* ==========================================================================
   JUDICIARY - 3D INTERACTIVE STORYBOOK CONTROLLER (MALE BSF BRO-CODE EDITION)
   Disguised File: script.js (Internal Reference #4092)
   Fav Colors: Black, Silver & Magenta | Fav Flower: Sunflower | 100% Platonic BSF
   ========================================================================== */

(function () {
    'use strict';

    let currentSpread = 0;
    const spreads = document.querySelectorAll('.book-spread');
    const totalSpreads = spreads.length;

    const btnPrev = document.getElementById('btnPrevPage');
    const btnNext = document.getElementById('btnNextPage');
    const pageCounter = document.getElementById('pageCounter');
    const navDots = document.querySelectorAll('.nav-dot');

    let audioCtx = null;
    let candlesBlown = false;

    // Lightbox Modal
    const photoModal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const modalStory = document.getElementById('modalStory');

    /* ==========================================================================
       WEB AUDIO SYNTHESIZER (MUSIC BOX & PAGE FLIP SWOOSH)
       ========================================================================== */
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playNote(freq, timeOffset = 0, duration = 1.0) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime + timeOffset;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            // Audio policy fallback
        }
    }

    // Page flip swoosh with cheerful bell chime
    function playPageTurnSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.19);

            playNote(659.25, 0.08, 0.6);
        } catch (e) {}
    }

    const melodyNotes = [
        523.25, 523.25, 587.33, 523.25, 698.46, 659.25,
        523.25, 523.25, 587.33, 523.25, 783.99, 698.46,
        523.25, 523.25, 1046.50, 880.00, 698.46, 659.25, 587.33
    ];

    function playBirthdayMelody() {
        melodyNotes.forEach((freq, idx) => {
            playNote(freq, idx * 0.26, 1.2);
        });
    }

    /* ==========================================================================
       PAGE FLIP ENGINE (AUTOMATIC CONFETTI + REVEAL ON EVERY PAGE)
       ========================================================================== */
    window.flipToSpread = function (index) {
        if (index < 0 || index >= totalSpreads) return;

        currentSpread = index;

        spreads.forEach((spread, idx) => {
            if (idx === index) {
                spread.classList.add('active');
                spread.scrollTop = 0;
            } else {
                spread.classList.remove('active');
            }
        });

        // Update nav dots & buttons
        navDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });

        if (btnPrev) btnPrev.disabled = (index === 0);
        if (btnNext) {
            btnNext.disabled = (index === totalSpreads - 1);
            if (index === 0) {
                btnNext.innerHTML = "OPEN STORYBOOK <span>→</span>";
            } else if (index === totalSpreads - 1) {
                btnNext.innerHTML = "FINAL CHAPTER <span>✨</span>";
            } else {
                btnNext.innerHTML = "NEXT CHAPTER <span>→</span>";
            }
        }

        if (pageCounter) {
            if (index === 0) {
                pageCounter.innerText = "Cover Page";
            } else {
                pageCounter.innerText = `Chapter ${index} of ${totalSpreads - 1}`;
            }
        }

        // Sound cue on page flip
        playPageTurnSound();

        // AUTOMATIC CONFETTI EXPLOSION ON EVERY SINGLE PAGE TURN!
        createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 55);

        // Special triggers per chapter
        if (index === 3) {
            playNote(783.99, 0.1);
            playNote(880.00, 0.25);
        } else if (index === 4) {
            playNote(1046.5, 0.15);
        } else if (index === 5) {
            playBirthdayMelody();
        }
    };

    window.nextPage = function () {
        if (currentSpread < totalSpreads - 1) {
            window.flipToSpread(currentSpread + 1);
        }
    };

    window.prevPage = function () {
        if (currentSpread > 0) {
            window.flipToSpread(currentSpread - 1);
        }
    };

    // Keyboard navigation (Arrow keys & Space)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            window.nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            window.prevPage();
        }
    });

    // Attach click listeners to nav dots
    navDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            window.flipToSpread(idx);
        });
    });

    /* ==========================================================================
       BLOW CANDLES ON THE POP-UP CAKE
       ========================================================================== */
    window.blowCakeCandles = function () {
        const candleUnits = document.querySelectorAll('.candle-unit');

        if (candlesBlown) {
            candlesBlown = false;
            candleUnits.forEach(c => c.classList.remove('blown'));
            const blowBtn = document.getElementById('blowBtn');
            if (blowBtn) {
                blowBtn.innerHTML = "<span>💨</span> BLOW THE CANDLES";
                blowBtn.style.background = "linear-gradient(135deg, #ff007f, #b30059)";
                blowBtn.style.color = "#ffffff";
            }
            playNote(880, 0, 0.5);
            return;
        }

        candlesBlown = true;
        candleUnits.forEach(c => c.classList.add('blown'));

        const blowBtn = document.getElementById('blowBtn');
        if (blowBtn) {
            blowBtn.innerHTML = "✨ WISH GRANTED! (TAP TO RELIGHT) 🎉";
            blowBtn.style.background = "linear-gradient(135deg, #ffd166, #ffb703)";
            blowBtn.style.color = "#200810";
        }

        playBirthdayMelody();
        createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 95);
    };

    /* ==========================================================================
       PIE CHART & COMPATIBILITY SCORE INTERACTIONS
       ========================================================================== */
    window.tapScore = function () {
        playNote(783.99, 0, 0.3);
        playNote(987.77, 0.1, 0.3);
        playNote(1174.66, 0.2, 0.6);
        createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 45);
    };

    window.tapPieChart = function () {
        playNote(659.25, 0, 0.25);
        playNote(830.61, 0.1, 0.35);
        createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 35);
    };

    /* ==========================================================================
       PHOTO LIGHTBOX MODAL
       ========================================================================== */
    window.openPhotoModal = function (src, caption, story) {
        if (!photoModal) return;
        modalImg.src = src;
        modalCaption.innerText = caption;
        modalStory.innerText = story;

        photoModal.classList.add('active');
        playNote(659.25, 0);
        playNote(783.99, 0.12);
        createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
    };

    window.closePhotoModal = function () {
        if (!photoModal) return;
        photoModal.classList.remove('active');
        playNote(523.25, 0, 0.3);
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closePhotoModal();
        }
    });

    /* ==========================================================================
       INTERACTIVE BESTIE SQUAD & TEDDY CHATS
       ========================================================================== */
    const teddyQuotes = [
        "🧸 Protecting Anish 24/7!",
        "🛡️ Overthinking shield activated!",
        "⚡ 1 Shared brain cell 100% charged!",
        "🌻 Sunflower squad on duty!",
        "🧿 Nazar na lage hamari dosti ko!"
    ];
    let teddyQuoteIdx = 0;

    window.tapTeddies = function () {
        teddyQuoteIdx = (teddyQuoteIdx + 1) % teddyQuotes.length;
        const bubble = document.getElementById('teddyBubble');
        if (bubble) {
            bubble.innerText = teddyQuotes[teddyQuoteIdx];
            bubble.style.transform = "scale(1.15)";
            setTimeout(() => bubble.style.transform = "scale(1)", 200);
        }
        playNote(783.99, 0, 0.4);
        playNote(987.77, 0.1, 0.4);
    };

    window.tapFistbump = function () {
        const bubble = document.getElementById('fistbumpBubble');
        if (bubble) {
            bubble.innerText = "👊 Boom! Certified Best Friends forever.";
            bubble.style.transform = "scale(1.15)";
            setTimeout(() => bubble.style.transform = "scale(1)", 200);
        }
        playNote(523.25, 0, 0.3);
        playNote(783.99, 0.1, 0.5);
        createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.6, 25);
    };

    /* ==========================================================================
       UNWRAP GIFT BOXES
       ========================================================================== */
    window.unwrapGiftItem = function (el) {
        if (!el.classList.contains('unwrapped')) {
            el.classList.add('unwrapped');
            const rect = el.getBoundingClientRect();
            createConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
            playNote(659.25, 0);
            playNote(830.61, 0.1);
            playNote(1046.50, 0.2);
        }
    };

    /* ==========================================================================
       CONFETTI SHOWER: SUNFLOWERS, SILVER SPARKLES, GAMING & BRO-CODE ICONS
       ========================================================================== */
    function createConfettiBurst(originX, originY, count = 50) {
        const icons = ['🌻', '🌻', '⚡', '🎮', '✨', '🔥', '👊', '🍰', '🎉', '🏍️', '🧁', '🤝'];

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-particle';
            p.innerText = icons[Math.floor(Math.random() * icons.length)];
            p.style.left = originX + 'px';
            p.style.top = originY + 'px';
            p.style.fontSize = (15 + Math.random() * 22) + 'px';

            document.body.appendChild(p);

            const destX = (Math.random() - 0.5) * Math.min(window.innerWidth * 0.85, 900);
            const destY = (Math.random() - 0.5) * Math.min(window.innerHeight * 0.85, 750);
            const duration = 1600 + Math.random() * 1200;

            p.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0.2) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(${1 + Math.random() * 0.5}) rotate(${Math.random() * 720 - 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.15, 0.85, 0.35, 1)',
                fill: 'forwards'
            });

            setTimeout(() => {
                p.remove();
            }, duration + 100);
        }
    }

    window.triggerGrandFinale = function () {
        createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 110);
        playBirthdayMelody();
    };

    /* ==========================================================================
       AMBIENT CANVAS: FLOATING SUNFLOWER PETALS, SILVER & MAGENTA
       ========================================================================== */
    const canvas = document.getElementById('ambientCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const petals = [];
        const numPetals = 35;

        class FloatingPetal {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -25;
                this.size = 8 + Math.random() * 14;
                this.speedY = 0.5 + Math.random() * 1.1;
                this.speedX = (Math.random() - 0.5) * 0.7;
                this.angle = Math.random() * Math.PI * 2;
                this.angleSpeed = (Math.random() - 0.5) * 0.02;
                this.opacity = 0.25 + Math.random() * 0.45;
                const colors = ['#ffb703', '#ffd166', '#ff007f', '#e2e8f0', '#ffffff'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.y * 0.015) * 0.7 + this.speedX;
                this.angle += this.angleSpeed;

                if (this.y > height + 25 || this.x < -25 || this.x > width + 25) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.8, this.size * 0.8, 0, this.size * 1.4);
                ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.8, -this.size * 0.8, -this.size * 0.5, 0, 0);
                ctx.fill();

                ctx.restore();
            }
        }

        for (let i = 0; i < numPetals; i++) {
            petals.push(new FloatingPetal());
        }

        function render() {
            ctx.clearRect(0, 0, width, height);
            petals.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(render);
        }

        render();
    }

})();
