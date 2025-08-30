// --- PARTICLE ANIMATION BACKGROUND ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Smaller particles
        this.speedX = (Math.random() * 0.4 - 0.2) * 0.5; // Slower speed
        this.speedY = (Math.random() * 0.4 - 0.2) * 0.5; // Slower speed
        this.color = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.1})`; // Gold, more transparent
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle if it goes out of bounds
        if (this.size > 0.2) this.size -= 0.01;
        if (this.size <= 0.2) {
             this.x = Math.random() * canvas.width;
             this.y = Math.random() * canvas.height;
             this.size = Math.random() * 1.5 + 0.5;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    // Fewer particles for a more subtle effect
    const particleCount = (canvas.width * canvas.height) / 15000;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const particle of particles) {
        particle.update();
        particle.draw();
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    setCanvasSize();
    initParticles();
});

// Initial setup
setCanvasSize();
initParticles();
animate();