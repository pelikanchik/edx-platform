from .dev import *

LANGUAGES = ( ('ru', 'Russian'), )
TIME_ZONE = 'Europe/Moscow'
LANGUAGE_CODE = 'ru'

INSTALLED_APPS += ('social_auth',)

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

SOCIAL_AUTH_LOGIN_URL = MITX_ROOT_URL + '/accounts/login'
SOCIAL_AUTH_BACKEND_ERROR_URL = MITX_ROOT_URL
SOCIAL_AUTH_LOGIN_REDIRECT_URL = MITX_ROOT_URL + '/dashboard'

SOCIAL_AUTH_PIPELINE = (
    'social_auth.backends.pipeline.social.social_auth_user',
    'social_auth.backends.pipeline.associate.associate_by_email',
    'social_auth.backends.pipeline.user.get_username',
    'social_auth.backends.pipeline.user.create_user',
    'social_auth.backends.pipeline.user.create_profile',
    'social_auth.backends.pipeline.social.associate_user',
    'social_auth.backends.pipeline.social.load_extra_data',
    'social_auth.backends.pipeline.user.update_user_details'
)

VK_APP_ID = '3918947'
VKONTAKTE_APP_ID = VK_APP_ID
VK_API_SECRET = 'IrmKRqe7vUkFHs4WMv38'
VKONTAKTE_APP_SECRET = VK_API_SECRET
GOOGLE_OAUTH2_CLIENT_ID = '757302632583.apps.googleusercontent.com'
GOOGLE_OAUTH2_CLIENT_SECRET = '13d4AdezwejXFIdtI_QTtC8J'
FACEBOOK_APP_ID = '563568760379826'
FACEBOOK_API_SECRET = 'd45d0bdf3f8ab4a19059ca94c5a6fdfa'

SOCIAL_AUTH_PROVIDERS = [
    {'id': p[0], 'name': p[1], 'position': {'width': p[2][0], 'height': p[2][1], }}
    for p in (
        ('vk-oauth', u'Login via vk.com', (0, 0)),
        ('yandex', u'Login via Yandex', (0, -210)),
        ('google-oauth2', u'Login via Google', (0, -175)),
        ('facebook', u'Login via Facebook', (0, -105)),
    )
]
