#!/bin/bash
set -e
cd "`dirname "$BASH_SOURCE"`"

tar -zcvf postx.tar.gz \
    js  jquery.js clipboard.min.js \
    *.html 