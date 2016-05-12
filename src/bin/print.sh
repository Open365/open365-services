#!/bin/bash

source /tmp/global.env

/code/open365-services/src/bin/printFileEvent.js "$1" @> /tmp/print.log
