# 🔍 DEV vs VPS Version Mismatch Troubleshooting

**Problem:** Your local dev environment is showing older code than what's deployed on VPS.

**Cause:** Git changes haven't been pulled locally, or Docker containers are running cached images.

---

## ✅ Quick Fix (5 minutes)

### Option 1: Automatic Sync (Recommended)
```bash
cd /home/supernovyl/sip
chmod +x sync-dev.sh
./sync-dev.sh
```

This will:
- Pull latest git changes
- Reinstall dependencies
- Rebuild Docker images
- Run migrations
- Verify all services are healthy

---

### Option 2: Manual Sync

**Step 1: Pull latest code**
```bash
cd /home/supernovyl/sip
git pull origin main
git status  # verify you're up to date
```

**Step 2: Stop running containers**
```bash
docker-compose down
```

**Step 3: Remove old images (to force rebuild)**
```bash
docker-compose build --no-cache --parallel
```

**Step 4: Start fresh**
```bash
docker-compose up -d
```

**Step 5: Run migrations**
```bash
docker-compose exec backend alembic upgrade head
```

**Step 6: Verify**
```bash
docker-compose ps
# All services should show "Up"
```

---

## 🔎 How to Check Which Version You're Running

### Frontend (Next.js)
```bash
# Check in browser console
console.log(navigator.userAgent)

# Or check the page source for version number
# Look for: <meta name="version" content="...">
```

### Backend (FastAPI)
```bash
curl http://localhost:8000/api/health
# Compare response with VPS:
curl https://swissimmigrationpro.com/api/health
```

### Docker
```bash
# List images with creation dates
docker images

# Check which commit is deployed locally
git log -1 --oneline

# Compare with VPS deployment
git log --oneline | head -5
```

---

## 🐛 Common Issues

### Issue 1: Code updated but UI still shows old version
**Solution:** Clear browser cache
```bash
# In browser DevTools:
1. Open DevTools (F12)
2. Right-click refresh button → "Empty cache and hard refresh"
3. Or: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows/Linux)
```

### Issue 2: Docker container has old code
**Solution:** Force rebuild without cache
```bash
docker-compose down --volumes
docker-compose build --no-cache --parallel
docker-compose up -d
```

### Issue 3: Node modules out of sync
**Solution:** Reinstall dependencies
```bash
cd swiss-immigration-pro
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 4: Database schema mismatch
**Solution:** Run migrations
```bash
docker-compose exec backend alembic upgrade head
docker-compose exec backend alembic current  # verify
```

---

## 📋 Verification Checklist

After syncing, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8000/api/health
- [ ] API docs available at http://localhost:8000/docs
- [ ] All containers healthy: `docker-compose ps`
- [ ] No errors in logs: `docker-compose logs -f`
- [ ] Latest git commit deployed: `git log -1 --oneline`
- [ ] New features from recent PRs are visible
- [ ] Database migrations applied: `docker-compose exec backend alembic current`

---

## 🚀 Keeping Dev in Sync Going Forward

### Option A: Auto-pull on startup (One-liner)
```bash
git pull origin main && docker-compose up -d
```

### Option B: Git hooks (Auto-sync on pull)
```bash
cat > .git/hooks/post-merge << 'EOF'
#!/bin/bash
echo "🔄 Running sync-dev.sh after git pull..."
./sync-dev.sh
EOF
chmod +x .git/hooks/post-merge
```

### Option C: VS Code Task (Auto-sync on save)
Add to `.vscode/tasks.json`:
```json
{
  "label": "Sync Dev Environment",
  "type": "shell",
  "command": "./sync-dev.sh",
  "runOptions": {
    "instanceLimit": 1
  }
}
```

---

## 📊 Dev vs VPS Comparison

| Component | Dev | VPS |
|-----------|-----|-----|
| **URL** | http://localhost:3000 | https://swissimmigrationpro.com |
| **Code source** | Local git | GitHub main branch |
| **Docker** | Local build | Automated CI/CD build |
| **Database** | Local PostgreSQL | VPS PostgreSQL |
| **Updates** | Manual pull + build | Automatic on git push |
| **Logs** | `docker-compose logs` | SSH to VPS: `/opt/sip/logs` |

---

## 🆘 Still Having Issues?

### Check deployment logs
```bash
# Local
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# VPS (if you have SSH access)
ssh user@vps_ip
cd /opt/sip
docker-compose logs
```

### Compare specific files
```bash
# Get file from VPS and compare
git diff HEAD..origin/main

# Or view raw file:
git show origin/main:path/to/file
```

### Force full reset
```bash
git fetch origin
git reset --hard origin/main
docker-compose down --volumes
docker-compose build --no-cache --parallel
docker-compose up -d
```

---

**Last updated:** March 2, 2026
