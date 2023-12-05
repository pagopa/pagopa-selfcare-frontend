#!/usr/bin/env bash

# Recreate config file and assignment
echo "// Generated automatically, please don't write here" > ./public/env-config.js
echo "" >> ./public/env-config.js
echo "window._env_ = {" >> ./public/env-config.js

# Loop on environment variables prefixed with
# add them to env-config.js


for react_var in $(env | grep -i REACT_APP_); do
    varname=$(printf '%s\n' "$react_var" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$react_var" | sed -e 's/^[^=]*=//')

    echo "  $varname: \"$varvalue\"," >> ./public/env-config.js
done

echo "};" >> ./public/env-config.js
