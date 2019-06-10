from django.apps import AppConfig

from api.watcher import MatchWatcherService

MATCH_WATCHER_STARTED = False
MATCH_WATCHER_SERVICE = None

class ApiConfig(AppConfig):
    name = 'api'

