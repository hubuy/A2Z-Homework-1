#!/usr/bin/env bash
# Build the site and publish it to the gh-pages branch, which is what GitHub
# Pages serves for this repository.
#
# Usage: scripts/deploy-gh-pages.sh
set -euo pipefail

BRANCH=gh-pages
ROOT=$(git rev-parse --show-toplevel)
WORKTREE=$(mktemp -d)

cd "$ROOT"
npm run build

git fetch origin "$BRANCH"
git worktree add "$WORKTREE" -B "$BRANCH" "origin/$BRANCH" >/dev/null

# Replace the published files wholesale, keeping the branch's history.
cd "$WORKTREE"
git rm -rq .
cp -r "$ROOT/dist/." .

git add -A
if git diff --cached --quiet; then
  echo "No change to publish."
else
  git commit -q -m "Publish $(git -C "$ROOT" rev-parse --short HEAD) to GitHub Pages"
  git push origin "$BRANCH"
  echo "Published to https://hubuy.github.io/A2Z-Homework-1/"
fi

cd "$ROOT"
git worktree remove --force "$WORKTREE"
