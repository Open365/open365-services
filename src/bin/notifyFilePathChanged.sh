#!/usr/bin/env bash

THISDIR="$(cd "$(dirname "$0")" && pwd)"
EVENT_NAME="filePathChange"
FILE_PATH=$2

"$THISDIR"/sendFileEvent.sh "$EVENT_NAME" "$FILE_PATH"
