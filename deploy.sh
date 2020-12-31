#!/usr/bin/env sh
 
# abort on errors
set -e
 
# build
npm run build
 
# navigate into the build output directory
cd dist
 
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
 
git init
git add -A
git commit -m "update `date +'%Y-%m-%d %H:%M:%S'`"
 
# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
 
# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
git push -f https://github.com/andy922200/vue3_typescript_d3.git master:gh-pages
 
cd -