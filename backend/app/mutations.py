from cgitb import text

import graphene
from django.contrib.auth import get_user_model
from graphene_file_upload.scalars import Upload
from graphql_jwt.shortcuts import get_token

from .models import Category, Comment, Ingredient, Profile, Recipe, Rating
from .types import CommentType, IngredientType, ProfileType, RecipeType, UserType, RatingType

"""
DISCLAIMER:
This file needs to be tested. There is no testing if the inserted recipe ids are valid.
Mutation inputs should be tested and warnings thrown.
Should also test if user is logged in before executing mutations.
"""


class DeleteRating(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        recipe_id = graphene.ID(required=True)

    def mutate(self, info, recipe_id):
        if not Recipe.objects.filter(id=recipe_id).exists():
            raise ValueError("Invalid recipe_id")
        recipe = Recipe.objects.get(id=recipe_id)
        user = get_user_model().objects.get(username=info.context.user.username)
        profile = Profile.objects.get(user=user)
        Rating.objects.get(recipe_rated=recipe, rated_by=profile).delete()

        return DeleteRating(ok=True)


class SetRating(graphene.Mutation):

    rating = graphene.Field(RatingType)

    class Arguments:
        recipe_id = graphene.ID(required=True)
        rating_points = graphene.Int(required=True)

    def mutate(self, info, recipe_id, rating_points):
        # Check that the given username and recipe_id correspond to elements in the database
        if not Recipe.objects.filter(id=recipe_id).exists():
            raise ValueError("Invalid recipe_id")
        user = get_user_model().objects.get(username=info.context.user.username)
        profile = Profile.objects.get(user=user)
        recipe = Recipe.objects.get(id=recipe_id)

        if Rating.objects.filter(rated_by=profile, recipe_rated=recipe).exists():
            # If the rating allready exists: change rating points to the new rating
            rating = Rating.objects.get(rated_by=profile, recipe_rated=recipe)
            rating.rating = rating_points
            rating.save()
        else:
            # If no rating exists, then create a new rating with the given points
            rating = Rating(rating=rating_points, rated_by=profile, recipe_rated=recipe)
            rating.save()
        return SetRating(rating=rating)


class CreateUser(graphene.Mutation):
    """
    mutation {
      getOrCreateUser(email: "test@domain.com", password: "YourPass") {
        token
        user {
          id
          email
          isActive
        }
      }
    }
    """

    user = graphene.Field(UserType)
    token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)
        gender = graphene.String(required=False)

    def mutate(
        self, info, username, password, email, first_name, last_name, gender="M"
    ):
        token = ""

        # Return token
        if get_user_model().objects.filter(username=username).exists():
            user = get_user_model().objects.get(username=username)
            token = get_token(user)

        # Create new user
        else:
            user = get_user_model()(
                username=username,
                email=email,
            )
            user.first_name = first_name
            user.last_name = last_name
            user.gender = gender
            user.set_password(password)
            user.save()

        return CreateUser(user=user, token=token)


class BaseUpdateUserInputs(graphene.InputObjectType):
    """
    Helper class that holds all the info provided to the user class
    except username and password which are treated separetly
    """

    email = graphene.String(required=False)
    first_name = graphene.String(required=False)
    last_name = graphene.String(required=False)


class UpdateProfile(graphene.Mutation):
    """
    Finds the user and profile models corresponding to the given username and changes the models according to the info given
    The username cannot be changed
    Not all information needs to be given, if f. ex. the birthday is not provided, then it is not changed
    """

    user = graphene.Field(UserType)
    profile = graphene.Field(ProfileType)
    token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=False)
        birthday = graphene.DateTime(required=False)
        biography = graphene.String(required=False)
        user_data = BaseUpdateUserInputs(required=False)

    def mutate(
        self,
        info,
        username,
        password=None,
        birthday=None,
        biography=None,
        user_data=None,
    ):
        if not get_user_model().objects.filter(username=username).exists():
            # Send error message
            return
        user = get_user_model().objects.get(username=username)
        profile = Profile.objects.get(user=user)
        token = get_token(user)

        if password != None:
            user.set_password(password)

        if birthday != None:
            profile.birthday = birthday

        if biography != None:
            profile.biography = biography

        if user_data != None:
            for key, value in user_data.items():
                if value != None:
                    setattr(user, key, value)

        user.save()
        profile.save()

        return UpdateProfile(user=user, token=token)


class BaseRecipeInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    category = graphene.ID(required=True)
    time_estimate = graphene.String(required=True)
    instructions = graphene.String(required=True)
    portion_size = graphene.Int(required=True)


class BaseIngredientInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    amount = graphene.Int(required=True)
    unit = graphene.String(required=True)


