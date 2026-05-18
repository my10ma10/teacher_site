// Анимации и эффекты
class Animations {
    constructor() {
        this.init();
    }
    
    init() {
        // Инициализация анимаций при прокрутке
        this.initScrollAnimations();
        
        // Эффекты при наведении
        this.initHoverEffects();
        
        // Параллакс эффект
        this.initParallax();
        
        // Анимация загрузки
        this.initLoadingAnimations();
    }
    
    initScrollAnimations() {
        // Анимация элементов при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Наблюдать за всеми элементами с классом .animate-on-scroll
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    initHoverEffects() {
        // Эффект при наведении на карточки
        const cards = document.querySelectorAll('.card, .quick-link-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addHoverEffect(e.currentTarget);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeHoverEffect(e.currentTarget);
            });
        });
        
        // Эффект при наведении на кнопки
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.addButtonEffect(e.currentTarget);
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.removeButtonEffect(e.currentTarget);
            });
        });
    }
    
    addHoverEffect(element) {
        element.style.transform = 'translateY(-10px) scale(1.02)';
        element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        element.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    }
    
    removeHoverEffect(element) {
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = '';
    }
    
    addButtonEffect(element) {
        element.style.transform = 'translateY(-3px)';
        element.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    }
    
    removeButtonEffect(element) {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = '';
    }
    
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    initLoadingAnimations() {
        // Анимация загрузки контента
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            setTimeout(() => {
                loadingIndicator.classList.add('fade-out');
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                }, 500);
            }, 1000);
        }
        
        // Анимация появления контента
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.classList.add('fade-in');
        }
    }
    
    // Анимация печатной машинки
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Анимация счетчика
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Эффект конфетти
    showConfetti() {
        const confettiCount = 100;
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}vw;
                border-radius: 2px;
                z-index: 9999;
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            // Удалить после анимации
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
        
        // Добавить CSS для анимации падения
        if (!document.querySelector('#confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Инициализация анимаций
const animations = new Animations();

// Глобальные функции
window.typeWriter = (element, text, speed) => animations.typeWriter(element, text, speed);
window.animateCounter = (element, target, duration) => animations.animateCounter(element, target, duration);
window.showConfetti = () => animations.showConfetti();