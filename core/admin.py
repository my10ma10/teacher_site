from django.contrib import admin
from .models import News, Material, GalleryItem, Feedback, Schedule

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['day_of_week', 'lesson_number', 'subject', 'class_group', 'teacher', 'room']
    list_filter = ['day_of_week', 'class_group', 'subject']
    search_fields = ['subject', 'teacher__username', 'class_group__name', 'room']
    ordering = ['day_of_week', 'lesson_number']

    fieldsets = (
        ('Основная информация', {
            'fields': ('day_of_week', 'lesson_number', 'subject', 'class_group')
        }),
        ('Дополнительно', {
            'fields': ('teacher', 'room'),
            'classes': ('collapse',)
        }),
    )

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_at', 'visible_to']
    list_filter = ['category', 'visible_to', 'published_at']
    search_fields = ['title', 'content']
    date_hierarchy = 'published_at'


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['title', 'material_type', 'class_group', 'published_at']
    list_filter = ['material_type', 'class_group']
    search_fields = ['title', 'description', 'tags']
    readonly_fields = ['published_at']


@admin.register(GalleryItem)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ['caption', 'uploaded_at']
    search_fields = ['caption']


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at', 'is_processed']
    list_filter = ['is_processed', 'created_at']
    actions = ['mark_processed']
    
    def mark_processed(self, request, queryset):
        queryset.update(is_processed=True)
    mark_processed.short_description = 'Отметить как обработанные'