class CreateRecipe(graphene.Mutation):
    recipe = graphene.Field(RecipeType)
    ok = graphene.Boolean()

    class Arguments:
        profile = graphene.ID(required=True)
        recipe_data = BaseRecipeInput(required=True)

    def mutate(self, info, profile, recipe_data):
        # Create new recipe
        recipe = Recipe()
        recipe.profile = Profile.objects.get(id=profile)
        for k, v in recipe_data.items():
            if not k == "category":
                setattr(recipe, k, v)
            else:
                setattr(recipe, k, Category.objects.get(id=v))

        recipe.save()
        ok = True

        return CreateRecipe(recipe=recipe, ok=ok)


class CreateIngredient(graphene.Mutation):
    ingredient = graphene.Field(IngredientType)
    ok = graphene.Boolean()

    class Arguments:
        ingredient_data = BaseIngredientInput(required=True)
        recipe = graphene.ID(required=True)

    def mutate(self, info, recipe, ingredient_data):
        # Create new ingredient
        ingredient = Ingredient()
        for k, v in ingredient_data.items():
            setattr(ingredient, k, v)
        ingredient.recipe = Recipe.objects.get(id=recipe)
        ingredient.save()
        ok = True

        return CreateIngredient(ingredient=ingredient, ok=ok)


class DeleteComment(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        obj = Comment.objects.get(pk=kwargs["id"])
        obj.delete()
        return cls(ok=True)


class DeleteIngredient(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        obj = Ingredient.objects.get(pk=kwargs["id"])
        obj.delete()
        return cls(ok=True)


class DeleteRecipe(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        obj = Recipe.objects.get(pk=kwargs["id"])
        obj.delete()
        return cls(ok=True)


class UpdateIngredient(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        ingredient_data = BaseIngredientInput(required=True)

    ok = graphene.Boolean()
    ingredient = graphene.Field(IngredientType)

    def mutate(self, info, id, ingredient_data):
        try:
            ingredient = Ingredient.objects.get(pk=id)
        except Ingredient.DoesNotExist:
            raise ValueError("Invalid ingredient")

        for k, v in ingredient_data.items():
            setattr(ingredient, k, v)
        ingredient.save()
        ok = True
        return UpdateIngredient(ingredient=ingredient, ok=ok)


class UpdateRecipe(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        recipe_data = BaseRecipeInput(required=False)

    ok = graphene.Boolean()
    recipe = graphene.Field(RecipeType)

    def mutate(self, info, id, recipe_data):
        try:
            recipe = Recipe.objects.get(id=id)
        except Recipe.DoesNotExist:
            raise ValueError("Invalid recipe")

        for k, v in recipe_data.items():
            if not k == "category":
                setattr(recipe, k, v)
            else:
                setattr(recipe, k, Category.objects.get(id=v))
        recipe.save()
        ok = True
        return UpdateRecipe(recipe=recipe, ok=ok)


class UploadRecipePicture(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        file = Upload(required=True)

    success = graphene.Boolean()
    recipe = graphene.Field(RecipeType)

    def mutate(self, info, id, file, **kwargs):
        # do something with your file
        try:
            recipe = Recipe.objects.get(id=id)
        except Recipe.DoesNotExist:
            raise ValueError("Invalid recipe")

        recipe.picture = file
        recipe.save()

        return self(recipe=recipe, success=True)


class UploadProfilePicture(graphene.Mutation):
    """
    Uploads the picture given as the file argument to the profile whitht he username matching the username provided
    """

    class Arguments:
        username = graphene.String(required=True)
        file = Upload(required=True)

    success = graphene.Boolean()
    profile = graphene.Field(ProfileType)

    def mutate(self, info, username, file, **kwargs):
        try:
            # Find the profile with the user field equal to the user model with the right username
            profile = Profile.objects.get(
                user=get_user_model().objects.get(username=username)
            )
        except Profile.DoesNotExist:
            raise ValueError("Invalid profile")

        profile.picture = file
        profile.save()

        return UploadProfilePicture(profile=profile, success=True)


class ToggleRecipeLike(graphene.Mutation):
    class Arguments:
        recipe = graphene.ID(required=True)

    liked = graphene.Boolean()
    recipe_id = graphene.ID()

    def mutate(self, info, recipe):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        profile = get_user_model().objects.get(username=user).profile

        if (
            not profile.liked_recipes.exists()
            or not profile.liked_recipes.filter(id=recipe).exists()
        ):
            profile.liked_recipes.add(recipe)
        else:
            profile.liked_recipes.remove(Recipe.objects.get(id=recipe))

        return ToggleRecipeLike(
            liked=profile.liked_recipes.filter(id=recipe).exists(), recipe_id=recipe
        )


class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)
    ok = graphene.Boolean()

    class Arguments:
        content = graphene.String(required=True)
        recipe = graphene.ID(required=True)

    def mutate(self, info, recipe, content):
        # Create new ingredient
        comment = Comment()
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        comment.author = get_user_model().objects.get(username=user).profile
        comment.recipe = Recipe.objects.get(id=recipe)
        comment.content = content
        comment.save()
        ok = True

        return CreateComment(comment=comment, ok=ok)
