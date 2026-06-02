import os
from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Submission, Assignment

ALLOWED_EXTENSIONS = ['py', 'pdf', 'docx', 'zip', 'txt']
MAX_FILE_SIZE_MB = 25

class SubmissionForm(forms.ModelForm):
    class Meta:
        model = Submission
        fields = ['code_text', 'file_upload']
        widgets = {
            'code_text': forms.Textarea(attrs={'rows': 10, 'class': 'form-control', 'placeholder': 'Вставьте код здесь...'}),
            'file_upload': forms.FileInput(attrs={'class': 'form-control'}),
        }

    def clean_file_upload(self):
        file = self.cleaned_data.get('file_upload')
        if file:
            filesize = file.size / (1024 * 1024)
            if filesize > MAX_FILE_SIZE_MB:
                raise ValidationError(f"Размер файла не должен превышать {MAX_FILE_SIZE_MB} МБ.")
            
            ext = os.path.splitext(file.name)[1][1:].lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise ValidationError(f"Недопустимый формат файла. Разрешены: {', '.join(ALLOWED_EXTENSIONS)}")
        
        return file

    def clean(self):
        cleaned_data = super().clean()
        code_text = cleaned_data.get('code_text')
        file_upload = cleaned_data.get('file_upload')
        
        # Проверяем, что хотя бы одно поле заполнено
        if not code_text and not file_upload:
            raise ValidationError("Вы должны заполнить хотя бы одно поле: текст кода или прикрепить файл.")
        
        assignment_id = self.data.get('assignment_id')
        if assignment_id:
            try:
                assignment = Assignment.objects.get(pk=assignment_id)
                if assignment.deadline and assignment.deadline < timezone.now():
                    raise ValidationError("Срок сдачи этого задания истёк.")
            except Assignment.DoesNotExist:
                pass
        return cleaned_data