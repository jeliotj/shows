#!/bin/bash

WEEKDAY=$1
START_HOUR=$2
END_HOUR=$3

ROOTDIR='/home/www/html/shows/'
TARGETDIR=${WEEKDAY}/${START_HOUR}-${END_HOUR}
NEWFILE=$(date +\%Y-\%m-\%d).mp3
FULLPATH=${ROOTDIR}${TARGETDIR}

if ! [ -d ${FULLPATH} ]; then
  mkdir ${FULLPATH};
  echo "Made new directory ${FULLPATH}"
fi

if ! [ -f ${FULLPATH}/${NEWFILE} ]; then
  (mplayer -dumpfile ${ROOTDIR}${TARGETDIR}/${NEWFILE} -dumpstream http://localhost:9999/stream);
else 
  echo 'Target file already exists!';
  exit 1;
fi
