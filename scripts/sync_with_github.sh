#!/usr/bin/env bash
set -euo pipefail

# Simple sync script: fetch from origin, rebase current branch, push if ahead
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Repository: $REPO_DIR"
echo "Current branch: $CURRENT_BRANCH"

git fetch --all --tags --prune

# Rebase onto remote
git pull --rebase origin "$CURRENT_BRANCH"

# Push any local commits
if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree has changes; please commit before syncing."
  exit 1
fi

UPSTREAM=$(git for-each-ref --format='%(upstream:short)' refs/heads/"$CURRENT_BRANCH")
if [ -z "$UPSTREAM" ]; then
  echo "No upstream set for $CURRENT_BRANCH. Setting upstream to origin/$CURRENT_BRANCH"
  git push -u origin "$CURRENT_BRANCH"
else
  echo "Pushing to origin/$CURRENT_BRANCH"
  git push origin "$CURRENT_BRANCH"
fi

echo "Sync complete."
