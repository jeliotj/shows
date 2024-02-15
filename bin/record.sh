#!/bin/bash

WEEKDAY=$1
START_HOUR=$2
END_HOUR=$3

(mplayer -dumpfile /www/html/shows/${WEEKDAY}/${START_HOUR}-${END_HOUR}/$(date +\%Y-\%m-\%d).mp3 -dumpstream http://localhost:9999/stream)
