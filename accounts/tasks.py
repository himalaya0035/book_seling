from typing import List

from django.conf import settings
from django.core.mail import send_mail
from book_seling.celery import app


@app.task
def send_email_to_user(recipient_email_list: List[str], subject: str, body: str,
                       sender: str = settings.EMAIL_HOST_USER):

    send_mail(
        subject,
        body,
        sender,
        recipient_email_list
    )
