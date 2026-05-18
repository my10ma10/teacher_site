from django.db import models
from accounts.models import CustomUser, ClassGroup

class Assignment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    deadline = models.DateTimeField()
    max_score = models.PositiveSmallIntegerField(default=5)
    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE)
    attachments = models.FileField(upload_to='assignments/', blank=True)
    status = models.CharField(max_length=10, default='published')

    def __str__(self):
        return self.title

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)
    code_text = models.TextField(blank=True)
    file_upload = models.FileField(upload_to='submissions/', blank=True)
    status = models.CharField(max_length=10, default='sent')

class Grade(models.Model):
    submission = models.OneToOneField(Submission, on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    graded_at = models.DateTimeField(auto_now=True)
    graded_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)