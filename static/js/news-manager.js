// Менеджер новостей
class NewsManager {
    constructor() {
        this.news = [];
        this.categories = ['общее', 'олимпиада', 'конкурс', 'мероприятие', 'расписание'];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentSort = 'newest';
        this.itemsPerPage = 6;
        this.currentPage = 1;
        this.init();
    }

    
    
    init() {
        // Загрузить новости из localStorage
        this.loadNews();
        
        // Проверить авторизацию для админ-контролов
        this.checkAuth();
        
        // Настроить обработчики событий
        this.setupEventListeners();
        
        // Отобразить новости
        this.renderNews();
        
        // Обновить статистику
        this.updateStats();
    }
    
    loadNews() {
        const savedNews = localStorage.getItem('teacherNews');
        
        if (savedNews) {
            this.news = JSON.parse(savedNews);
        } else {
            // Демо-новости
            this.news = [
                {
                    id: 1,
                    title: 'Подготовка к олимпиаде по информатике',
                    shortContent: 'Начинается подготовка к региональному этапу олимпиады по информатике. Занятия будут проходить по средам после уроков.',
                    fullContent: 'Уважаемые ученики! Начинается подготовка к региональному этапу всероссийской олимпиады школьников по информатике. Занятия будут проходить каждую среду с 15:00 до 16:30 в кабинете 305. Приглашаются ученики 8-11 классов, желающие углубить свои знания по программированию и алгоритмам. Программа подготовки включает: решение олимпиадных задач, разбор типовых заданий, практикумы по программированию на Python и C++. Для участия необходимо записаться через форму обратной связи.',
                    category: 'олимпиада',
                    date: '20.12.2024',
                    time: '14:00',
                    views: 247,
                    likes: 24,
                    important: true,
                    pinned: true,
                    image: null,
                    author: 'Иванова А.П.'
                },
                {
                    id: 2,
                    title: 'Новые материалы по Python',
                    shortContent: 'В разделе "Методкопилка" добавлены новые материалы по программированию на Python для 9-11 классов.',
                    fullContent: 'Рада сообщить, что в разделе "Методкопилка" добавлены новые учебные материалы по программированию на Python: видеоуроки по основам языка, презентации для уроков, практические задания с решениями, тесты для самопроверки. Материалы распределены по уровням сложности и подходят как для начинающих, так и для продолжающих изучение Python. Особое внимание уделено подготовке к ОГЭ и ЕГЭ по информатике. Все материалы доступны для скачивания.',
                    category: 'материалы',
                    date: '18.12.2024',
                    time: '11:30',
                    views: 156,
                    likes: 31,
                    important: false,
                    pinned: false,
                    image: null,
                    author: 'Иванова А.П.'
                },
                {
                    id: 3,
                    title: 'Итоги конкурса IT-проектов',
                    shortContent: 'Подведены итоги школьного конкурса IT-проектов. Победители будут награждены на общешкольной линейке.',
                    fullContent: 'Подведены итоги ежегодного школьного конкурса IT-проектов. В этом году в конкурсе приняли участие 45 учеников 7-11 классов. Было представлено 32 проекта в номинациях: веб-разработка, мобильные приложения, игры, искусственный интеллект. Победители: 1 место - Иванов Иван (11А) за проект "Умный помощник учителя", 2 место - Петрова Мария (9Б) за игру "Изучаем Python", 3 место - Сидоров Алексей (10А) за веб-приложение "Электронный дневник". Все участники получат сертификаты, а победители - дипломы и ценные призы. Награждение состоится на общешкольной линейке в пятницу в 10:00.',
                    category: 'конкурс',
                    date: '15.12.2024',
                    time: '16:20',
                    views: 89,
                    likes: 42,
                    important: true,
                    pinned: false,
                    image: null,
                    author: 'Иванова А.П.'
                },
                {
                    id: 4,
                    title: 'Изменение в расписании',
                    shortContent: 'Внесены изменения в расписание уроков информатики на следующую неделю.',
                    fullContent: 'Внимание! Внесены изменения в расписание уроков информатики на следующую неделю: понедельник - 7А (10:00-10:45), 8Б (11:00-11:45), среда - 9А (13:00-13:45), 10А (14:00-14:45), пятница - 11А (09:00-09:45). Изменения связаны с проведением промежуточной аттестации. Просьба ознакомиться с новым расписанием. Приносим извинения за доставленные неудобства.',
                    category: 'расписание',
                    date: '12.12.2024',
                    time: '09:15',
                    views: 312,
                    likes: 15,
                    important: true,
                    pinned: true,
                    image: null,
                    author: 'Иванова А.П.'
                },
                {
                    id: 5,
                    title: 'Мастер-класс по веб-разработке',
                    shortContent: 'Приглашаем на мастер-класс по созданию современных веб-сайтов с использованием HTML, CSS и JavaScript.',
                    fullContent: 'Дорогие ученики! Приглашаю вас на мастер-класс по веб-разработке, который состоится 25 декабря в 14:00 в кабинете 305. На мастер-классе мы научимся создавать современные адаптивные веб-сайты, разберем основы HTML5 и CSS3, познакомимся с фреймворком Bootstrap, создадим свой первый интерактивный сайт на JavaScript. Мастер-класс будет полезен как начинающим, так и тем, кто уже имеет опыт в веб-разработке. Количество мест ограничено, необходима предварительная запись через форму обратной связи. Жду всех желающих!',
                    category: 'мероприятие',
                    date: '10.12.2024',
                    time: '13:45',
                    views: 178,
                    likes: 28,
                    important: false,
                    pinned: false,
                    image: null,
                    author: 'Иванова А.П.'
                }
            ];
            
            this.saveNews();
        }
    }
    
