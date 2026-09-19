# Vercel Deployment Troubleshooting

## 🚨 Common Vercel Errors & Solutions

### **Error 1: "Module not found" or "Cannot resolve module"**

**Cause:** Missing dependencies or incorrect import paths

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Error 2: "Build failed" or "Command failed"**

**Cause:** Node.js version mismatch or build script issues

**Solution:**
1. Check your `package.json` scripts:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

2. Set Node.js version in Vercel:
   - Go to Project Settings → General
   - Set Node.js version to 18.x or 20.x

### **Error 3: "API_BASE_URL not defined" or CORS errors**

**Cause:** Missing environment variables or backend not deployed

**Solution:**
1. **Set Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.vercel.app`

2. **Deploy your backend first:**
   - Deploy backend to Railway/Render/Vercel
   - Get the backend URL
   - Update the environment variable

### **Error 4: "404 on page refresh" or "Page not found"**

**Cause:** Missing SPA routing configuration

**Solution:**
The `vercel.json` file I created handles this:
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

### **Error 5: "Build timeout" or "Function timeout"**

**Cause:** Large bundle size or slow build process

**Solution:**
1. **Optimize bundle size:**
   ```bash
   npm run build
   # Check the dist folder size
   ```

2. **Update Vite config** (already done):
   ```javascript
   // vite.config.js
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             router: ['react-router-dom'],
             ui: ['lucide-react', 'react-hot-toast']
           }
         }
       }
     }
   })
   ```

---

## 🔧 Step-by-Step Fix

### **Step 1: Check Your Current Setup**

1. **Verify you're in the frontend directory:**
   ```bash
   cd frontend
   ls package.json  # Should exist
   ```

2. **Check if build works locally:**
   ```bash
   npm run build
   ```

### **Step 2: Fix Common Issues**

1. **Update package.json** (if needed):
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "lint": "eslint .",
       "preview": "vite preview"
     }
   }
   ```

2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

### **Step 3: Deploy with Correct Settings**

1. **Deploy from frontend directory:**
   ```bash
   cd frontend
   vercel
   ```

2. **When prompted:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name: **preventix-frontend**
   - Directory: **./**
   - Override settings? **No**

### **Step 4: Configure Environment Variables**

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Add Environment Variables:**
   - Go to Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.vercel.app`

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## 🚀 Quick Deployment Commands

### **Option 1: Using Vercel CLI**
```bash
cd frontend
npm install
npm run build
vercel --prod
```

### **Option 2: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`

### **Option 3: Using the Batch File (Windows)**
```bash
cd frontend
deploy.bat
```

---

## 🔍 Debug Your Deployment

### **Check Build Logs:**
```bash
vercel logs your-deployment-url
```

### **Test Locally:**
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

### **Check Environment Variables:**
Add this to your React app temporarily:
```javascript
console.log('Environment:', import.meta.env);
```

---

## 📋 Pre-Deployment Checklist

- [ ] `vercel.json` file exists in frontend directory
- [ ] `vite.config.js` is properly configured
- [ ] `package.json` has correct build script
- [ ] Backend is deployed and accessible
- [ ] Environment variables are set
- [ ] Build works locally (`npm run build`)

---

## 🆘 Still Having Issues?

### **Check These Files:**
1. **frontend/vercel.json** - Should exist
2. **frontend/vite.config.js** - Should have build config
3. **frontend/package.json** - Should have build script
4. **frontend/.env** - Should have VITE_API_BASE_URL

### **Common Solutions:**
1. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update Vercel CLI:**
   ```bash
   npm i -g vercel@latest
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Should be 18+
   ```

4. **Redeploy with force:**
   ```bash
   vercel --prod --force
   ```

### **Get Help:**
- Check Vercel build logs for specific errors
- Test build locally first
- Ensure all dependencies are installed
- Verify environment variables are set
