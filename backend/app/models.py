from django.contrib.auth.models import User
from django.db import models

# This list is used in the ingredient class, and is on the form (stored_value, human_readable_format)
UNIT_CHOICES = [
    ("pk", "pk"),
    ("stk", "stk"),
    ("mL", "mL"),
    ("dL", "dL"),
    ("L", "L"),
    ("g", "g"),
    ("kg", "kg"),
    ("ts", "ts"),
    ("ss", "ss"),
]
POSIBLE_RATINGS = [
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
]

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self) -> str:
        return f"{self.name}"


def profile_picture_path(instance, filename):
    """Instance is an instance of the Profile class
    filename is the original filename"""
    return "pictures/profile/id_{0}/{1}".format(instance.id, filename)


class Profile(models.Model):
    picture = models.ImageField(upload_to=profile_picture_path, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    biography = models.TextField(blank=True, null=True)

    liked_recipes = models.ManyToManyField("Recipe", related_name="liked_by")

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="profile",
    )

    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name}"


class Rating(models.Model):
    rating = models.PositiveSmallIntegerField(choices=POSIBLE_RATINGS)
    rated_by = models.ForeignKey(Profile, on_delete=models.CASCADE)
    recipe_rated = models.ForeignKey("Recipe", on_delete=models.CASCADE)

    class Meta:
        unique_together = (
            "rated_by",
            "recipe_rated",
        )


class Comment(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    recipe = models.ForeignKey(
        "Recipe", on_delete=models.CASCADE, related_name="comments"
    )
    content = models.TextField()


def recipe_picture_path(instance, filename):
    """instance is an instance of the Recipe class
    filename is the original filename"""
    return "pictures/recipe/id_{0}/{1}".format(instance.id, filename)


class Recipe(models.Model):
    name = models.CharField(max_length=100)
    picture = models.ImageField(upload_to=recipe_picture_path, blank=True, null=True)
    instructions = models.TextField()
    # average rating can be computed from the rating relation
    time_estimate = models.DurationField()
    # gives back recipe size
    portion_size = models.PositiveIntegerField(default=4)
    
    # Categories should not be deleted, but if they are we should not delete all recipes I think
    category = models.ForeignKey(
        Category, on_delete=models.DO_NOTHING, related_name="recipes"
    )

    profile = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="recipes"
    )

    def __str__(self) -> str:
        return f"{self.name}"


class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    amount = models.FloatField(default=0)
    unit = models.CharField(max_length=3, choices=UNIT_CHOICES, default="stk")
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="ingredients"
    )

    def __str__(self) -> str:
        return f"{self.name}"


# TODO: Add tags?
