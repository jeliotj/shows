#!/bin/bash


Help()
{
  echo "USAGE: shows [OPTION]... [ARGS]..."
  echo
  echo "options:"
  echo "h    Print this Help."
  echo "o    Start hour"
  echo "m    Start minute"
  echo "e    End hour"
  echo "n    Day"
  echo "d    Weekday"
  echo "l    Show length in minutes"
  echo
}

while getopts ":ho:m:e:n:d:l:" option; do
  case $option in
    h)
      Help
      exit;;
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
    \?)
      Help
      exit;;
  esac
done

(crontab -l 2>/dev/null; echo "$START_MINUTE $START_HOUR * * $DAY timeout ${LENGTH}m /usr/local/bin/record.sh $WEEKDAY $START_HOUR $END_HOUR") | crontab -
