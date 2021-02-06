import time

import requests
import threading

ttl = 0


# def post(url, data):


# def get_url(url):
#     global ttl
#     now = time.time()
#     for i in url:
#         requests.get(i)
#     tkn = time.time() - now
#     ttl += tkn
#
#
# threads = list()
# for j in range(100):
#     for i in range(8):
#         x = threading.Thread(target=get_url, args=[
#             ['http://127.0.0.1:8000/api/books/all']]
#                              )
#         threads.append(x)
#         x.start()
#
# for index, thread in enumerate(threads):
#     thread.join()

url = 'http://127.0.0.1:8000/api/cart/checkout'
data = {

    "shipping_details": {
        "name": "Priyansh Singh",
        "address": "113 North City Pilibhit Road Bareilly",
        "contact_number": "9412666633",
        "email": "singhpriyansh51001@gmail.com"
    }
}

x = threading.Thread()

print('taken -> ', ttl)