    saveNews() {
        localStorage.setItem('teacherNews', JSON.stringify(this.news));
    }
    
    checkAuth() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const token = localStorage.getItem('authToken');
        
        if (user && token && user.role === 'teacher') {
            document.getElementById('adminControls').style.display = 'block';
        }
    }
    
    setupEventListeners() {
        // Поиск
        document.getElementById('searchNews').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.renderNews();
        });
        
        // Сортировка
        document.getElementById('sortNews').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderNews();
        });
        
        // Фильтры категорий
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.currentPage = 1;
                this.renderNews();
            });
        });
        
        // Форма добавления новости
        const addNewsForm = document.getElementById('addNewsForm');
        if (addNewsForm) {
            addNewsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNews();
            });
        }
        
        // Предпросмотр изображения
        const newsImage = document.getElementById('newsImage');
        if (newsImage) {
            newsImage.addEventListener('change', (e) => {
                this.previewImage(e.target);
            });
        }
    }
    
    previewImage(input) {
        const preview = document.getElementById('imagePreview');
        const previewImg = preview?.querySelector('img');
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (preview) {
                    preview.style.display = 'block';
                    if (previewImg) {
                        previewImg.src = e.target.result;
                    }
                }
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            if (preview) {
                preview.style.display = 'none';
            }
        }
    }
    
    addNews() {
        const title = document.getElementById('newsTitle').value;
        const category = document.getElementById('newsCategory').value;
        const shortContent = document.getElementById('newsShortContent').value;
        const fullContent = document.getElementById('newsFullContent').value;
        const date = document.getElementById('newsDate').value;
        const time = document.getElementById('newsTime').value;
        const important = document.getElementById('newsImportant').checked;
        const pinned = document.getElementById('newsPin').checked;
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (!title || !shortContent || !fullContent) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Форматируем дату
        let newsDate = date ? date.split('-').reverse().join('.') : new Date().toLocaleDateString('ru-RU');
        let newsTime = time || new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        const newNews = {
            id: this.news.length > 0 ? Math.max(...this.news.map(n => n.id)) + 1 : 1,
            title: title,
            shortContent: shortContent,
            fullContent: fullContent,
            category: category,
            date: newsDate,
            time: newsTime,
            views: 0,
            likes: 0,
            important: important,
            pinned: pinned,
            image: null,
            author: user.fullName || 'Иванова А.П.'
        };
        
        // Если есть изображение
        const imageInput = document.getElementById('newsImage');
        if (imageInput && imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newNews.image = e.target.result;
                this.news.unshift(newNews);
                this.saveNews();
                this.renderNews();
                this.updateStats();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            this.news.unshift(newNews);
            this.saveNews();
            this.renderNews();
            this.updateStats();
        }
        
        // Закрыть модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('addNewsModal'));
        if (modal) modal.hide();
        
        // Очистить форму
        document.getElementById('addNewsForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        
        // Показать уведомление
        this.showNotification('Новость успешно добавлена!', 'success');
    }
    
    deleteNews(id) {
        if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;
        
        this.news = this.news.filter(n => n.id !== id);
        this.saveNews();
        this.renderNews();
        this.updateStats();
        
        this.showNotification('Новость удалена', 'warning');
    }
    
    editNews(id) {
        // Функция для редактирования новости
        const news = this.news.find(n => n.id === id);
        if (!news) return;
        
        // Заполнить форму данными
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsCategory').value = news.category;
        document.getElementById('newsShortContent').value = news.shortContent;
        document.getElementById('newsFullContent').value = news.fullContent;
        
        // Конвертируем дату
        if (news.date) {
            const [day, month, year] = news.date.split('.');
            document.getElementById('newsDate').value = `${year}-${month}-${day}`;
        }
        
        document.getElementById('newsTime').value = news.time || '';
        document.getElementById('newsImportant').checked = news.important || false;
        document.getElementById('newsPin').checked = news.pinned || false;
        
        // Удалить старую и открыть форму
        this.news = this.news.filter(n => n.id !== id);
        
        const modal = new bootstrap.Modal(document.getElementById('addNewsModal'));
        modal.show();
        
        this.showNotification('Редактируйте новость и сохраните заново', 'info');
    }
    
    getFilteredNews() {
        let filtered = [...this.news];
        
        // Фильтр по категории
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(news => news.category === this.currentFilter);
        }
        
        // Фильтр по поиску
        if (this.currentSearch) {
            filtered = filtered.filter(news => 
                news.title.toLowerCase().includes(this.currentSearch) ||
                news.shortContent.toLowerCase().includes(this.currentSearch) ||
                news.fullContent.toLowerCase().includes(this.currentSearch)
            );
        }
        
        // Сортировка
        switch(this.currentSort) {
            case 'newest':
                filtered.sort((a, b) => this.parseDate(b.date) - this.parseDate(a.date));
                break;
            case 'oldest':
                filtered.sort((a, b) => this.parseDate(a.date) - this.parseDate(b.date));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'views':
                filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
                break;
        }
        
        // Закрепленные новости всегда сверху
        filtered.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0;
        });
        
        return filtered;
    }
    
    parseDate(dateStr) {
        if (!dateStr) return 0;
        const [day, month, year] = dateStr.split('.');
        return new Date(year, month - 1, day).getTime();
    }
    
    renderNews() {
        const container = document.getElementById('newsContainer');
        const pagination = document.getElementById('pagination');
        
        if (!container) return;
        
        const filteredNews = this.getFilteredNews();
        const totalPages = Math.ceil(filteredNews.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const pageNews = filteredNews.slice(start, start + this.itemsPerPage);
        
        if (pageNews.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-newspaper fa-4x text-muted mb-3"></i>
                    <h4>Новостей не найдено</h4>
                    <p class="text-muted">Попробуйте изменить параметры поиска</p>
                </div>
            `;
        } else {
            container.innerHTML = pageNews.map(news => this.createNewsCard(news)).join('');
        }
        
        if (pagination) {
            this.renderPagination(totalPages);
        }
    }
    
    createNewsCard(news) {
        const categoryClass = `category-${news.category}`;
        const importantClass = news.important ? 'border-warning border-3' : '';
        const pinnedIcon = news.pinned ? '<i class="fas fa-thumbtack text-warning ms-2" title="Закреплено"></i>' : '';
        const isTeacher = this.isTeacher();
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card news-card h-100 ${importantClass}" data-id="${news.id}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="news-category ${categoryClass}">${this.capitalize(news.category)}</span>
                            <div>
                                ${pinnedIcon}
                                <small class="text-muted">👁 ${news.views || 0}</small>
                            </div>
                        </div>
                        
                        <h5 class="card-title mt-2">
                            ${news.title}
                            ${news.important ? '<span class="badge bg-danger ms-2">Важно!</span>' : ''}
                        </h5>
                        
                        <div class="news-date mb-3">
                            <i class="fas fa-calendar-alt"></i> ${news.date || 'Дата не указана'}
                            ${news.time ? `<i class="fas fa-clock ms-3"></i> ${news.time}` : ''}
                        </div>
                        
                        <p class="card-text">${news.shortContent || '...'}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <small class="text-muted">
                                    <i class="fas fa-user me-1"></i>${news.author || 'Учитель'}
                                </small>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-primary" onclick="newsManager.viewNews(${news.id})">
                                    Читать <i class="fas fa-arrow-right ms-1"></i>
                                </button>
                                ${isTeacher ? `
                                    <button class="btn btn-sm btn-outline-warning" onclick="newsManager.editNews(${news.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="newsManager.deleteNews(${news.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        let html = '';
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        if (this.currentPage > 1) {
            html += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="newsManager.changePage(${this.currentPage - 1})">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
            `;
        }
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
            } else if (i === 1 || i === totalPages || Math.abs(i - this.currentPage) <= 2) {
                html += `
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="newsManager.changePage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        if (this.currentPage < totalPages) {
            html += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="newsManager.changePage(${this.currentPage + 1})">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;
        }
        
        pagination.innerHTML = html;
    }
    
    changePage(page) {
        this.currentPage = page;
        this.renderNews();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    viewNews(id) {
        const news = this.news.find(n => n.id === id);
        if (!news) return;
        
        // Увеличиваем просмотры
        news.views = (news.views || 0) + 1;
        this.saveNews();
        
        // Заполняем модальное окно
        document.getElementById('modalNewsTitle').textContent = news.title;
        document.getElementById('modalNewsCategory').textContent = this.capitalize(news.category);
        document.getElementById('modalNewsDate').innerHTML = `
            <i class="fas fa-calendar-alt me-1"></i>${news.date || 'Дата не указана'} 
            ${news.time ? `<i class="fas fa-clock ms-2 me-1"></i>${news.time}` : ''}
            <i class="fas fa-eye ms-2 me-1"></i>${news.views || 0}
        `;
        document.getElementById('modalNewsContent').innerHTML = news.fullContent.replace(/\n/g, '<br>');
        document.getElementById('modalNewsAuthor').innerHTML = `
            <small class="text-muted">
                <i class="fas fa-user me-1"></i>Автор: ${news.author || 'Учитель'}
            </small>
        `;
        
        // Если есть изображение
        const modalImage = document.getElementById('modalNewsImage');
        if (news.image) {
            modalImage.querySelector('img').src = news.image;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('newsModal'));
        modal.show();
    }
    
    updateStats() {
        const totalNews = document.getElementById('totalNews');
        const thisMonthNews = document.getElementById('thisMonthNews');
        const thisWeekNews = document.getElementById('thisWeekNews');
        const categoriesCount = document.getElementById('categoriesCount');
        
        if (totalNews) totalNews.textContent = this.news.length;
        
        // Подсчет за месяц
        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const monthCount = this.news.filter(n => {
            if (!n.date) return false;
            const [day, month, year] = n.date.split('.');
            const newsDate = new Date(year, month - 1, day);
            return newsDate > monthAgo;
        }).length;
        
        if (thisMonthNews) thisMonthNews.textContent = monthCount;
        
        // Подсчет за неделю
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekCount = this.news.filter(n => {
            if (!n.date) return false;
            const [day, month, year] = n.date.split('.');
            const newsDate = new Date(year, month - 1, day);
            return newsDate > weekAgo;
        }).length;
        
        if (thisWeekNews) thisWeekNews.textContent = weekCount;
        
        // Количество категорий
        const uniqueCategories = [...new Set(this.news.map(n => n.category))].length;
        if (categoriesCount) categoriesCount.textContent = uniqueCategories;
    }
    
    isTeacher() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const token = localStorage.getItem('authToken');
        return !!(user && token && user.role === 'teacher');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Инициализация менеджера новостей
let newsManager;

document.addEventListener('DOMContentLoaded', () => {
    newsManager = new NewsManager();
    window.newsManager = newsManager;
    
    // Добавить функцию подписки
    window.subscribeNews = function() {
        const email = document.getElementById('subscribeEmail').value;
        if (!email) {
            alert('Введите email');
            return;
        }
        
        // Сохранить подписчика
        let subscribers = JSON.parse(localStorage.getItem('newsSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsSubscribers', JSON.stringify(subscribers));
            newsManager.showNotification('Вы успешно подписались на новости!', 'success');
        } else {
            newsManager.showNotification('Вы уже подписаны', 'info');
        }
        
        document.getElementById('subscribeEmail').value = '';
    };
    
    // Функция для добавления категории
    window.addCategory = function() {
        const newCat = document.getElementById('newCategory').value.trim().toLowerCase();
        if (!newCat) return;
        
        if (!newsManager.categories.includes(newCat)) {
            newsManager.categories.push(newCat);
            localStorage.setItem('newsCategories', JSON.stringify(newsManager.categories));
            
            // Обновить выпадающие списки
            const categorySelect = document.getElementById('newsCategory');
            if (categorySelect) {
                const option = document.createElement('option');
                option.value = newCat;
                option.textContent = newsManager.capitalize(newCat);
                categorySelect.appendChild(option);
            }
            
            newsManager.showNotification('Категория добавлена', 'success');
            document.getElementById('newCategory').value = '';
        } else {
            newsManager.showNotification('Такая категория уже существует', 'warning');
        }
    };
});