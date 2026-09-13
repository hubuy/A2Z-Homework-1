#!/usr/bin/env bash
# Build the site and publish it to the gh-pages branch, which is what GitHub
# Pages serves for this repository.
#
# Usage: scripts/deploy-gh-pages.sh
set -euo pipefail

BRANCH=gh-pages
ROOT=$(git rev-parse --show-toplevel)
WORKTREE=$(mktemp -d)

cleanup() {
  cd "$ROOT"
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
  git worktree prune
}
trap cleanup EXIT

cd "$ROOT"
npm run build

git fetch origin "$BRANCH"
# Detached, so this never collides with a checkout of the branch elsewhere.
git worktree add --detach "$WORKTREE" FETCH_HEAD >/dev/null

# Replace the published files wholesale, keeping the branch's history.
cd "$WORKTREE"
git rm -rq .
cp -r "$ROOT/dist/." .

git add -A
if git diff --cached --quiet; then
  echo "No change to publish."
  exit 0
fi

git commit -q -m "Publish $(git -C "$ROOT" rev-parse --short HEAD) to GitHub Pages"
git push origin "HEAD:$BRANCH"
echo "Published to https://hubuy.github.io/A2Z-Homework-1/"
