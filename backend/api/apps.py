from django.apps import AppConfig

from api.watcher import MatchWatcherService


class ApiConfig(AppConfig):
    name = 'api'
    watcher_started = False

    def ready(self):
        from api.models import Match
        if not self.watcher_started:
            self.watcher_started = True
            watcher = MatchWatcherService(Match)
            watcher.check_all_matches()
