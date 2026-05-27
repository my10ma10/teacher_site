from django.urls import path
from . import views

app_name = 'dashboard'


urlpatterns = [
    path('teacher/', views.teacher_dashboard, name='teacher_dashboard'),
    path('teacher/create/', views.create_assignment, name='create_assignment'),
    path('teacher/assignment/<int:pk>/edit/', views.update_assignment, name='teacher_assignment_edit'),
    path('teacher/assignment/<int:pk>/delete/', views.delete_assignment, name='teacher_assignment_delete'),
    path('teacher/submission/<int:pk>/grade/', views.grade_submission, name='teacher_grade_submission'),
    path('teacher/submissions/', views.submission_list, name='teacher_submissions'),
    path('teacher/grade/<int:pk>/', views.grade_submission, name='grade_submission'),
    path('student/', views.student_dashboard, name='student_dashboard'),
    path('student/submit/<int:assignment_id>/', views.submit_solution, name='submit_solution'),
    path('student/submissions/', views.student_submissions, name='student_submissions'),
    path('student/submit-select/', views.submit_assignment_select, name='submit_assignment_select'),
]