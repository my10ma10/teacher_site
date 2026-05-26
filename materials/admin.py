from django.contrib import admin
from .models import Assignment, Submission, Grade

class GradeInline(admin.TabularInline):
    model = Grade
    extra = 0
    fields = ('score', 'comment', 'graded_at', 'graded_by')
    readonly_fields = ('graded_at', 'graded_by')

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        
        class FormWithUser(formset.form):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs)
                if not self.instance.pk:
                    self.instance.graded_by = request.user
        formset.form = FormWithUser
        return formset


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'class_group', 'deadline', 'max_score', 'status')
    list_filter = ('status', 'class_group', 'deadline')
    search_fields = ('title', 'description')
    date_hierarchy = 'deadline'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'class_group')
        }),
        ('Параметры', {
            'fields': ('deadline', 'max_score', 'status')
        }),
        ('Вложения', {
            'fields': ('attachments',),
            'classes': ('collapse',)
        }),
    )



@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'student', 'submitted_at', 'is_graded')
    list_filter = ('assignment__class_group', 'submitted_at', 'grade__score')
    search_fields = ('student__username', 'assignment__title')
    date_hierarchy = 'submitted_at'
    
    inlines = [GradeInline]
    exclude = ('grade',)  # grade теперь управляется через inline
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('assignment', 'student').prefetch_related('grade')
    
    def is_graded(self, obj):
        return obj.grade.exists()
    is_graded.boolean = True
    is_graded.short_description = 'Оценено'

    # Добавляем массовые действия
    actions = ['mark_as_checked', 'mark_as_needs_revision']

    def mark_as_checked(self, request, queryset):
        """Массовое действие: отметить работы как проверенные (оценка 5)"""
        for submission in queryset:
            grade, created = Grade.objects.get_or_create(
                submission=submission,
                defaults={
                    'score': 5,
                    'graded_by': request.user,
                    'comment': 'Работа принята'
                }
            )
            if not created:
                grade.score = 5
                grade.comment = 'Работа принята'
                grade.save()
        self.message_user(request, f'{queryset.count()} работ(ы) отмечено как проверенные.')
    
    mark_as_checked.short_description = "Отметить как проверенные (оценка 5)"

    def mark_as_needs_revision(self, request, queryset):
        """Массовое действие: отметить работы как требующие доработки (оценка 2)"""
        for submission in queryset:
            grade, created = Grade.objects.get_or_create(
                submission=submission,
                defaults={
                    'score': 2,
                    'graded_by': request.user,
                    'comment': 'Требуется доработка'
                }
            )
            if not created:
                grade.score = 2
                grade.comment = 'Требуется доработка'
                grade.save()
        self.message_user(request, f'{queryset.count()} работ(ы) отмечено как требующие доработки.')
    
    mark_as_needs_revision.short_description = "Отметить как требующие доработки (оценка 2)"


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('submission', 'student_name', 'assignment_title', 'score', 'graded_by', 'graded_at')
    list_filter = ('score', 'graded_by', 'graded_at', 'submission__assignment__class_group')
    search_fields = ('submission__student__username', 'submission__assignment__title', 'comment')
    date_hierarchy = 'graded_at'
    
    readonly_fields = ('graded_at', 'graded_by', 'submission')

    def student_name(self, obj):
        return obj.submission.student.get_full_name() or obj.submission.student.username
    student_name.short_description = 'Ученик'
    student_name.admin_order_field = 'submission__student__last_name'

    def assignment_title(self, obj):
        return obj.submission.assignment.title
    assignment_title.short_description = 'Задание'
    assignment_title.admin_order_field = 'submission__assignment__title'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('submission__student', 'submission__assignment', 'graded_by')