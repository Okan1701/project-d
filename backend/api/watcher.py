import requests
import api.console as console
import datetime
import threading
import time


class MatchWatcherService():
    match_update_interval_seconds = 60
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
            console.log(f"Did not update match {match.id} because sport_date is greater than today")
            return False

        # If match has already been updated, then skip
        if match.status_code == 2:
            console.log(f"Did not update match {match.id} because status_code equals 2 (CanClaimReward)")
            return

        if sport_date <= now:
            if match.status_code == 0:
                # Set match status to pending
                match.status_code = 1
                match.save()
                console.log(f"Updated match {match.id} status_code to 1 (pending)")
                return True

            # If both scores are not yet known, match will stay in pending
            if sport_data["intHomeScore"] is None or sport_data["intAwayScore"] is None:
                console.log(f"Did not update match {match.id} because team scores are not available!")
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
            console.log(f"Updated match {match.id} status_code to 2, final scores have been updated")
            return True

    def check_all_matches(self):
        while True:
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

            console.log(f"{update_count} out of {total_count} matches have been updated! Next update in {self.match_update_interval_seconds} seconds")

            # Delay the next loop iteration
            time.sleep(self.match_update_interval_seconds)

    def run(self):
        # Create instance of the thread that will run check_all_matches and start it
        thread_instance = threading.Thread(target=self.check_all_matches, name="MatchWatcherThread")
        thread_instance.start()
