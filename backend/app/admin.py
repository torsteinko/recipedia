from django.contrib import admin

from .models import Category, Ingredient, Rating, Recipe, Profile, Comment

# # Register your models here.
admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Profile)
admin.site.register(Category)
admin.site.register(Rating)
admin.site.register(Comment)
