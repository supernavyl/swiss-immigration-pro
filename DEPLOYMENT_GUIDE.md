# 🚀 DEPLOYMENT GUIDE

## Step 1: Pre-Deployment Verification

```bash
# Make script executable
chmod +x verify.sh

# Run verification
./verify.sh
```

Expected output: **🎉 ALL CHECKS PASSED! READY TO GO!**

---

## Step 2: Install Dependencies

```bash
# Web app
cd swiss-immigration-pro
npm install
npm run build  # Optional but recommended

# Mobile app
cd ../mobile
npm install

# Backend (if using virtual environment)
cd ../backend
pip install -r requirements.txt
```

---

## Step 3: Database Setup

```bash
cd backend

# Run migrations
alembic upgrade head

# Check status
alembic current
```

---

## Step 4: Start Services

### Option A: Development (All Services)

**Terminal 1 - Backend**
```bash
cd /home/supernovyl/sip
docker-compose up
```

**Terminal 2 - Web App**
```bash
cd /home/supernovyl/sip/swiss-immigration-pro
npm run dev
```

**Terminal 3 - Mobile (Optional)**
```bash
cd /home/supernovyl/sip/mobile
npm run web
```

### Option B: Production Mode

```bash
# Build web app
cd swiss-immigration-pro
npm run build
npm run start

# Build mobile (optional)
cd ../mobile
npm run build
```

---

## Step 5: Verify Everything Works

### 1. Test Backend
```bash
curl http://localhost:8000/api/health
```

Expected:
```json
{
  "status": "ok",
  "service": "Swiss Immigration Pro",
  "version": "3.0.0"
}
```

### 2. Test Web App
- Open: http://localhost:3000
- Should load without errors
- Test exit intent popup (go to /pricing, move mouse to exit)
- Test admin newsletter (go to /admin/newsletter)

### 3. Test Mobile
- Open: http://localhost:19006
- Should show login screen
- Should connect to backend

### 4. Browser Console Check
- Press F12 (DevTools)
- Go to Console tab
- Should see NO red error messages

---

## Step 6: Post-Deployment Checks

### Security Checks
- [ ] JWT tokens working
- [ ] Admin authentication required
- [ ] CORS configured correctly
- [ ] No sensitive data in logs

### Performance Checks
- [ ] Page loads < 3 seconds
- [ ] API responses < 1 second
- [ ] No memory leaks (DevTools)
- [ ] No N+1 database queries

### Functionality Checks
- [ ] Login/Register works
- [ ] Newsletter admin loads
- [ ] Exit intent popup works
- [ ] Mobile connects
- [ ] Admin panel accessible

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (if needed)
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Backend Won't Start
```bash
# Check Docker
docker-compose logs backend

# Rebuild
docker-compose down
docker-compose up --build
```

### Mobile Can't Connect
1. Check `.env` has correct URL
2. Check backend is running
3. Test: `curl http://localhost:8000/api/health`

### Database Migration Error
```bash
# Check migration status
alembic current

# Downgrade and retry
alembic downgrade -1
alembic upgrade head
```

### Certificate/SSL Errors
- Development: Use http:// not https://
- Production: Configure SSL in nginx/reverse proxy

---

## 📋 Deployment Checklist

### Before Going Live
- [ ] All verification checks pass
- [ ] No console errors
- [ ] Database migrations run successfully
- [ ] Environment variables set correctly
- [ ] Dependencies installed
- [ ] Backend responds to health check
- [ ] Web app loads at /
- [ ] Admin panel loads at /admin/newsletter
- [ ] Login/logout works
- [ ] Newsletter can be sent

### During Deployment
- [ ] Start backend first
- [ ] Wait for database connections
- [ ] Start web app
- [ ] Start mobile (if needed)
- [ ] Verify all services running

### After Deployment
- [ ] Test in browser
- [ ] Test on mobile
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Verify backups running

---

## 📊 Service Status Commands

```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f web

# Restart a service
docker-compose restart backend

# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🔄 Rollback Procedure

If something goes wrong:

```bash
# Stop services
docker-compose down

# Revert to previous commit
git checkout HEAD~1

# Downgrade database
alembic downgrade -1

# Restart
docker-compose up
```

---

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
SECRET_KEY=<random-secret>
DEBUG=false
STRIPE_SECRET_KEY=sk_...
RESEND_API_KEY=re_...
```

### Web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CONTENT_URL=http://localhost:3000
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_CONTENT_URL=http://localhost:3000
```

---

## 🎯 Success Criteria

✅ All services running  
✅ No red console errors  
✅ API responding  
✅ Web app loads  
✅ Admin panel works  
✅ Mobile connects  
✅ Database migrations complete  

---

**Your application is ready for deployment!** 🚀
