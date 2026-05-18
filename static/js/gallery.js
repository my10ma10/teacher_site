// Модуль галереи
class Gallery {
    constructor() {
        this.images = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.init();
    }
    
    init() {
        // Загрузить изображения из localStorage или использовать демо-данные
        this.loadImages();
        
        // Настроить обработчики событий
        this.setupEventListeners();
        
        // Проверить авторизацию для кнопки добавления
        this.checkAuth();
        
        // Установить текущий год
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }
    
    loadImages() {
        // Сначала попробуем загрузить из localStorage
        const savedImages = localStorage.getItem('galleryImages');
        
        if (savedImages) {
            this.images = JSON.parse(savedImages);
        } else {
            // Демо-данные
            this.images = [
                {
                    id: 1,
                    title: "Урок программирования в 9 классе",
                    description: "Ученики работают над проектами на языке Python",
                    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&h=350&fit=crop",
                    category: "Уроки",
                    date: "15.12.2024",
                    likes: 24
                },
                {
                    id: 2,
                    title: "Школьная олимпиада по информатике",
                    description: "Финал школьного этапа олимпиады",
                    imageUrl: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?w=500&h=350&fit=crop",
                    category: "Олимпиады",
                    date: "10.12.2024",
                    likes: 42
                },
                {
                    id: 3,
                    title: "Защита IT-проектов",
                    description: "Ученики представляют свои годовые проекты",
                    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=500&h=350&fit=crop",
                    category: "Проекты",
                    date: "05.12.2024",
                    likes: 31
                },
                {
                    id: 4,
                    title: "Мастер-класс по робототехнике",
                    description: "Гости из технического университета проводят мастер-класс",
                    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=350&fit=crop",
                    category: "Мероприятия",
                    date: "01.12.2024",
                    likes: 56
                },
                {
                    id: 5,
                    title: "Работа в компьютерном классе",
                    description: "Урок информатики в 7 классе",
                    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=350&fit=crop",
                    category: "Уроки",
                    date: "25.11.2024",
                    likes: 18
                },
                {
                    id: 6,
                    title: "Экскурсия в IT-компанию",
                    description: "Ученики посещают офис технологической компании",
                    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=350&fit=crop",
                    category: "Мероприятия",
                    date: "20.11.2024",
                    likes: 37
                }
            ];
            
            // Сохранить демо-данные в localStorage
            this.saveToLocalStorage();
        }
        
        // Отобразить изображения
        this.renderImages();
    }
    
    renderImages() {
        const container = document.getElementById('galleryContainer');
        const emptyMessage = document.getElementById('emptyGalleryMessage');
        
        if (!container) return;
        
        // Фильтровать изображения
        let filteredImages = this.images;
        
        if (this.currentFilter !== 'all') {
            filteredImages = filteredImages.filter(img => img.category === this.currentFilter);
        }
        
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filteredImages = filteredImages.filter(img => 
                img.title.toLowerCase().includes(searchTerm) ||
                img.description.toLowerCase().includes(searchTerm) ||
                img.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Если нет изображений, показать сообщение
        if (filteredImages.length === 0) {
            container.innerHTML = '';
            if (emptyMessage) {
                emptyMessage.style.display = 'block';
            }
            return;
        }
        
        // Скрыть сообщение если есть изображения
        if (emptyMessage) {
            emptyMessage.style.display = 'none';
        }
        
        // Создать HTML для изображений
        container.innerHTML = filteredImages.map(image => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="gallery-item" data-id="${image.id}">
                    <img src="${image.imageUrl}" alt="${image.title}" 
                         onclick="gallery.openImage(${image.id})">
                    <div class="gallery-overlay">
                        <h6 class="mb-1">${image.title}</h6>
                        <p class="small mb-2">${image.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-light">
                                <i class="fas fa-calendar me-1"></i>${image.date} • 
                                <i class="fas fa-tag me-1 ms-2"></i>${image.category}
                            </small>
                            <div>
                                <button class="btn btn-sm btn-outline-light me-1" onclick="gallery.likeImage(${image.id}, event)">
                                    <i class="fas fa-heart ${image.liked ? 'text-danger' : ''}"></i>
                                    <span class="ms-1">${image.likes || 0}</span>
                                </button>
                                <button class="btn btn-sm btn-outline-light" onclick="gallery.downloadImage(${image.id}, event)">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        // Фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Удалить active у всех кнопок
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Добавить active к нажатой кнопке
                btn.classList.add('active');
                
                // Установить фильтр
                this.currentFilter = btn.dataset.filter;
                this.renderImages();
            });
        });
        
