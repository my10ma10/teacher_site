from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, ClassGroup

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'class_group', 'is_staff')
    list_filter = ('role', 'class_group')
    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительно', {'fields': ('role', 'class_group', 'full_name')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Дополнительно', {'fields': ('role', 'class_group')}),
    )

@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'access_code')