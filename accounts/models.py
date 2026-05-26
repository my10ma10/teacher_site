from django.contrib.auth.models import AbstractUser
from django.db import models

class ClassGroup(models.Model):
    name = models.CharField(max_length=10, unique=True)
    access_code = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('teacher', 'Учитель'),
        ('student', 'Ученик'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    class_group = models.ForeignKey(ClassGroup, on_delete=models.SET_NULL, null=True, blank=True)
    full_name = models.CharField(max_length=150, blank=True)

    def is_teacher(self):
        return self.role == 'teacher'

    def is_student(self):
        return self.role == 'student'

    def __str__(self):
        return self.get_full_name() or self.username