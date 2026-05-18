// Модуль аутентификации
class Auth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }
    
    init() {
        // Проверить сохраненную сессию
        this.checkSavedSession();
        
        // Настроить форму входа
        this.setupLoginForm();
        
        // Настроить кнопку выхода
        this.setupLogoutButton();
        
        // Обновить UI при загрузке страницы
        setTimeout(() => this.updateUI(), 100);
    }
    
    checkSavedSession() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            const savedToken = localStorage.getItem('authToken');
            
            if (savedUser && savedToken) {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
            }
        } catch (e) {
            console.error('Ошибка при чтении сохраненной сессии:', e);
            this.clearSession();
        }
    }
    
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
    }
    
    setupLogoutButton() {
        // Настроим кнопку выхода динамически в updateUI
    }
    
    login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;
        
        // Проверка учетных данных
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = {
                id: 1,
                username: 'admin',
                fullName: 'Иванова Анна Петровна',
                role: 'teacher'
            };
            
            this.isAuthenticated = true;
            
            // Сохранить в localStorage
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('authToken', 'fake-jwt-token');
            
            // Обновить интерфейс
            this.updateUI();
            
            // Показать уведомление
            if (window.showNotification) {
                window.showNotification('Вход выполнен успешно!', 'success');
            } else {
                this.showAlert('Вход выполнен успешно!', 'success');
            }
            
            // Закрыть модальное окно
            const modalElement = document.getElementById('loginModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
            
            // Перенаправить в админ-панель через 1 секунду
            setTimeout(() => {
                // Проверить, есть ли сохраненный URL для возврата
                const redirectUrl = localStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                } else {
                    // Иначе перейти в админку
                    window.location.href = 'admin/index.html';
                }
            }, 1000);
            
        } else {
            if (window.showNotification) {
                window.showNotification('Неверный логин или пароль', 'error');
            } else {
                this.showAlert('Неверный логин или пароль', 'error');
            }
            document.getElementById('loginPassword').value = '';
        }
    }
    
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Удалить из localStorage
        this.clearSession();
        
        // Обновить интерфейс
        this.updateUI();
        
        // Показать уведомление
        if (window.showNotification) {
            window.showNotification('Вы вышли из системы', 'info');
        }
        
        // Если находимся в админке, перенаправить на главную
        if (window.location.pathname.includes('admin')) {
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        } else {
            // Перезагрузить страницу
            window.location.reload();
        }
    }
    
    clearSession() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
    }
    
    updateUI() {
        // Находим элементы навигации
        const navbarNav = document.querySelector('.navbar-nav');
        if (!navbarNav) return;
        
        // Находим кнопку входа
        const loginBtn = navbarNav.querySelector('[data-bs-target="#loginModal"]');
        const loginLi = loginBtn?.closest('.nav-item');
        
        // Проверяем авторизацию
        if (this.isAuthenticated && this.currentUser) {
            // Удаляем кнопку входа
            if (loginLi) {
                loginLi.style.display = 'none';
            }
            
            // Проверяем, есть ли уже ссылка на админку
            let adminLink = document.getElementById('adminLink');
            let logoutLink = document.getElementById('logoutLink');
            
            // Создаем ссылку на админку если её нет
            if (!adminLink) {
                adminLink = document.createElement('a');
                adminLink.className = 'nav-link';
                adminLink.id = 'adminLink';
                adminLink.href = 'admin/index.html';
                adminLink.innerHTML = '<i class="fas fa-cog me-1"></i>Панель управления';
                
                const adminLi = document.createElement('li');
                adminLi.className = 'nav-item';
                adminLi.appendChild(adminLink);
                
                // Вставляем после кнопки входа или в конец
                if (loginLi && loginLi.parentNode === navbarNav) {
                    navbarNav.insertBefore(adminLi, loginLi.nextSibling);
                } else {
                    navbarNav.appendChild(adminLi);
                }
            }
            
            // Создаем кнопку выхода если её нет
            if (!logoutLink) {
                logoutLink = document.createElement('a');
                logoutLink.className = 'nav-link';
                logoutLink.id = 'logoutLink';
                logoutLink.href = '#';
                logoutLink.innerHTML = '<i class="fas fa-sign-out-alt me-1"></i>Выйти';
                logoutLink.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
                
                const logoutLi = document.createElement('li');
                logoutLi.className = 'nav-item';
                logoutLi.appendChild(logoutLink);
                
                // Вставляем после ссылки на админку
                const adminLi = adminLink.closest('.nav-item');
                if (adminLi && adminLi.parentNode === navbarNav) {
                    navbarNav.insertBefore(logoutLi, adminLi.nextSibling);
                } else {
                    navbarNav.appendChild(logoutLi);
                }
            }
            
        } else {
            // Показываем кнопку входа
            if (loginLi) {
                loginLi.style.display = 'block';
            }
            
            // Удаляем ссылку на админку если она есть
            const adminLink = document.getElementById('adminLink');
            if (adminLink) {
                const adminLi = adminLink.closest('.nav-item');
                if (adminLi) adminLi.remove();
            }
            
            // Удаляем кнопку выхода если она есть
            const logoutLink = document.getElementById('logoutLink');
            if (logoutLink) {
                const logoutLi = logoutLink.closest('.nav-item');
                if (logoutLi) logoutLi.remove();
            }
        }
    }
    
    showAlert(message, type = 'info') {
        // Создаем временное уведомление
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Автоматически скрыть через 5 секунд
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    // Проверка прав доступа
    hasRole(role) {
        return this.isAuthenticated && this.currentUser?.role === role;
    }
    
    // Получить текущего пользователя
    getUser() {
        return this.currentUser;
    }
    
    // Проверить авторизацию на странице
    checkAuthOnPage() {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            const token = localStorage.getItem('authToken');
            
            if (!user || !token) {
                return false;
            }
            
            this.currentUser = user;
            this.isAuthenticated = true;
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Инициализация аутентификации
let auth;

document.addEventListener('DOMContentLoaded', () => {
    auth = new Auth();
    
    // Экспорт для использования в других файлах
    window.auth = auth;
});

// Глобальная функция для выхода
window.logout = () => {
    if (window.auth) {
        window.auth.logout();
    }
};