        // Поиск
        const searchInput = document.getElementById('searchGallery');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.renderImages();
            });
        }
        
        // Форма добавления изображения
        const addForm = document.getElementById('addGalleryForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addImage();
            });
        }
        
        // Превью изображения при выборе файла
        const imageInput = document.getElementById('galleryImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.previewImage(e.target);
            });
        }
        
        // Кнопки добавления
        const addBtn = document.getElementById('addToGalleryBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('addToGalleryModal'));
                modal.show();
            });
        }
        
        const addFirstBtn = document.getElementById('addFirstPhotoBtn');
        if (addFirstBtn) {
            addFirstBtn.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('addToGalleryModal'));
                modal.show();
            });
        }
    }
    
    checkAuth() {
        // Проверить, авторизован ли пользователь как учитель
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const isTeacher = user && user.role === 'teacher';
        
        // Показать/скрыть кнопки добавления
        const addBtn = document.getElementById('addToGalleryBtn');
        const addFirstBtn = document.getElementById('addFirstPhotoBtn');
        
        if (addBtn) addBtn.style.display = isTeacher ? 'block' : 'none';
        if (addFirstBtn) addFirstBtn.style.display = isTeacher ? 'block' : 'none';
    }
    
    openImage(id) {
        const image = this.images.find(img => img.id === id);
        if (!image) return;
        
        // Установить данные в модальное окно
        document.getElementById('imageModalTitle').textContent = image.title;
        document.getElementById('lightboxImage').src = image.imageUrl;
        document.getElementById('lightboxImage').alt = image.title;
        document.getElementById('imageModalDescription').textContent = image.description;
        
        // Настроить кнопку скачивания
        const downloadBtn = document.getElementById('downloadImageBtn');
        if (downloadBtn) {
            downloadBtn.href = image.imageUrl;
            downloadBtn.download = `image_${id}.jpg`;
        }
        
        // Показать модальное окно
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }
    
    likeImage(id, event) {
        if (event) event.stopPropagation();
        
        const image = this.images.find(img => img.id === id);
        if (!image) return;
        
        // Переключить лайк
        image.liked = !image.liked;
        image.likes = image.liked ? (image.likes || 0) + 1 : Math.max(0, (image.likes || 1) - 1);
        
        // Сохранить изменения
        this.saveToLocalStorage();
        
        // Обновить отображение
        this.renderImages();
        
        // Показать уведомление
        if (image.liked) {
            showNotification('Вам понравилось это фото!', 'success');
        }
    }
    
    downloadImage(id, event) {
        if (event) event.stopPropagation();
        
        const image = this.images.find(img => img.id === id);
        if (!image) return;
        
        // Создать временную ссылку для скачивания
        const link = document.createElement('a');
        link.href = image.imageUrl;
        link.download = `gallery_${id}_${image.title.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Изображение скачивается...', 'info');
    }
    
    downloadGallery() {
        // Создать ZIP архив со всеми изображениями
        showNotification('Функция скачивания всей галереи в разработке', 'info');
        
        // В реальном проекте здесь была бы реализация создания ZIP архива
        // через библиотеку JSZip и скачивание всех изображений
    }
    
    addImage() {
        const title = document.getElementById('galleryTitle').value;
        const description = document.getElementById('galleryDescription').value;
        const category = document.getElementById('galleryCategory').value;
        const dateInput = document.getElementById('galleryDate').value;
        const imageInput = document.getElementById('galleryImage');
        
        if (!title || !imageInput.files.length) {
            showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Создать URL для выбранного изображения
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const newImage = {
                id: this.images.length > 0 ? Math.max(...this.images.map(img => img.id)) + 1 : 1,
                title: title,
                description: description || '',
                imageUrl: e.target.result,
                category: category || 'Другое',
                date: dateInput ? new Date(dateInput).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU'),
                likes: 0,
                liked: false
            };
            
            // Добавить изображение в начало массива
            this.images.unshift(newImage);
            
            // Сохранить в localStorage
            this.saveToLocalStorage();
            
            // Обновить отображение
            this.renderImages();
            
            // Очистить форму
            document.getElementById('addGalleryForm').reset();
            document.getElementById('imagePreview').style.display = 'none';
            
            // Закрыть модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('addToGalleryModal'));
            modal.hide();
            
            // Показать уведомление
            showNotification('Изображение успешно добавлено в галерею!', 'success');
            
            // Прокрутить к новому изображению
            setTimeout(() => {
                const firstImage = document.querySelector('.gallery-item');
                if (firstImage) {
                    firstImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        };
        
        reader.readAsDataURL(file);
    }
    
    previewImage(input) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImage');
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                preview.style.display = 'block';
                previewImg.src = e.target.result;
            };
            
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.style.display = 'none';
            previewImg.src = '';
        }
    }
    
    saveToLocalStorage() {
        localStorage.setItem('galleryImages', JSON.stringify(this.images));
    }
    
    // Удалить изображение (только для админа)
    deleteImage(id) {
        if (!confirm('Удалить это изображение?')) return;
        
        this.images = this.images.filter(img => img.id !== id);
        this.saveToLocalStorage();
        this.renderImages();
        
        showNotification('Изображение удалено', 'success');
    }
}

// Функции для работы с видео
function playVideo(videoId) {
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    const player = document.getElementById('videoPlayer');
    const title = document.getElementById('videoModalTitle');
    
    // Установить URL видео
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    // Установить заголовок
    const videos = {
        'dQw4w9WgXcQ': 'Введение в программирование на Python',
        'UB1O30fR-EE': 'Создание веб-сайта на HTML/CSS'
    };
    
    title.textContent = videos[videoId] || 'Видеоурок';
    
    // Показать модальное окно
    modal.show();
    
    // Остановить видео при закрытии модального окна
    document.getElementById('videoModal').addEventListener('hidden.bs.modal', () => {
        player.src = '';
    });
}

// Инициализация галереи
let gallery;

document.addEventListener('DOMContentLoaded', () => {
    gallery = new Gallery();
    
    // Экспорт функций для глобального доступа
    window.gallery = gallery;
    window.playVideo = playVideo;
});

// Глобальная функция для скачивания галереи
window.downloadGallery = () => {
    if (gallery) {
        gallery.downloadGallery();
    }
};