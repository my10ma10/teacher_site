from django.shortcuts import redirect
from django.contrib.auth import logout
from django.contrib.auth.views import LoginView
from django.views.generic import CreateView
from django.urls import reverse_lazy
from .forms import CustomAuthenticationForm, StudentRegistrationForm

class StudentRegisterView(CreateView):
    form_class = StudentRegistrationForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('accounts:login')

    def form_valid(self, form):
        user = form.save()
        from django.contrib import messages
        messages.success(self.request, 'Регистрация успешна. Войдите в систему.')
        return super().form_valid(form)

class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True

def logout_view(request):
    logout(request)
    return redirect('core:home')