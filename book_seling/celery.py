import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'book_seling.settings')

app = Celery('accounts')
app.config_from_object('django.conf:settings')

app.autodiscover_tasks()