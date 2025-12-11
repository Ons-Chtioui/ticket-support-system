"""
Django settings for backend project.
VERSION CORRIGÉE ET VALIDÉE POUR CLOUDINARY
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-dp(t2tw6l1gv^t)16&aoq67%em!+4#-fg57=t0w&!7^46%%plc'
DEBUG = True
ALLOWED_HOSTS = []

# --- 1. APPLICATIONS (L'ORDRE EST CRUCIAL ICI) ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',

    # ⚠️ CORRECTION CRITIQUE : Cloudinary Storage DOIT être AVANT staticfiles ⚠️
    'cloudinary_storage',           # <--- EN PREMIER (Indispensable)
    'django.contrib.staticfiles',   # <--- EN DEUXIÈME
    'cloudinary',                   # <--- EN TROISIÈME

    # --- Tiers ---
    'django_filters',
    'rest_framework',
    'corsheaders',

    # --- Mes Apps ---
    'users',
    'tickets',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- 2. CONFIGURATION CLOUDINARY ---
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'onscloud',
    'API_KEY': '144185985771193',
    'API_SECRET': '4giiL7u5ovd_iynrZO8Z9-m161w',
}

# --- 3. ACTIVATION DU STOCKAGE (COMPATIBLE DJANGO 4.2 ET 5.0+) ---
# Cette configuration remplace l'ancien DEFAULT_FILE_STORAGE qui est déprécié
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# (Optionnel) Gardez ceci pour la compatibilité avec les vieilles librairies
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'