"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    # my urls
    path("", include("apps.index.urls")),
    path("accounts/", include("apps.accounts.urls")),
    path("nonprofits/", include("apps.org_pages.urls")),
    path("items/", include("apps.items.urls")),
    path("api-auth/", include("rest_framework.urls")),
    # django urls
    path("accounts/", include("django.contrib.auth.urls")),
    path("admin/", admin.site.urls),
]
