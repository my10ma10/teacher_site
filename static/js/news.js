// Модуль новостей
class News {
    constructor() {
        this.news = [
            {
                id: 1,
                title: 'Подготовка к олимпиаде по информатике',
                content: 'Начинается подготовка к региональному этапу олимпиады по информатике. Занятия будут проходить по средам после уроков в кабинете 305.',
                date: '20.12.2024',
                category: 'олимпиада'
            },
            {
                id: 2,
                title: 'Новые материалы по Python',
                content: 'В разделе "Методкопилка" добавлены новые материалы по программированию на Python для 9-11 классов. Включая видеоуроки и практические задания.',
                date: '18.12.2024',
                category: 'материалы'
            },
            {
                id: 3,
                title: 'Итоги конкурса проектов',
                content: 'Подведены итоги школьного конкурса IT-проектов. Победители будут награждены на общешкольной линейке в пятницу.',
                date: '15.12.2024',
                category: 'конкурс'
            },
            {
                id: 4,
                title: 'Обновление расписания',
                content: 'Внесены изменения в расписание занятий по информатике на следующую неделю. Ознакомьтесь с актуальным расписанием.',
                date: '12.12.2024',
                category: 'расписание'
            },
            {
                id: 5,
                title: 'Мастер-класс по веб-разработке',
                content: 'Приглашаем всех желающих на мастер-класс по созданию веб-сайтов, который пройдет в эту субботу в 11:00.',
                date: '10.12.2024',
                category: 'мероприятие'
            }
        ];
        
        this.currentPage = 1;
        this.itemsPerPage = 3;
    }
    
    loadNews(page = 1) {
        this.currentPage = page;
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.news.slice(start, end);
    }
    
    renderNews() {
        const container = document.getElementById('newsContainer');
        if (!container) return;
        
        const newsToShow = this.loadNews(this.currentPage);
        
        if (newsToShow.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Новостей пока нет</p></div>';
            return;
        }
        
        container.innerHTML = newsToShow.map(item => `
            <div class="col-md-4 mb-4">
                <div class="card news-card h-100">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2">${item.date}</span>
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.content.substring(0, 100)}...</p>
                        <button class="btn btn-sm btn-outline-primary" onclick="showNewsDetail(${item.id})">
                            Читать полностью
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getNewsById(id) {
        return this.news.find(item => item.id === id);
    }
    
    showNewsModal(id) {
        const newsItem = this.getNewsById(id);
        if (!newsItem) return;
        
        const modalHTML = `
            <div class="modal fade" id="newsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${newsItem.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p class="text-muted">${newsItem.date}</p>
                            <p>${newsItem.content}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавить модальное окно в DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Показать модальное окно
        const modal = new bootstrap.Modal(document.getElementById('newsModal'));
        modal.show();
        
        // Удалить модальное окно после закрытия
        document.getElementById('newsModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }
    
    addNews(title, content, category = 'общее') {
        const newNews = {
            id: this.news.length + 1,
            title,
            content,
            date: new Date().toLocaleDateString('ru-RU'),
            category
        };
        
        this.news.unshift(newNews);
        this.saveToLocalStorage();
        this.renderNews();
        return newNews;
    }
    
    saveToLocalStorage() {
        localStorage.setItem('teacher-news', JSON.stringify(this.news));
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('teacher-news');
        if (saved) {
            this.news = JSON.parse(saved);
        }
    }
}

// Инициализация новостей
const newsManager = new News();

// Глобальные функции
window.loadNews = () => newsManager.renderNews();
window.loadMoreNews = () => {
    newsManager.currentPage++;
    newsManager.renderNews();
};
window.showNewsDetail = (id) => newsManager.showNewsModal(id);
window.addNews = (title, content) => newsManager.addNews(title, content);

// Загрузить новости при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    newsManager.loadFromLocalStorage();
    loadNews();
});