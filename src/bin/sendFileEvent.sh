#!/usr/bin/env bash

if [ -r /tmp/global.env ]
then
    source /tmp/global.env
fi

THISDIR="$(cd "$(dirname "$0")" && pwd)"
EVENT_NAME=$1
FILE_PATH=$2

"$THISDIR"/sendFileEvent.js "$EVENT_NAME" "$FILE_PATH"
