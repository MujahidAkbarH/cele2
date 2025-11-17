// Countdown Timer
const targetDate = new Date('2025-11-24T00:00:00').getTime();

const countdownEl = document.getElementById('countdown');
const countdownMessage = document.getElementById('countdown-message');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const surpriseBtn = document.getElementById('surprise-btn');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        countdownEl.style.display = 'none';
        countdownMessage.textContent = 'The moment has arrived! 🎉';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update with smooth transitions
    updateTimeValue(daysEl, days);
    updateTimeValue(hoursEl, hours);
    updateTimeValue(minutesEl, minutes);
    updateTimeValue(secondsEl, seconds);
}

function updateTimeValue(element, value) {
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== value) {
        element.classList.add('updating');
        element.textContent = String(value).padStart(2, '0');
        setTimeout(() => {
            element.classList.remove('updating');
        }, 300);
    } else {
        element.textContent = String(value).padStart(2, '0');
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Canvas Setup for Cursor Effects
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particles
const particles = [];
const hearts = [];
const sparkles = [];
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;

// Rose Petal Class
class RosePetal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.size = Math.random() * 8 + 5;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.color = ['#ffb6c1', '#ff69b4', '#ffe4e1'][Math.floor(Math.random() * 3)];
        this.life = 1;
        this.decay = Math.random() * 0.002 + 0.001;
    }

    update() {
        // Follow cursor with some lag
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.x += dx * 0.02 + this.vx;
        this.y += dy * 0.02 + this.vy;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.opacity = this.life;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        // Draw petal shape
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Heart Class
class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 - 1;
        this.size = Math.random() * 4 + 3;
        this.opacity = 1;
        this.life = 1;
        this.decay = 0.015;
        this.color = ['#ffb6c1', '#ff69b4'][Math.floor(Math.random() * 2)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // gravity
        this.life -= this.decay;
        this.opacity = this.life;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        
        // Draw heart shape
        ctx.beginPath();
        ctx.scale(this.size / 10, this.size / 10);
        ctx.moveTo(0, 5);
        ctx.bezierCurveTo(0, 0, -5, 0, -5, 5);
        ctx.bezierCurveTo(-5, 8, 0, 10, 0, 12);
        ctx.bezierCurveTo(0, 10, 5, 8, 5, 5);
        ctx.bezierCurveTo(5, 0, 0, 0, 0, 5);
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0 || this.y > canvas.height;
    }
}

// Sparkle Class
class Sparkle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 3 + 2;
        this.opacity = 1;
        this.life = 1;
        this.decay = 0.02;
        this.color = ['#ffb6c1', '#ff69b4', '#ffe4e1', '#ffffff'][Math.floor(Math.random() * 4)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.opacity = this.life;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        // Draw sparkle (star shape)
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5;
            const x = this.x + Math.cos(angle) * this.size;
            const y = this.y + Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Confetti Particle
class ConfettiParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.size = Math.random() * 6 + 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.opacity = 1;
        this.life = 1;
        this.decay = 0.01;
        this.color = ['#ffb6c1', '#ff69b4', '#ffe4e1', '#ffffff'][Math.floor(Math.random() * 4)];
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.opacity = this.life;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0 || this.y > canvas.height + 50;
    }
}

const confettiParticles = [];

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create rose petals following cursor
    if (Math.random() > 0.7) {
        particles.push(new RosePetal(mouseX, mouseY));
    }

    // Create hearts trailing cursor
    const speed = Math.sqrt(
        Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2)
    );
    if (speed > 2 && Math.random() > 0.8) {
        hearts.push(new Heart(mouseX, mouseY));
    }
});

// Click sparkles
document.addEventListener('click', (e) => {
    for (let i = 0; i < 15; i++) {
        sparkles.push(new Sparkle(e.clientX, e.clientY));
    }
});

// Confetti on button click
surpriseBtn.addEventListener('click', (e) => {
    const rect = surpriseBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 50; i++) {
        confettiParticles.push(new ConfettiParticle(x, y));
    }
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw rose petals
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // Update and draw hearts
    for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].isDead()) {
            hearts.splice(i, 1);
        }
    }

    // Update and draw sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].update();
        sparkles[i].draw();
        if (sparkles[i].isDead()) {
            sparkles.splice(i, 1);
        }
    }

    // Update and draw confetti
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        confettiParticles[i].update();
        confettiParticles[i].draw();
        if (confettiParticles[i].isDead()) {
            confettiParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Initialize some petals
for (let i = 0; i < 20; i++) {
    particles.push(new RosePetal(
        Math.random() * canvas.width,
        Math.random() * canvas.height
    ));
}

animate();
const btn = document.getElementById('surprise-btn');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-popup');

// Show popup ONLY on click
btn.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// Close popup
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Close if click outside content
popup.addEventListener('click', (e) => {
    if(e.target === popup){
        popup.style.display = 'none';
    }
});