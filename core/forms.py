from django import forms
from .models import Feedback

class ContactForm(forms.ModelForm):
    class Meta:
        model = Feedback
        fields = ['name', 'email', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ваше имя'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'email@example.com'}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'placeholder': 'Сообщение'}),
        }
    
    def clean_message(self):
        text = self.cleaned_data.get('message')
        if len(text) < 10:
            raise forms.ValidationError('Сообщение слишком короткое')
        return text