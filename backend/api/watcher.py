import requests
import api.console as console
import datetime


class MatchWatcherService():
    match_update_interval = 10
    queryset_type = None

    def __init__(self, queryset_type):
        self.queryset_type = queryset_type

    def update_match(self, match):
        # Fetch sport data
        url = f"https://www.thesportsdb.com/api/v1/json/1/lookupevent.php?id={match.sport_event_id}"
        response = requests.get(url)
        response_data = response.json()
        sport_data = response_data["events"][0]

        # Get the sport date and the current date
        sport_date = datetime.datetime.strptime(sport_data["dateEvent"], "%Y-%m-%d").date()
        now = datetime.date.today()

        # If the sport hasn't actually occured, then we dont have to update
        if sport_date > now:
            return False

        if sport_date <= now:
            # Set match status to pending
            match.status_code = 1

            # If both scores are not yet known, match will stay in pending
            if sport_data["intHomeScore"] is None or sport_data["intAwayScore"] is None:
                return False

            home_score = int(sport_data["intHomeScore"])
            away_score = int(sport_data["intAwayScore"])

            # Set the winning team based on score
            if home_score > away_score:
                match.winning_team = 0
                match.status_code = 2
            elif home_score < away_score:
                match.winning_team = 1
                match.status_code = 2
            elif home_score == away_score:
                match.winning_team = 2
                match.status_code = 2

            match.save()
            return True

    def check_all_matches(self):
        console.log("Running check on all matches...")
        total_count = 0  # Total matches it checked
        update_count = 0  # Amount of matches that it actually updated

        # Get the active matches
        queryset = self.queryset_type.objects.filter(active=True)

        # Loop through each match and update it
        for match in queryset:
            total_count += 1
            has_updated = self.update_match(match)
            if has_updated:
                update_count += 1

        console.log(f"{update_count} out of {total_count} matches have been updated!")
