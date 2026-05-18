from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, TemplateView
from django.contrib import messages
from django.db.models import Q
from django.core.paginator import Paginator
from .models import News, Material, GalleryItem
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
    context_object_name = 'images'
    paginate_by = 20


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