#!/bin/bash
# Run this to remove old commits with secrets, then push will succeed.
# Usage: bash scripts/fix-push-clean-history.sh

set -e
echo "=== Creating new main with ONE commit (no old history) ==="

git checkout main
git checkout --orphan temp-clean-main
git add -A
git reset HEAD .env 2>/dev/null || true
git reset HEAD src/.env 2>/dev/null || true
git commit -m "SSO auth: env vars only, no secrets in repo"
git branch -D main
git branch -m main

echo ""
echo "=== Done. Now run:  git push --force origin main"
echo ""
