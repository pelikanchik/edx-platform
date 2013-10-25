from .dev import *

LANGUAGES = ( ('ru', 'Russian'), )
TIME_ZONE = 'Europe/Moscow'
LANGUAGE_CODE = 'ru'

#INSTALLED_APPS += ('social_auth',)

AUTHENTICATION_BACKENDS += (
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.facebook.FacebookBackend',
    'social_auth.backends.contrib.vk.VKOAuth2Backend',
    'social_auth.backends.google.GoogleOAuth2Backend',
    'social_auth.backends.contrib.github.GithubBackend',
    'social_auth.backends.contrib.yandex.YandexBackend',
    'social_auth.backends.contrib.yandex.YandexOAuth2Backend',
    'social_auth.backends.contrib.yandex.YaruBackend',
    'django.contrib.auth.backends.ModelBackend',
)

TEMPLATE_CONTEXT_PROCESSORS += (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.request',
    'social_auth.context_processors.social_auth_by_name_backends',
)

SOCIAL_AUTH_DEFAULT_USERNAME = 'Your name:'

SOCIAL_AUTH_CREATE_USERS = True

SOCIAL_AUTH_PIPELINE = (
    'social_auth.backends.pipeline.social.social_auth_user',
    'social_auth.backends.pipeline.associate.associate_by_email',
    'social_auth.backends.pipeline.user.get_username',
    'social_auth.backends.pipeline.user.create_user',
    'social_auth.backends.pipeline.social.associate_user',
    'social_auth.backends.pipeline.social.load_extra_data',
    'social_auth.backends.pipeline.user.update_user_details'
)

VK_APP_ID = '3918947'
VKONTAKTE_APP_ID = VK_APP_ID
VK_API_SECRET = 'IrmKRqe7vUkFHs4WMv38'
VKONTAKTE_APP_SECRET = VK_API_SECRET

SOCIAL_AUTH_PROVIDERS = [
    {'id': p[0], 'name': p[1], 'position': {'width': p[2][0], 'height': p[2][1], }}
    for p in (
        ('vk-oauth', u'Login via vk.com', (0, 0)),
        ('yandex', u'Login via Yandex', (0, -210)),
    )
]
