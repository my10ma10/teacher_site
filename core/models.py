from django.db import models
from django.urls import reverse
from accounts.models import ClassGroup  # кастомная модель класса

class News(models.Model):
    CATEGORY_CHOICES = [
        ('announcement', 'Объявление'),
        ('event', 'Событие'),
        ('resource', 'Ресурс'),
    ]
    VISIBILITY_CHOICES = [
        ('all', 'Все'),
        ('students', 'Только ученики'),
        ('class', 'Конкретный класс'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    published_at = models.DateTimeField(auto_now_add=True)
    visible_to = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='all')
    target_class = models.ForeignKey(ClassGroup, null=True, blank=True, on_delete=models.SET_NULL)
    
    class Meta:
        ordering = ['-published_at']
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('news_detail', kwargs={'pk': self.pk})


class Material(models.Model):
    TYPE_CHOICES = [
        ('presentation', 'Презентация'),
        ('notes', 'Конспект'),
        ('video', 'Видео'),
        ('link', 'Ссылка'),
        ('task', 'Практика'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    material_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    file = models.FileField(upload_to='materials/', blank=True, null=True)
    external_url = models.URLField(blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text='Теги через запятую')
    class_group = models.ForeignKey(ClassGroup, null=True, blank=True, on_delete=models.SET_NULL)
    published_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-published_at']
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'
    
    def __str__(self):
        return self.title
    
    @property
    def get_tags_list(self):
        return [t.strip() for t in self.tags.split(',') if t.strip()]


class GalleryItem(models.Model):
    image = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = 'Фото'
        verbose_name_plural = 'Галерея'
    
    def __str__(self):
        return self.caption or f'Фото #{self.id}'


class Feedback(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Обратная связь'
        verbose_name_plural = 'Обратная связь'
    
    def __str__(self):
        return f'{self.name} — {self.created_at:%d.%m.%Y}'