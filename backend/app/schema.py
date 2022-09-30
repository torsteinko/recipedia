import graphene
import graphql_jwt
from graphene_django.filter import DjangoFilterConnectionField

from .mutations import (
    CreateComment,
    CreateIngredient,
    SetRating,
    DeleteRating,
    CreateRecipe,
    CreateUser,
    DeleteComment,
    DeleteIngredient,
    DeleteRecipe,
    ToggleRecipeLike,
    UpdateIngredient,
    UpdateProfile,
    UpdateRecipe,
    UploadProfilePicture,
    UploadRecipePicture,
)
from .resolvers import AppResolvers
from .types import CategoryType, RecipeType, UserType


class AppQueries(graphene.ObjectType, AppResolvers):
    all_recipes = DjangoFilterConnectionField(RecipeType)
    all_categories = graphene.List(CategoryType)
    user_details = graphene.Field(UserType)


class AppMutations(graphene.ObjectType):

    # mutation for adding rating
    set_rating = SetRating.Field()
    delete_rating = DeleteRating.Field()

    # Authentication
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()

    # User mutations
    create_user = CreateUser.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    update_profile = UpdateProfile.Field()
    upload_profile_picture = UploadProfilePicture.Field()

    create_comment = CreateComment.Field()
    delete_comment = DeleteComment.Field()

    # Recipe mutations
    create_recipe = CreateRecipe.Field()
    update_recipe = UpdateRecipe.Field()
    delete_recipe = DeleteRecipe.Field()
    toggle_recipe_like = ToggleRecipeLike.Field()

    # Ingredient mutations
    create_ingredient = CreateIngredient.Field()
    update_ingredient = UpdateIngredient.Field()
    delete_ingredient = DeleteIngredient.Field()
    upload_recipe_picture = UploadRecipePicture.Field()
