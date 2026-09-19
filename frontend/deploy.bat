@echo off
echo 🚀 Deploying PreventiX Frontend to Vercel...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the frontend directory
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building project...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed! Check the error messages above.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 📝 Don't forget to set your environment variables in Vercel dashboard:
echo    - VITE_API_BASE_URL=https://your-backend-url.vercel.app
pause
