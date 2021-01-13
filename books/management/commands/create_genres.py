from django.core.management.base import BaseCommand

from books.models import Genre


class Command(BaseCommand):
    help = "create default genre models"

    genre_names = [
        "Action",
        "Adventure",
        "Young Adult",
        "Detective",
        "Mythology",
        "Science Fiction",
        "Fantasy",
        "Mystery",
        "Self Help",
        "History",
        "Historical Fiction",
        "Physics",
        "Mathematics",
        "Science",
        "Geography",
        "Paranormal",
        "Crime Thriller",
        "Humor",
        "Romance",
        "Psychology",
        "Sports",
        "Cooking",
        "Business",
        "Religion",
        "Music",
        "Manga",
        "Others"
    ]

    def handle(self, *args, **options):
        for genre_name in self.genre_names:
            Genre.objects.get_or_create(name=genre_name)

    print('default genre created')
