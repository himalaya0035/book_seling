import time

import requests
import threading

ttl = 0


def get_url(url):
    global ttl
    now = time.time()
    for i in url:
        requests.get(i)
    tkn = time.time() - now
    ttl += tkn


threads = list()
for j in range(100):
    for i in range(8):
        x = threading.Thread(target=get_url, args=[
            ['http://127.0.0.1:8000/api/books/all']]
                             )
        threads.append(x)
        x.start()

for index, thread in enumerate(threads):
    thread.join()

print('taken -> ', ttl)

"""


        ['http://127.0.0.1:8000/api/books/popular', 'http://127.0.0.1:8000/api/books/new',
         'http://127.0.0.1:8000/api/books/best-sellers', 'http://127.0.0.1:8000/api/books/all']]


G -w 4
taken ->  3.5822932720184326

GU -w4
taken ->  4.602994203567505

GU
taken ->  14.299146175384521

U
taken ->  11.254822254180908

D
taken ->  14.34389328956604

U -w4
taken ->  7.066979646682739

"""

"""
800



"""