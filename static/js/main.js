// Основной файл JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initPage();
    initCounters();
    initTimers();
    initForms();
    initBackToTop();
    
    // Установка текущего года в футере
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('lastUpdated').textContent = formatDate(new Date());
    
    // Загрузка новостей
    loadNews();
    
    // Показать уведомление при первом посещении
    if (!localStorage.getItem('visited')) {
        showNotification('Добро пожаловать на сайт учителя информатики!', 'info');
        localStorage.setItem('visited', 'true');
    }
    
    // Тема (светлая/темная)
    initTheme();
});

// Инициализация страницы
function initPage() {
    console.log('Сайт учителя информатики загружен');
    
    // Добавить анимации при прокрутке
    initScrollAnimations();
    
    // Инициализировать tooltips
    initTooltips();
    
    // Инициализировать модальные окна
    initModals();
}

// Анимации при прокрутке
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Счетчики
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Запустить счетчик когда элемент появится в viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// Таймеры
function initTimers() {
    // Таймер 1 (олимпиада)
    const olympiadDate = new Date();
    olympiadDate.setDate(olympiadDate.getDate() + 15);
    startTimer('timer1', olympiadDate);
    
    // Таймер 2 (защита проектов)
    const projectDate = new Date();
    projectDate.setDate(projectDate.getDate() + 30);
    startTimer('timer2', projectDate);
}

function startTimer(timerId, endDate) {
    const timer = document.getElementById(timerId);
    if (!timer) return;
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;
        
        if (distance < 0) {
            timer.innerHTML = "<span class='text-success'>Событие началось!</span>";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        const daysSpan = timer.querySelector('.days');
        const hoursSpan = timer.querySelector('.hours');
        const minutesSpan = timer.querySelector('.minutes');
        
        if (daysSpan) daysSpan.textContent = String(days).padStart(2, '0');
        if (hoursSpan) hoursSpan.textContent = String(hours).padStart(2, '0');
        if (minutesSpan) minutesSpan.textContent = String(minutes).padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 60000);
}

// Формы
function initForms() {
    // Быстрая обратная связь
    const feedbackForm = document.getElementById('quickFeedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('feedbackName').value;
            const email = document.getElementById('feedbackEmail').value;
            const message = document.getElementById('feedbackMessage').value;
            
            if (name && email && message) {
                // Здесь можно отправить данные на сервер
                showNotification('Сообщение отправлено! Я отвечу вам в ближайшее время.', 'success');
                
                // Сохранить в localStorage
                saveFeedback({ name, email, message, date: new Date() });
                
                // Очистить форму
                feedbackForm.reset();
                
                // Закрыть модальное окно
                const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
                modal.hide();
            } else {
                showNotification('Пожалуйста, заполните все поля.', 'error');
            }
        });
    }
}

// Сохранение обратной связи в localStorage
function saveFeedback(feedback) {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

// Кнопка "Наверх"
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Форматирование даты
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Поделиться в соцсетях
function shareOnVK() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://vk.com/share.php?url=${url}&title=${title}`, '_blank');
}

function shareOnTelegram() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

function sendEmail() {
    window.location.href = 'mailto:teacher@school8.ru?subject=Вопрос с сайта учителя информатики';
}

// Инициализация темы
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Проверить сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

// Tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Модальные окна
function initModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            console.log('Модальное окно открыто:', modal.id);
        });
    });
}

// Поиск по сайту
function searchSite() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query.trim()) return;
    
    // Здесь можно реализовать поиск по страницам
    showNotification(`Поиск: ${query}`, 'info');
    
    // Простой поиск по текущей странице
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
    let found = false;
    
    elements.forEach(element => {
        if (element.textContent.toLowerCase().includes(query)) {
            element.style.backgroundColor = '#fff3cd';
            setTimeout(() => {
                element.style.backgroundColor = '';
            }, 3000);
            found = true;
        }
    });
    
    if (!found) {
        showNotification('Ничего не найдено', 'warning');
    }
}

// Экспорт функций для использования в других файлах
window.showNotification = showNotification;
window.searchSite = searchSite;