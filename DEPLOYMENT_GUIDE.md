# PreventiX Deployment Guide

## 🚀 Vercel Frontend Deployment

### **Step 1: Prepare Your Frontend**

1. **Update API Configuration**
   - The frontend is configured to use `VITE_API_BASE_URL` environment variable
   - Default fallback is `http://localhost:8000` (for development)

2. **Build Configuration**
   - Vite is configured with proper build settings
   - `vercel.json` is included for Vercel deployment

### **Step 2: Deploy to Vercel**

#### **Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: preventix-frontend
# - Directory: ./
# - Override settings? No
```

#### **Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`

### **Step 3: Configure Environment Variables**

In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the following variables:

```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

**Backend URL Options:**
- **Vercel Backend**: `https://your-backend.vercel.app`
- **Railway**: `https://your-backend.railway.app`
- **Heroku**: `https://your-backend.herokuapp.com`
- **Render**: `https://your-backend.onrender.com`

---

## 🔧 Backend Deployment Options

### **Option 1: Vercel (Serverless Functions)**

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

Deploy:
```bash
cd backend
vercel
```

### **Option 2: Railway (Recommended for Python)**

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder
4. Add environment variables:
   ```env
   MONGODB_URL=your-mongodb-connection-string
   JWT_SECRET_KEY=your-secret-key
   ```

### **Option 3: Render**

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set **Root Directory** to `backend`
5. Set **Build Command** to `pip install -r requirements.txt`
6. Set **Start Command** to `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 🔧 Common Issues & Solutions

### **Issue 1: "Module not found" errors**
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Issue 2: "API_BASE_URL not defined"**
**Solution:**
1. Check environment variables in Vercel dashboard
2. Ensure `VITE_API_BASE_URL` is set correctly
3. Redeploy after adding environment variables

### **Issue 3: "CORS errors"**
**Solution:**
Update your backend CORS settings:
```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Issue 4: "Build failed"**
**Solution:**
1. Check Node.js version (should be 18+)
2. Update package.json scripts:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

### **Issue 5: "404 on refresh"**
**Solution:**
The `vercel.json` file handles this with rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📋 Deployment Checklist

### **Frontend Checklist:**
- [ ] `vercel.json` file created
- [ ] `vite.config.js` updated with build settings
- [ ] Environment variables set in Vercel
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Root directory: `frontend`

### **Backend Checklist:**
- [ ] Backend deployed to Railway/Render/Vercel
- [ ] MongoDB connection string configured
- [ ] JWT secret key set
- [ ] CORS origins updated with frontend URL
- [ ] Environment variables configured

### **Testing Checklist:**
- [ ] Frontend loads without errors
- [ ] API calls work (check browser network tab)
- [ ] Authentication works
- [ ] Health assessment form works
- [ ] PDF download works

---

## 🔍 Debugging Steps

### **1. Check Vercel Build Logs**
```bash
vercel logs your-deployment-url
```

### **2. Check Browser Console**
- Open browser dev tools
- Look for network errors
- Check if API calls are reaching the backend

### **3. Test API Endpoints**
```bash
# Test if backend is accessible
curl https://your-backend-url.vercel.app/health

# Test with authentication
curl -H "Authorization: Bearer your-token" https://your-backend-url.vercel.app/auth/me
```

### **4. Environment Variables Debug**
Add this to your frontend to debug:
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

---

## 🚀 Quick Fix Commands

```bash
# Frontend deployment
cd frontend
npm run build
vercel --prod

# Backend deployment (Railway)
cd backend
railway login
railway link
railway up

# Backend deployment (Render)
# Use Render dashboard with GitHub integration
```

---

## 📞 Support

If you're still having issues:

1. **Check Vercel Build Logs**: Look for specific error messages
2. **Test Locally**: Run `npm run build` locally to catch build errors
3. **Environment Variables**: Double-check all environment variables are set
4. **Backend Status**: Ensure your backend is deployed and accessible
5. **CORS Settings**: Verify CORS is configured for your frontend domain

**Common Error Messages:**
- `Module not found`: Missing dependencies
- `API_BASE_URL not defined`: Environment variable not set
- `CORS error`: Backend CORS not configured
- `404 on refresh`: Missing vercel.json rewrites
- `Build failed`: Node.js version or dependency issues
