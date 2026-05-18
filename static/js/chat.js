// Чат поддержки
class SupportChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.botResponses = [
            "Здравствуйте! Чем могу помочь?",
            "Какой у вас вопрос?",
            "Я помогу вам связаться с учителем.",
            "Вы можете оставить сообщение через форму обратной связи.",
            "Часы консультаций: понедельник, среда с 15:00 до 16:00.",
            "Email учителя: teacher@school8.ru"
        ];
        this.init();
    }
    
    init() {
        // Загрузить сохраненные сообщения
        this.loadMessages();
        
        // Настроить отправку сообщений по Enter
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }
    
    toggle() {
        const chat = document.getElementById('supportChat');
        this.isOpen = !this.isOpen;
        
        if (chat) {
            if (this.isOpen) {
                chat.classList.add('open');
                document.getElementById('chatInput')?.focus();
            } else {
                chat.classList.remove('open');
            }
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input || !input.value.trim()) return;
        
        const message = input.value;
        this.addMessage(message, 'user');
        input.value = '';
        
        // Ответ бота с задержкой
        setTimeout(() => {
            const randomResponse = this.botResponses[Math.floor(Math.random() * this.botResponses.length)];
            this.addMessage(randomResponse, 'bot');
        }, 1000);
    }
    
    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<strong>${sender === 'user' ? 'Вы' : 'Бот'}:</strong> ${text}`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Сохранить сообщение
        this.messages.push({
            text,
            sender,
            timestamp: new Date().toISOString()
        });
        
        this.saveMessages();
    }
    
    saveMessages() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }
    
    loadMessages() {
        const saved = localStorage.getItem('chatMessages');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.renderMessages();
        } else {
            // Начальное сообщение бота
            this.addMessage(this.botResponses[0], 'bot');
        }
    }
    
    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        chatMessages.innerHTML = '';
        this.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            messageDiv.innerHTML = `<strong>${msg.sender === 'user' ? 'Вы' : 'Бот'}:</strong> ${msg.text}`;
            chatMessages.appendChild(messageDiv);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    clearChat() {
        this.messages = [];
        localStorage.removeItem('chatMessages');
        this.renderMessages();
    }
}

// Инициализация чата
const supportChat = new SupportChat();

// Функции для глобального доступа
window.toggleChat = () => supportChat.toggle();
window.sendMessage = () => supportChat.sendMessage();
window.clearChat = () => supportChat.clearChat();