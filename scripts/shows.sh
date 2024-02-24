#!/bin/bash


Help()
{
  echo "USAGE: shows [OPTION]... [ARGS]..."
  echo
  echo "options:"
  echo "h    Print this Help."
  echo "N    Show name"
  echo "o    Start hour"
  echo "m    Start minute"
  echo "e    End hour"
  echo "n    Day"
  echo "d    Weekday"
  echo "l    Show length in minutes"
  echo
}

while getopts ":h:N:o:m:e:n:d:l:D" option; do
  case $option in
    h)
      Help
      exit;;
    N)
      SHOW_NAME=$OPTARG;;
    o)
      START_HOUR=$OPTARG;;
    m)
      START_MINUTE=$OPTARG;;
    e)
      END_HOUR=$OPTARG;;
    n)
      DAY=$OPTARG;;
    d)
      WEEKDAY=$OPTARG;;
    l)
      LENGTH=$OPTARG;;
    D)
      DELETE_USED=true;;
    \?)
      Help
      exit;;
  esac
done

Delete()
{
  (crontab -l 2>/dev/null | grep -v "\"$SHOW_NAME\"") | crontab -
  echo "Deleted Show: $SHOW_NAME"
}

if [ -v DELETE_USED ]; then
  Delete
else
  (crontab -l 2>/dev/null; echo "$START_MINUTE $START_HOUR * * $DAY timeout ${LENGTH}m /usr/local/bin/record.sh \"$SHOW_NAME\" $WEEKDAY $START_HOUR $END_HOUR") | crontab - 
  echo "Created new show"
  echo "New crontab entry called \"${SHOW_NAME}\" on ${WEEKDAY} at ${START_HOUR}:${START_MINUTE}" >> /home/jes/kbmf/shows/log/shows.log
fi
