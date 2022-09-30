import graphene
from django.contrib.auth import get_user_model
from django.db.models import Avg
from graphene_django import DjangoObjectType

from .models import Category, Comment, Ingredient, Profile, Rating, Recipe


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        filter_fields = ["id"]
        fields = ("id", "name")
        # interfaces = (graphene.relay.Node,)


class RecipeType(DjangoObjectType):
    time_estimate = graphene.String()
    average_rating = graphene.Float()
    liked = graphene.Boolean()
    user_rating = graphene.Int()

    class Meta:
        model = Recipe
        filter_fields = {
            "name": ["exact", "icontains", "istartswith"],
            "category__id": ["exact"],
        }
        use_connection = True

    def resolve_time_estimate(self, info):
        return self.time_estimate.total_seconds()

    def resolve_average_rating(self, info):
        return Rating.objects.filter(recipe_rated=self.id).aggregate(Avg("rating"))[
            "rating__avg"
        ]

    def resolve_liked(self, info):
        return (
            hasattr(info.context.user, "profile")
            and info.context.user.profile.liked_recipes.filter(id=self.id).exists()
        )

    def resolve_user_rating(self, info):
        try:
            profile = Profile.objects.get(
                user=get_user_model().objects.get(username=info.context.user.username)
            )
            rating = Rating.objects.get(rated_by=profile, recipe_rated=self)
            if rating:
                return rating.rating
            else:
                return 0
        except Exception:
            return 0


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile


class IngredientType(DjangoObjectType):
    unit = graphene.String()

    class Meta:
        model = Ingredient


class RatingType(DjangoObjectType):
    rating = graphene.Int()

    class Meta:
        model = Rating


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
