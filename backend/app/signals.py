from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from app import models
from functools import wraps


def disable_for_loaddata(signal_handler):
    """
    Decorator that turns off signal handlers when loading fixture data.
    """

    @wraps(signal_handler)
    def wrapper(*args, **kwargs):
        if kwargs.get("raw"):
            return
        signal_handler(*args, **kwargs)

    return wrapper


@disable_for_loaddata
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        models.Profile.objects.create(user=instance)


@disable_for_loaddata
@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
