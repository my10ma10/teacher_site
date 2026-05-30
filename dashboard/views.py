from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from materials.models import Assignment, Submission, Grade
from .forms import AssignmentForm, SubmissionForm, GradeForm
from accounts.decorators import teacher_required, student_required

@teacher_required
def teacher_dashboard(request):
    assignments = Assignment.objects.filter(teacher=request.user).order_by('-deadline')
    pending = Submission.objects.filter(
        assignment__teacher=request.user,
        status='sent'
    ).count()

    return render(request, 'dashboard/teacher/home.html', {
        'assignments': assignments[:5],
        'stats': {'pending': pending, 'total': assignments.count()}
    })

@teacher_required
def create_assignment(request):
    if request.method == 'POST':
        form = AssignmentForm(request.POST, request.FILES)
        if form.is_valid():
            assignment = form.save(commit=False)
            assignment.teacher = request.user
            assignment.save()
            messages.success(request, 'Задание опубликовано')
            return redirect('dashboard:teacher_dashboard')
    else:
        form = AssignmentForm()
        if request.user.class_group:
            form.fields['class_group'].initial = request.user.class_group
            
    return render(request, 'dashboard/teacher/create_assignment.html', {'form': form})

@teacher_required
def update_assignment(request, pk):
    assignment = get_object_or_404(Assignment, pk=pk, teacher=request.user)
    if request.method == 'POST':
        form = AssignmentForm(request.POST, request.FILES, instance=assignment)
        if form.is_valid():
            form.save()
            return redirect('dashboard:teacher_submissions', pk=assignment.pk)
    else:
        form = AssignmentForm(instance=assignment)

    return render(request, 'dashboard/teacher/create_assignment.html', {'form': form, 'action': 'edit'})

@teacher_required
def delete_assignment(request, pk):
    assignment = get_object_or_404(Assignment, pk=pk, teacher=request.user)
    if request.method == 'POST':
        assignment.delete()
        return redirect('dashboard:teacher_dashboard')
    
    return render(request, 'dashboard/teacher/delete_confirm.html', {'object': assignment})

@teacher_required
def submission_list(request):
    submissions = Submission.objects.filter(
        assignment__teacher=request.user,
        status='sent'
    ).select_related('student', 'assignment').order_by('submitted_at')
    
    return render(request, 'dashboard/teacher/submissions.html', {'submissions': submissions})

@teacher_required
def grade_submission(request, pk):
    submission = get_object_or_404(Submission, pk=pk)
    if request.method == 'POST':
        form = GradeForm(request.POST)
        if form.is_valid():
            grade = form.save(commit=False)
            grade.submission = submission
            grade.graded_by = request.user
            grade.save()
            submission.status = 'reviewed'
            submission.save()
            messages.success(request, 'Оценка выставлена')
            return redirect('dashboard:teacher_submissions')
    else:
        form = GradeForm()

    return render(request, 'dashboard/teacher/grade_submission.html', {'form': form, 'submission': submission})

@student_required
def student_dashboard(request):
    my_class = request.user.class_group
    assigned = Assignment.objects.filter(class_group=my_class, status='published')
    submitted_ids = Submission.objects.filter(student=request.user
                                    ).values_list('assignment_id', flat=True)
    pending = assigned.exclude(id__in=submitted_ids)
    
    graded = Submission.objects.filter(student=request.user
                        ).select_related('assignment', 'grade'
                        ).order_by('-submitted_at')
    
    return render(request, 'dashboard/student/home.html', {'pending': pending, 'graded': graded})

@student_required
def submit_solution(request, assignment_id):
    assignment = get_object_or_404(Assignment, id=assignment_id, status='published')
    if request.method == 'POST':
        form = SubmissionForm(request.POST, request.FILES)
        if form.is_valid():
            submission = form.save(commit=False)
            submission.assignment = assignment
            submission.student = request.user
            submission.save()
            messages.success(request, 'Решение отправлено на проверку')
            return redirect('dashboard:student_submissions')
    else:
        form = SubmissionForm()
        
    return render(request, 'dashboard/student/submit_solution.html', {'form': form, 'assignment': assignment})


@student_required
def submit_assignment_select(request):
    """Страница выбора задания для отправки работы"""
    my_class = request.user.class_group
    assignments = Assignment.objects.filter(class_group=my_class, status='published').order_by('-deadline')
    
    # Получаем ID заданий, которые уже сданы студентом
    submitted_ids = Submission.objects.filter(student=request.user).values_list('assignment_id', flat=True)
    
    # Фильтруем задания, которые еще не сданы
    available = assignments.exclude(id__in=submitted_ids)
    
    return render(request, 'dashboard/student/submit_assignment_select.html', {
        'available': available,
        'submitted_count': submitted_ids.count()
    })


@student_required
def student_submissions(request):
    """Страница отображения всех работ студента с результатами проверок"""
    submissions = Submission.objects.filter(
        student=request.user
    ).select_related('assignment', 'grade').order_by('-submitted_at')
    
    return render(request, 'dashboard/student/submissions.html', {
        'submissions': submissions
    })