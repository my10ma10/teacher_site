# QWEN.md — Документация проекта «Сайт учителя информатики»

**Версия:** 1.0

**Дата обновления:** 2026

**Фреймворк:** Django 5.2

**Язык:** Python 3.x

---

## 📋 Оглавление

1. [Обзор проекта](#обзор-проекта)
2. [Архитектура системы](#архитектура-системы)
3. [Структура приложения](#структура-приложения)
4. [Модели данных](#модели-данных)
5. [Правила написания кода](#правила-написания-кода)
6. [Статус разработки по этапам](#статус-разработки-по-этапам)
7. [Рекомендации по дальнейшей разработке](#рекомендации-по-дальнейшей-разработке)
8. [Запуск и развёртывание](#запуск-и-развёртывание)

---

## Обзор проекта

Django-приложение для управления учебным процессом учителя информатики. Система поддерживает:

- **Публичные страницы**: новости, материалы, галерея, расписание, контакты
- **Ролевую модель**: учитель, ученик, гость
- **Личные кабинеты**: создание заданий, отправка работ, выставление оценок
- **Админ-панель**: полный CRUD всех моделей

---

## Архитектура системы

### Приложения Django

| Приложение | Назначение |
|------------|------------|
| `accounts` | Аутентификация, пользователи, классы |
| `core` | Публичные страницы, новости, материалы, расписание |
| `materials` | Задания, работы учеников, оценки |
| `dashboard` | Личные кабинеты учителя и ученика |

### Технологический стек

- **Backend**: Django 5.2
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Frontend**: Bootstrap 5, Font Awesome, ванильный JS
- **Templates**: Django Templates с наследованием
- **Static files**: CSS, JS, изображения

### Схема аутентификации

```
CustomUser (AbstractUser)
├── role: teacher/student
├── class_group: ForeignKey → ClassGroup
└── full_name: CharField

ClassGroup
├── name: уникальный идентификатор класса
└── access_code: код для регистрации учеников
```

---

## Структура приложения

Подробную инструкцию можно посмотреть через команду tree  

```
tree -I '.git|.github|.venv|__pycache__|*Zone.Identifier'  -a ./.
```

```
teacher_site/
├── accounts/              # Приложение аутентификации
│   ├── models.py          # CustomUser, ClassGroup
│   ├── forms.py           # Формы входа/регистрации
│   ├── views.py           # LoginView, RegisterView
│   ├── urls.py            # Маршруты /accounts/
│   ├── decorators.py      # teacher_required, student_required
│   └── admin.py           # Админка пользователей
│
├── core/                  # Публичное приложение
│   ├── models.py          # News, Material, GalleryItem, Feedback, Schedule
│   ├── forms.py           # ContactForm
│   ├── views.py           # HomeView, NewsListView, MaterialListView...
│   ├── urls.py            # Маршруты /
│   └── admin.py           # Админка контента
│
├── materials/             # Задания и материалы
│   ├── models.py          # Assignment, Submission, Grade
│   ├── forms.py           # AssignmentForm, SubmissionForm, GradeForm
│   └── admin.py           # Админка с inline-оценками
│
├── dashboard/             # Личные кабинеты
│   ├── views.py           # teacher_dashboard, student_dashboard...
│   ├── forms.py           # Формы для дашборда
│   ├── urls.py            # Маршруты /dashboard/teacher/, /dashboard/student/
│   └── templates/dashboard/
│       ├── teacher/       # Шаблоны учителя
│       └── student/       # Шаблоны ученика
│
├── teacher_site/          # Настройки проекта
│   ├── settings.py        # Конфигурация Django
│   └── urls.py            # Главные маршруты
│
├── templates/             # Глобальные шаблоны
│   ├── base.html          # Базовый шаблон
│   ├── partials/          # header, footer, sidebars
│   ├── accounts/          # login.html, register.html
│   └── core/              # index.html, news_list.html...
│
├── static/                # Статические файлы
│   ├── css/               # style.css, animations.css
│   └── js/                # main.js, chat.js, animations.js
│
└── manage.py              # Точка входа Django
```

---

## Модели данных

### accounts.models

#### CustomUser
```python
- username ( inherited )
- email ( inherited )
- role: CharField(teacher/student)
- class_group: FK → ClassGroup
- full_name: CharField
```

#### ClassGroup
```python
- name: CharField(unique)
- access_code: CharField(unique)
- created_at: DateTimeField
```

### core.models

#### News
```python
- title: CharField
- content: TextField
- category: announcement/event/resource
- visible_to: all/students/class
- target_class: FK → ClassGroup (nullable)
- published_at: DateTimeField
```

#### Material
```python
- title: CharField
- description: TextField
- material_type: presentation/notes/video/link/task
- file: FileField
- external_url: URLField
- tags: CharField
- class_group: FK → ClassGroup (nullable)
- published_at: DateTimeField
```

#### Schedule
```python
- day_of_week: IntegerField(1-6)
- lesson_number: IntegerField
- subject: CharField
- class_group: FK → ClassGroup
- teacher: FK → CustomUser (nullable)
- room: CharField
```

#### GalleryItem
```python
- image: ImageField
- caption: CharField
- uploaded_at: DateTimeField
```

#### Feedback
```python
- name: CharField
- email: EmailField
- message: TextField
- created_at: DateTimeField
- is_processed: BooleanField
```

### materials.models

#### Assignment
```python
- title: CharField
- description: TextField
- deadline: DateTimeField
- max_score: PositiveSmallIntegerField
- class_group: FK → ClassGroup
- attachments: FileField
- status: CharField(published/draft/archived)
```

#### Submission
```python
- assignment: FK → Assignment
- student: FK → CustomUser
- submitted_at: DateTimeField
- code_text: TextField
- file_upload: FileField
- status: CharField(sent/reviewed/revision)
```

#### Grade
```python
- submission: OneToOneField → Submission
- score: PositiveSmallIntegerField
- comment: TextField
- graded_at: DateTimeField
- graded_by: FK → CustomUser
```

---

## Правила написания кода


> **Не пиши комментарии в коде!**
> Если хочешь добавить пояснение — пиши отдельным текстом в чате, ссылаясь на файл и место изменения.
> Пример: *«В файле `dashboard/views.py`, функция `teacher_dashboard`, строка 9 — добавлена фильтрация по классу пользователя»*

### Общие правила

1. **Язык кода**: английский (имена переменных, функций, классов)
2. **Язык контента**: русский (тексты в шаблонах, сообщения форм, админка)
3. **Стиль имён**:
   - Классы: `PascalCase` (`CustomUser`, `AssignmentForm`)
   - Функции/переменные: `snake_case` (`teacher_dashboard`, `class_group`)
   - Константы: `UPPER_CASE` (`ALLOWED_EXTENSIONS`, `MAX_FILE_SIZE_MB`)

4. **Импорты**:
   ```python
   # Сначала стандартная библиотека
   import os
   from pathlib import Path

   # Затем сторонние пакеты
   from django.db import models
   from django.shortcuts import render

   # Затем локальные приложения
   from accounts.models import CustomUser
   from .models import Assignment
   ```

5. **Модели**:
   - Всегда указывать `verbose_name` и `verbose_name_plural` в `Meta`
   - Использовать `__str__` для человекочитаемого представления
   - Добавлять `ordering` в `Meta` для предсказуемой сортировки
   - Использовать `related_name` для обратных связей

6. **Представления (Views)**:
   - Использовать декораторы `@teacher_required`, `@student_required` для защиты
   - CBV для CRUD операций, FBV для сложной логики
   - Всегда использовать `select_related` / `prefetch_related` для оптимизации

7. **Формы**:
   - Наследоваться от `ModelForm` когда возможно
   - Валидация на уровне формы (`clean_<field>()`, `clean()`)
   - Виджеты с классами Bootstrap (`form-control`, `form-select`)

8. **Шаблоны**:
   - Наследование от `base.html`
   - Использование `{% include %}` для повторяющихся частей
   - Блоки: `{% block title %}`, `{% block content %}`, `{% block extra_js %}`
   - CSRF-токен во всех формах: `{% csrf_token %}`

9. **URLs**:
   - Всегда указывать `app_name` для неймспейса
   - Именовать URL: `name='teacher_dashboard'`
   - Использовать `{% url 'app:name' %}` в шаблонах

10. **Безопасность**:
    - Проверка прав доступа в каждом view
    - Валидация файлов по расширению и размеру
    - Защита от CSRF на всех формах
    - Не передавать чувствительные данные в GET-параметрах


## Статус разработки по этапам

### ✅ Этап 0: Подготовка проекта
- [x] Виртуальное окружение и Django установлены
- [x] Проект и приложения созданы
- [x] Настройки `BASE_DIR`, `INSTALLED_APPS`, `AUTH_USER_MODEL`
- [x] Папки `templates/`, `static/`, `media/`

### ✅ Этап 1: Инфраструктура и аутентификация
- [x] Модели `CustomUser`, `ClassGroup`
- [x] Миграции выполнены
- [x] Формы входа/регистрации
- [x] Декораторы ролей
- [x] Базовые шаблоны с сайдбарами

### ✅ Этап 2: Публичные страницы (core)
- [x] Модели `News`, `Material`, `GalleryItem`, `Feedback`, `Schedule`
- [x] Все представления реализованы
- [x] Шаблоны страниц созданы
- [x] Админка настроена
- [ ] Требуется тестирование пагинации и фильтрации

### ⚠️ Этап 3: Модели заданий (materials)
- [x] Модели `Assignment`, `Submission`, `Grade`
- [x] Админка с inline-оценками
- [ ] validators.py не создан (валидация в forms.py)
- [ ] Требуется проверка валидации в `SubmissionForm`

### ⚠️ Этап 4: Личные кабинеты (dashboard)
- [x] Представления учителя и ученика
- [x] Шаблоны кабинетов
- [x] Маршруты настроены
- [ ] Отсутствует защита файлов учеников от прямого доступа
- [ ] Нет проверки дедлайна при отправке работы

### 🔲 Этап 5: Расширенный функционал
- [x] Модель `Schedule` реализована
- [ ] Уведомления (`Notification`) не реализованы
- [ ] Родители не реализованы
- [ ] Журнал оценок с экспортом CSV не реализован

### 🔲 Этап 6: Безопасность и оптимизация
- [ ] django-axes не установлен
- [ ] Нет проверки прав на скачивание файлов
- [ ] Не везде используется `select_related`/`prefetch_related`
- [ ] Кэширование не настроено

### 🔲 Этап 7: Тестирование
- [ ] pytest-django не установлен
- [ ] Тесты не написаны

### 🔲 Этап 8: Деплой и документация
- [ ] requirements.txt неполный (нет gunicorn, psycopg2-binary, django-axes)
- [ ] settings_production.py не создан
- [ ] Dockerfile/docker-compose.yml отсутствуют
- [ ] README.md пустой
- [ ] ИНСТРУКЦИЯ_ДЛЯ_УЧИТЕЛЯ.md отсутствует
- [ ] .env.example отсутствует

---

## Рекомендации по дальнейшей разработке

### Приоритет 1: Критические исправления

1. **Валидация дедлайна в SubmissionForm**
   - Файл: `materials/forms.py`, метод `clean()`
   - Проблема: используется `timezone.now()` без импорта
   - Решение: добавить `from django.utils import timezone`

2. **Защита файлов учеников**
   - Создать view для скачивания файлов с проверкой прав
   - Запретить прямой доступ к `/media/submissions/`
   - Использовать `FileResponse` с проверкой принадлежности

3. **Проверка дедлайна перед отправкой**
   - В `submit_solution` добавлять проверку `assignment.deadline < timezone.now()`
   - Возвращать ошибку с сообщением «Срок сдачи истёк»

### Приоритет 2: Уведомления

4. **Модель Notification**
   ```python
   class Notification(models.Model):
       user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
       message = models.TextField()
       is_read = models.BooleanField(default=False)
       created_at = models.DateTimeField(auto_now_add=True)
       related_object = models.GenericForeignKey()
   ```

5. **Отправка уведомлений**
   - При создании `Assignment` → уведомление всем ученикам класса
   - При создании `Grade` → уведомление ученику
   - Индикатор в `header.html` (иконка колокольчика с badge)

### Приоритет 3: Оптимизация

6. **QuerySet оптимизация**
   - `teacher_dashboard`: добавить `select_related('class_group')`
   - `submission_list`: уже есть `select_related`, проверить эффективность
   - `student_dashboard`: добавить `prefetch_related('grade')`

7. **Кэширование публичных страниц**
   - Использовать `@method_decorator(cache_page(60*15))` для `HomeView`, `NewsListView`
   - Настроить cache backend в settings.py

### Приоритет 4: Тестирование

8. **Базовые тесты**
   ```python
   # accounts/tests.py
   test_student_registration_with_valid_code()
   test_student_registration_with_invalid_code()

   # materials/tests.py
   test_assignment_creation_by_teacher()
   test_submission_before_deadline()
   test_submission_after_deadline_rejected()

   # dashboard/tests.py
   test_student_cannot_access_teacher_view()
   test_teacher_cannot_see_other_class_submissions()
   ```

### Приоритет 5: Деплой

9. **Подготовка к продакшену**
   - Создать `.env` с `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`
   - Установить `gunicorn`, `psycopg2-binary`, `django-axes`
   - Настроить `settings_production.py` или использовать `python-decouple`
   - Выполнить `collectstatic`

10. **Docker (опционально)**
    ```dockerfile
    FROM python:3.12-slim
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    CMD ["gunicorn", "teacher_site.wsgi:application", "--bind", "0.0.0.0:8000"]
    ```

### Приоритет 6: Документация

11. **README.md**
    - Инструкция по установке
    - Структура проекта
    - Переменные окружения
    - Команды для запуска

12. **ИНСТРУКЦИЯ_ДЛЯ_УЧИТЕЛЯ.md**
    - Создание класса и кода доступа
    - Регистрация учеников
    - Создание задания
    - Проверка работ
    - Публикация новостей

---

## Запуск и развёртывание

### Локальная разработка

```bash
# Активация виртуального окружения
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Установка зависимостей
pip install -r requirements.txt

# Миграции
python manage.py makemigrations
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver
```

### Доступные маршруты

| URL | Описание |
|-----|----------|
| `/` | Главная страница |
| `/news/` | Список новостей |
| `/materials/` | Учебные материалы |
| `/gallery/` | Галерея |
| `/contacts/` | Контакты + форма обратной связи |
| `/about/` | О сайте |
| `/subject/` | Предметные разделы |
| `/schedule/` | Расписание уроков |
| `/accounts/login/` | Вход |
| `/accounts/register/` | Регистрация ученика |
| `/dashboard/teacher/` | Кабинет учителя |
| `/dashboard/student/` | Кабинет ученика |
| `/admin/` | Админ-панель Django |

### Переменные окружения (для production)

Создать файл `.env`:
```env
SECRET_KEY=ваш-секретный-ключ
DEBUG=False
ALLOWED_HOSTS=ваш-домен.com,www.ваш-домен.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

---

## Контакты и поддержка

При возникновении вопросов обращаться к документации Django:
- https://docs.djangoproject.com/
- https://docs.djangoproject.com/en/stable/topics/auth/
- https://docs.djangoproject.com/en/stable/topics/forms/

---

*Документ создан автоматически на основе анализа проекта. Последнее обновление: 2026*