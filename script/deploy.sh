#!/usr/bin/env bash
cd ~/IdeaProjects
cd music-app/
npm run build
cd ../
cd  huan-xi.github.io
git pull
cd ../
cp -r  huan-xi.github.io/.git dist/.git
cd dist
git add --all
git commit -m "123"
git push