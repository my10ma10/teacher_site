from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser, ClassGroup

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Логин'})
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Пароль'})
    )

class StudentRegistrationForm(UserCreationForm):
    class_group = forms.ModelChoiceField(
        queryset=ClassGroup.objects.all(),
        label='Класс',
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    invite_code = forms.CharField(
        label='Код доступа',
        max_length=20,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Код от учителя'})
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'class_group', 'invite_code')

    def clean(self):
        cleaned_data = super().clean()
        class_group = cleaned_data.get('class_group')
        code = cleaned_data.get('invite_code')
        if class_group and code and class_group.access_code != code:
            raise forms.ValidationError('Неверный код доступа к классу')
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'student'
        user.full_name = f"{self.cleaned_data['first_name']} {self.cleaned_data['last_name']}".strip()
        if commit:
            user.save()
        return user