from .models import Category
from django.contrib.auth.models import User


class AppResolvers:
    def resolve_all_categories(self, info):
        return Category.objects.all()

    def resolve_user_details(root, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return User.objects.get(username=user)
