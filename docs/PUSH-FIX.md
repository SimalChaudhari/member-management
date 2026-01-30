# Push fix – GitHub secret scanning

GitHub block kyun kar raha hai: **purane commits** (91b53a0, 23334dbf, e49a9b1) history mein hain, unme secrets/trigger patterns the. Abhi wala code secret-free hai, lekin push karte waqt **saari history** jaati hai, isliye block ho raha hai.

**Fix:** History hatao, sirf **ek naya commit** banao jisme current code ho. Phir wahi push karo.

---

## Option 1: Script chalao (Git Bash)

Project root pe:

```bash
bash scripts/fix-push-clean-history.sh
```

Phir:

```bash
git push --force origin main
```

---

## Option 2: Commands khud chalao

```bash
git checkout main
git checkout --orphan temp-clean-main
git add -A
git reset HEAD .env 2>/dev/null || true
git reset HEAD src/.env 2>/dev/null || true
git commit -m "SSO auth: env vars only, no secrets in repo"
git branch -D main
git branch -m main
git push --force origin main
```

---

## Kya hoga

- **Pehle:** `main` pe bahut commits, unme se kuch purane (e49a9b1, 23334dbf, 91b53a0) secrets wale.
- **Script ke baad:** `main` pe sirf **ek** commit – jisme aapka **puran current code** (SSO, auth, sab) hoga. Koi purana commit history mein nahi bachega.
- **Push:** Sirf yeh ek commit push hoga, isliye GitHub secret scan pass ho jayega.

**Important:** Push ke baad jo bhi purana `main` pull karke kaam kar rahe hon, unko yeh chalaana hoga:

```bash
git fetch origin
git reset --hard origin/main
```

Isse aap **purana code lose nahi karoge** – jo code ab folder mein hai wahi ek naye commit mein commit ho kar push ho jayega. Sirf purani commit history hat jayegi.
