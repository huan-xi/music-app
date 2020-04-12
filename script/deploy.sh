#!/usr/bin/env bash
cd ~/IdeaProjects
cd music-app/
npm run build
cd ../huan-xi.github.io
git pull
cd ../
cp -r  huan-xi.github.io/.git dist/
cd dist
git add --all
git commit -m "123"
git push