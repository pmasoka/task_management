from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):

    ROLE_CHOICES = (
        ('manager', 'Property Manager'),
        ('staff', 'Maintenance Staff'),
        ('resident', 'Resident'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='resident'
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class MaintenanceRequest(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium'
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_requests'
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_requests'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.status})"


# =========================
# USER PROFILE SIGNALS
# =========================

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):

    if created:

        Profile.objects.get_or_create(
            user=instance
        )


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):

    Profile.objects.get_or_create(
        user=instance
    )

    instance.profile.save()