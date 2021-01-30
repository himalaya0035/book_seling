from typing import List

from django.conf import settings
from django.core.mail import send_mail
from book_seling.celery import app


@app.task
def send_email_to_user(recipient_email_list: List[str], subject: str, body: str,
                       sender: str = settings.EMAIL_HOST_USER):
    print('function triggered send email to registered user')
    print(subject)
    print(body)
    print(recipient_email_list)
    print(sender)
    send_mail(
        subject,
        body,
        sender,
        recipient_email_list
    )
