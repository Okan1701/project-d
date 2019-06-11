import datetime

LOG_TITLE = "MatchWatcher"


def log(txt):
    txt = str(txt)

    now = datetime.datetime.now()
    print_header = "[" + LOG_TITLE + " " + now.strftime("%Y-%m-%d %H:%M") + "]"
    print(print_header + " " + txt)


def change_log_title(title):
    global LOG_TITLE
    LOG_TITLE = title
