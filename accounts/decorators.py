from functools import wraps
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.urls import reverse_lazy

def teacher_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(f'{reverse_lazy("accounts:login")}?next={request.path}')
        
        if hasattr(request.user, 'role') and request.user.role == 'teacher':
            return view_func(request, *args, **kwargs)
        
        raise PermissionDenied("Доступ только для учителей.")
    
    return wrapper

def student_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(f'{reverse_lazy("accounts:login")}?next={request.path}')
        
        if hasattr(request.user, 'role') and request.user.role == 'student':
            return view_func(request, *args, **kwargs)
            
        raise PermissionDenied("Доступ только для учеников.")
    
    return wrapper