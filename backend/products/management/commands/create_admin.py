from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create or update the Secure CRUD admin user"

    def handle(self, *args, **options):
        User = get_user_model()

        user, created = User.objects.get_or_create(
            username="admin"
        )

        user.set_password("12345678")
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS("Admin user created successfully.")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("Admin user password updated successfully.")
            )