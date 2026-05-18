from django.contrib.auth.decorators import user_passes_test

def role_required(required_role):
    def check_role(user):
        return user.is_authenticated and user.role == required_role
    return user_passes_test(check_role, login_url='accounts:login')

teacher_required = role_required('teacher')
student_required = role_required('student')
parent_required = role_required('parent')