from django.test import TestCase

from app.models import Recipe, Category, Profile, Comment, Ingredient, Rating
from app.schema import  DeleteComment, AppMutations, CreateRecipe
from app.mutations import CreateComment

# To run test: docker compose exec backend python manage.py test

class RecipeTestCase(TestCase):
    def setUp(self):
        self.up1 = Profile.objects.create(picture='null', birthday='2001-9-20', biography='Boyan er litt deppa')
        middag = Category.objects.create(name='middag')
        Recipe.objects.create(name='Sushi', picture='null', instructions='rull sushien', time_estimate='45', portion_size='4', category=middag, profile=self.up1)

    def test_recipe(self):
        sushi = Recipe.objects.get(name='Sushi')
        self.assertEqual(sushi.instructions, 'rull sushien')
        self.assertEqual(sushi.portion_size, 4)
    
    def test_category(self):
        middag = Category.objects.get(name='middag')
        self.assertEqual(middag.name, 'middag')

    def test_comment(self):
        sushi = Recipe.objects.get(name='Sushi')
        comment = Comment.objects.create(author=self.up1, recipe=sushi, content='Veldig bra')
        self.assertEqual(comment.content, 'Veldig bra')


    def test_ingredient(self):
        sushi = Recipe.objects.get(name='Sushi')
        Ingredient.objects.create(name='fisk', amount=2, unit='stk', recipe=sushi)
        ingrediens = Ingredient.objects.get(recipe=sushi)
        self.assertEqual(ingrediens.name, 'fisk')

    def test_rating(self):
        sushi = Recipe.objects.get(name='Sushi')
        Rating.objects.create(rating=3, rated_by=self.up1, recipe_rated=sushi)
        rating = Rating.objects.get(recipe_rated=sushi)
        self.assertEqual(rating.rating, 3)
    
  