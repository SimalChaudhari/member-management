#!/bin/bash
# Run this BEFORE git fetch + git reset --hard origin/main
# so you can get your current code back later.
# Usage: bash scripts/backup-before-reset.sh

branch_name="backup-before-reset-$(date +%Y%m%d-%H%M)"
git branch "$branch_name"
echo "Created branch: $branch_name"
echo "After reset, to get your code back: git checkout $branch_name"
echo "Or merge into main: git checkout main && git merge $branch_name"
