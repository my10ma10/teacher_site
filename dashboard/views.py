from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from materials.models import Assignment, Submission, Grade
from .forms import AssignmentForm, SubmissionForm, GradeForm
from accounts.decorators import teacher_required, student_required

@teacher_required
def teacher_dashboard(request):
    assignments = Assignment.objects.filter(class_group=request.user.class_group).order_by('-deadline')
    pending = Submission.objects.filter(
        assignment__class_group=request.user.class_group,
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
            assignment.class_group = request.user.class_group
            assignment.save()
            messages.success(request, 'Задание опубликовано')
            return redirect('dashboard:teacher_dashboard')
    else:
        form = AssignmentForm()
    return render(request, 'dashboard/teacher/create_assignment.html', {'form': form})

@teacher_required
def submission_list(request):
    submissions = Submission.objects.filter(
        assignment__class_group=request.user.class_group,
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
    submitted_ids = Submission.objects.filter(student=request.user).values_list('assignment_id', flat=True)
    pending = assigned.exclude(id__in=submitted_ids)
    graded = Submission.objects.filter(student=request.user).select_related('assignment', 'grade').order_by('-submitted_at')
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
            return redirect('dashboard:student_dashboard')
    else:
        form = SubmissionForm()
    return render(request, 'dashboard/student/submit_solution.html', {'form': form, 'assignment': assignment})