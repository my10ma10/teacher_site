from django import forms
from materials.models import Assignment, Submission, Grade

class AssignmentForm(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = ['title', 'description', 'deadline', 'max_score', 'attachments']
        widgets = {
            'deadline': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'max_score': forms.NumberInput(attrs={'class': 'form-control'}),
        }

class SubmissionForm(forms.ModelForm):
    class Meta:
        model = Submission
        fields = ['code_text', 'file_upload']
        widgets = {
            'code_text': forms.Textarea(attrs={'class': 'form-control font-monospace', 'rows': 10, 'placeholder': 'Вставьте код...'}),
        }

class GradeForm(forms.ModelForm):
    class Meta:
        model = Grade
        fields = ['score', 'comment']
        widgets = {
            'score': forms.NumberInput(attrs={'class': 'form-control'}),
            'comment': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }