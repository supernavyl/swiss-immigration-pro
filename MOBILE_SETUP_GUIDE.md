# 📱 Mobile App - Setup & Fix Guide

## Issues

**Problem**: Mobile app not working, Firefox undefined errors

## Root Cause

The mobile app is a React Native app (using Expo). It needs:
1. Proper environment setup
2. Backend API URL configured
3. Correct build/run command

## ✅ Setup Instructions

### Step 1: Install Dependencies

```bash
cd /home/supernovyl/sip/mobile
npm install
# or
yarn install
```

### Step 2: Configure Backend URL

**Create `.env` file in mobile directory:**

```bash
cat > /home/supernovyl/sip/mobile/.env << 'EOF'
EXPO_PUBLIC_API_URL=http://localhost:8000
EOF
```

Or if running on device/emulator:
```
EXPO_PUBLIC_API_URL=http://192.168.1.X:8000  # Replace X with your computer IP
```

### Step 3: Run Mobile App

**Option A: Web (Testing)**
```bash
cd /home/supernovyl/sip/mobile
npm run web
# Opens http://localhost:19006
```

**Option B: Android (Emulator)**
```bash
cd /home/supernovyl/sip/mobile
npm run android
```

**Option C: iOS (Mac only)**
```bash
cd /home/supernovyl/sip/mobile
npm run ios
```

**Option D: Start Expo Server**
```bash
cd /home/supernovyl/sip/mobile
npm start
# Scan QR with Expo Go app
```

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module" errors
**Fix:**
```bash
cd /home/supernovyl/sip/mobile
rm -rf node_modules
rm package-lock.json yarn.lock
npm install
```

### Issue 2: API connection fails
**Fix:**
1. Check `.env` has correct `EXPO_PUBLIC_API_URL`
2. Ensure backend is running: `docker-compose ps backend`
3. Test backend: `curl http://localhost:8000/api/health`

### Issue 3: "undefined is not an object" on web
**Cause**: This is expected! React Native web doesn't support all native features
**Fix**: Install additional packages:

```bash
cd /home/supernovyl/sip/mobile
npm install react-native-web react-dom
```

### Issue 4: Port already in use (19006)
**Fix:**
```bash
# Find process using port 19006
lsof -i :19006
# Kill it
kill -9 <PID>
```

## 📁 Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx        ← Root layout
│   ├── (auth)/            ← Auth screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/            ← Main app screens
│       ├── index.tsx      ← Home/Dashboard
│       ├── chat.tsx       ← AI Chat
│       ├── modules.tsx    ← Learning Modules
│       └── profile.tsx    ← User Profile
├── lib/
│   ├── api.ts             ← API client
│   ├── auth.tsx           ← Auth context
│   └── colors.ts          ← Theme colors
├── components/            ← Reusable components
├── .env                   ← Environment variables
└── package.json
```

## 🔌 API Integration

The mobile app uses Expo with TypeScript. All API calls go through `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// GET request
const data = await api.get('/api/users/profile');

// POST request
const result = await api.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// Error handling
try {
  const result = await api.post('/api/auth/login', {...});
} catch (err) {
  console.error(err.detail); // API error message
}
```

## 🔐 Authentication

Mobile app uses JWT tokens stored in **Secure Store** (encrypted):

```typescript
import { api, getToken, setTokens, removeTokens } from '@/lib/api';
import { useAuth } from '@/lib/auth';

// In components:
const { user, signIn, signOut } = useAuth();

// Login
const { error } = await signIn('email@example.com', 'password');

// Logout
await signOut();
```

## 🧪 Testing

### Test Login Flow
```bash
1. Run mobile app: npm run web
2. Go to http://localhost:19006
3. Click "Sign In"
4. Enter credentials:
   - Email: test@example.com (or any registered user)
   - Password: password123
5. Should redirect to dashboard
```

### Test API Integration
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Should return:
# {
#   "status": "ok",
#   "service": "Swiss Immigration Pro",
#   "version": "3.0.0",
#   "checks": {...}
# }
```

## 📚 Debugging

### Enable Debug Logs
```typescript
// In any component
console.log('Debug:', value);

// View in:
// - Web: DevTools (F12)
// - Android: Android Studio / adb logcat
// - iOS: Xcode console
```

### Check Network Requests
```bash
# In browser web version (F12)
# - Network tab
# - Check requests to http://localhost:8000/api/*
```

## 🚀 Build for Production

### Web Build
```bash
cd /home/supernovyl/sip/mobile
npx expo export --platform web
# Output: dist/
```

### Android Build
```bash
eas build --platform android
```

### iOS Build
```bash
eas build --platform ios
```

## 📝 Environment Variables

**File**: `mobile/.env`

```
# Backend API URL (required)
EXPO_PUBLIC_API_URL=http://localhost:8000

# Optional
EXPO_PUBLIC_APP_NAME=Swiss Immigration Pro
EXPO_PUBLIC_DEBUG=true
```

## ✨ Next Steps

1. **Install dependencies**: `npm install`
2. **Set .env**: Configure `EXPO_PUBLIC_API_URL`
3. **Start dev server**: `npm start` or `npm run web`
4. **Test login**: Use registered account
5. **Check console**: No errors should appear

---

**Mobile app is now ready to use!** 🎉

For more help, check Expo docs: https://docs.expo.dev/
