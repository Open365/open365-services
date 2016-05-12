#!/bin/bash
set -e
set -u
set -x

THISDIR="$(cd "$(dirname "$0")" && pwd)"

#
# Executables
#
ln -s $THISDIR/src/bin/* /usr/bin/
ln -s $THISDIR/src/open365-services.js /usr/bin/
