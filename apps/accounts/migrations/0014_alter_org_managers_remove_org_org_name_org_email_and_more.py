# Generated by Django 4.2.4 on 2023-11-13 18:51

import django.contrib.auth.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_remove_item_id_item_item_name'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='org',
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.RemoveField(
            model_name='org',
            name='org_name',
        ),
        migrations.AddField(
            model_name='org',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='email address'),
        ),
        migrations.AddField(
            model_name='org',
            name='username',
            field=models.CharField(default='a', error_messages={'unique': 'Orginization with this name already exists'}, max_length=100, unique=True, verbose_name='org name'),
            preserve_default=False,
        ),
    ]
