from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('news/', views.NewsListView.as_view(), name='news_list'),
    path('news/<int:pk>/', views.NewsDetailView.as_view(), name='news_detail'),
    path('materials/', views.MaterialListView.as_view(), name='materials'),
    path('gallery/', views.GalleryView.as_view(), name='gallery'),
    path('contacts/', views.ContactView.as_view(), name='contacts'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('subject/', views.SubjectView.as_view(), name='subject'),
    path('schedule/', views.ScheduleView.as_view(), name='schedule'),
]