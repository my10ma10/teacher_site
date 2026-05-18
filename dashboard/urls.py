from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('teacher/', views.teacher_dashboard, name='teacher_dashboard'),
    path('teacher/create/', views.create_assignment, name='create_assignment'),
    path('teacher/submissions/', views.submission_list, name='teacher_submissions'),
    path('teacher/grade/<int:pk>/', views.grade_submission, name='grade_submission'),
    path('student/', views.student_dashboard, name='student_dashboard'),
    path('student/submit/<int:assignment_id>/', views.submit_solution, name='submit_solution'),
]