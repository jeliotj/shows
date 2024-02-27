#!/bin/bash

SHOWNAME=$1
WEEKDAY=$2
START_HOUR=$3
END_HOUR=$4

SHOWNAME=`sed 's/[^a-zA-Z0-9 ]//g' <<< $SHOWNAME | sed 's/ /-/g'`
ROOTDIR='/home/www/html/shows/'
TARGETDIR=${WEEKDAY}/${START_HOUR}-${END_HOUR}
NEWFILE=${SHOWNAME}-$(date +\%Y-\%m-\%d).mp3
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
