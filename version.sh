#!/usr/bin/env bash

echo "{" > ./public/version.json
# appname=$(printf '\t"name": "%s",\n' "${npm_package_name}")
# appversion=$(printf '\t"version": "%s",\n' "${npm_package_version}")
appenv="local"
for react_var in $(env | grep -i REACT_APP_ENV); do
    appenv=$(printf '%s\n' "$react_var" | sed -e 's/^[^=]*=//')
done


echo $(printf '\t"name": "%s",\n' "${npm_package_name}") >> ./public/version.json
echo $(printf '\t"version": "%s",\n' "${npm_package_version}") >> ./public/version.json
echo $(printf '\t"environment": "%s",\n' "${appenv}") >> ./public/version.json
echo "}" >> ./public/version.json
