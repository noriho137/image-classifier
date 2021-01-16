from django.urls import path
from .views import ClassifierView


app_name = 'classifier'
urlpatterns = [
    path('', ClassifierView.as_view(), name='classifier'),
]
