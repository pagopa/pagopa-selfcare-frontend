#!/usr/bin/env bash

echo "{" > ./public/version.json
appenv="local"
for react_var in $(env | grep -i REACT_APP_ENV); do
    appenv=$(printf '%s\n' "$react_var" | sed -e 's/^[^=]*=//')
done

echo "Extracting version ${npm_package_version} for front-end service ${npm_package_name}..."

echo $(printf '\t"name": "%s",\n' "${npm_package_name}") >> ./public/version.json
echo $(printf '\t"version": "%s",\n' "${npm_package_version}") >> ./public/version.json
echo $(printf '\t"environment": "%s"\n' "${appenv}") >> ./public/version.json
echo "}" >> ./public/version.json
