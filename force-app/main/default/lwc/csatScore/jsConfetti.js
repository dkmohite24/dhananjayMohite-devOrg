class JSConfetti {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '9999'; // ensure it's in the foreground
        this.canvas.style.pointerEvents = 'none'; // ensure it doesn't block other elements
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addConfetti(options) {
        const { emojis, emojiSize, confettiNumber, speed, randomRotation, duration } = options;
        const confettiPieces = [];

        for (let i = 0; i < confettiNumber; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * -this.canvas.height;
            const pieceSpeed = Math.random() * speed + 1; // Set speed based on input parameter
            const drift = (Math.random() - 0.5) * 2; // Random horizontal drift
            const rotate = randomRotation ? (Math.random() * Math.PI) : 0; // Randomly decide if the piece will rotate up to 180 degrees
            const rotationSpeed = randomRotation ? (Math.random() * 0.01 + 0.01) : 0; // Randomly set rotation speed if rotation is enabled
            confettiPieces.push(this.createConfettiPiece(emojis, emojiSize, x, y, pieceSpeed, drift, rotationSpeed, rotate));
        }

        this.animateConfetti(confettiPieces, duration); // Run animation for the specified duration
    }

    createConfettiPiece(emojis, emojiSize, x, y, speed, drift, rotationSpeed, rotationAngle) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        return { emoji, x, y, speed, drift, size: emojiSize, opacity: 1, rotationSpeed, rotationAngle };
    }

    animateConfetti(pieces, duration) {
        const startTime = Date.now();
        const gravity = 0.05; // Gravity effect

        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const fadeOutTime = 1000; // Fade out duration of the last 1 second
            const remainingTime = duration - elapsedTime;

            if (elapsedTime > duration) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                return; // Stop the animation after the duration
            }

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            pieces.forEach(piece => {
                piece.x += piece.drift; // Apply horizontal drift
                piece.y += piece.speed + gravity * elapsedTime / 1000;

                // Apply fade out effect in the last 1 second of the animation
                if (remainingTime < fadeOutTime) {
                    piece.opacity = remainingTime / fadeOutTime;
                }

                this.context.globalAlpha = piece.opacity;
                this.context.font = `${piece.size}px Arial`;

                if (piece.rotationSpeed > 0) {
                    piece.rotationAngle += piece.rotationSpeed; // Increment rotation angle
                    this.context.save();
                    this.context.translate(piece.x, piece.y);
                    this.context.rotate(piece.rotationAngle); // Apply rotation
                    this.context.fillText(piece.emoji, -piece.size / 2, piece.size / 2);
                    this.context.restore();
                } else {
                    this.context.fillText(piece.emoji, piece.x, piece.y);
                }

                this.context.globalAlpha = 1; // Reset global alpha
            });
            requestAnimationFrame(animate);
        };
        animate();
    }
}

export default JSConfetti;