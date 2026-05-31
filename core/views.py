from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, TemplateView
from django.contrib import messages
from django.db.models import Q
from django.core.paginator import Paginator
from .models import News, Material, GalleryItem, Schedule
from .forms import ContactForm

class HomeView(TemplateView):
    template_name = 'core/index.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['latest_news'] = News.objects.filter(visible_to='all')[:3]
        context['featured_materials'] = Material.objects.filter(tags__icontains='важное')[:4]
        return context


class NewsListView(ListView):
    model = News
    template_name = 'core/news_list.html'
    context_object_name = 'news_list'
    paginate_by = 10
    
    def get_queryset(self):
        qs = News.objects.filter(visible_to='all')
        category = self.request.GET.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class NewsDetailView(DetailView):
    model = News
    template_name = 'core/news_detail.html'
    context_object_name = 'news'


class MaterialListView(ListView):
    model = Material
    template_name = 'core/materials.html'
    context_object_name = 'materials'
    paginate_by = 12
    
    def get_queryset(self):
        qs = Material.objects.all()
        q = self.request.GET.get('q')
        mtype = self.request.GET.get('type')
        tag = self.request.GET.get('tag')
        
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        if mtype:
            qs = qs.filter(material_type=mtype)
        if tag:
            qs = qs.filter(tags__icontains=tag)
        return qs


class GalleryView(ListView):
    model = GalleryItem
    template_name = 'core/gallery.html'
    context_object_name = 'gallery_items'
    paginate_by = 20

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print("DEBUG gallery_items count:", GalleryItem.objects.count())
        print("DEBUG context keys:", context.keys())
        print("DEBUG gallery_items in context:", context.get('gallery_items'))
        return context

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'teacher':
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied
        image = request.FILES.get('image')
        caption = request.POST.get('title', '')
        category = request.POST.get('category', 'Другое')
        if image:
            GalleryItem.objects.create(image=image, caption=caption, category=category)
            from django.contrib import messages
            messages.success(request, 'Фото успешно добавлено в галерею')
        return redirect('core:gallery')

class ContactView(TemplateView):
    template_name = 'core/contacts.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = ContactForm()
        return context
    
    def post(self, request, *args, **kwargs):
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Сообщение отправлено. Спасибо!')
            return redirect('core:contacts')
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(request, self.template_name, context)


class AboutView(TemplateView):
    template_name = 'core/about.html'


class SubjectView(TemplateView):
    template_name = 'core/subject.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['materials_by_topic'] = {
            'Основы': Material.objects.filter(tags__icontains='основы')[:5],
            'Алгоритмы': Material.objects.filter(tags__icontains='алгоритмы')[:5],
            'Проекты': Material.objects.filter(tags__icontains='проект')[:5],
        }
        return context
    
    
class ScheduleView(ListView):
    """Страница расписания с фильтром по классу"""
    model = Schedule
    template_name = 'core/schedule.html'
    context_object_name = 'schedule_items'
    
    def get_queryset(self):
        qs = Schedule.objects.all()
        class_id = self.request.GET.get('class')
        if class_id:
            qs = qs.filter(class_group_id=class_id)
        return qs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from accounts.models import ClassGroup
        context['classes'] = ClassGroup.objects.all()
        context['selected_class'] = self.request.GET.get('class', '')
        return context