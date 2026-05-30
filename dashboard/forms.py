from django import forms
from materials.models import Assignment, Submission, Grade
from accounts.models import ClassGroup

class AssignmentForm(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = ['title', 'description', 'deadline', 
                  'max_score', 'class_group', 'attachments']
        widgets = {
            'deadline': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'max_score': forms.NumberInput(attrs={'class': 'form-control'}),
            'class_group': forms.Select(attrs={'class': 'form-select'}),
        }

class SubmissionForm(forms.ModelForm):
    class Meta:
        model = Submission
        fields = ['code_text', 'file_upload']
        widgets = {
            'code_text': forms.Textarea(attrs={'class': 'form-control font-roboto', 'rows': 10, 'placeholder': 'Вставьте текст'}),
        }

class GradeForm(forms.ModelForm):
    class Meta:
        model = Grade
        fields = ['score', 'comment']
        widgets = {
            'score': forms.NumberInput(attrs={'class': 'form-control'}),
            'comment': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }