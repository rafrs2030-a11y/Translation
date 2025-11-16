# Netlify Deployment Fix

## Problem
The Netlify build was failing with the error:
```
ERROR: Could not resolve "../config/supabase"
```

This occurred because `server/routes/auth.js` was trying to import from a non-existent config file.

## Solution

### 1. Created Centralized Supabase Configuration
Created `server/config/supabase.js` to provide a single source of truth for Supabase client initialization:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = { supabase };
```

### 2. Updated Middleware
Updated `server/middleware/auth.js` to use the centralized configuration instead of creating its own client.

## Required Environment Variables in Netlify

You must configure these environment variables in your Netlify dashboard:

### Navigate to: Site Configuration → Environment Variables

1. **SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Your Supabase service role key (not the anon key!)
   - Find it in: Supabase Dashboard → Project Settings → API → service_role key

3. **NODE_ENV** (optional)
   - Value: `production`

4. **APP_URL**
   - Your Netlify app URL
   - Format: `https://your-site-name.netlify.app`

5. **ALLOWED_ORIGINS** (optional)
   - Comma-separated list of allowed CORS origins
   - Example: `https://your-site-name.netlify.app`

## Deployment Steps

1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Fix Netlify deployment - Add centralized Supabase config"
   git push origin main
   ```

2. **Set Environment Variables in Netlify:**
   - Go to your Netlify dashboard
   - Navigate to: Site settings → Environment variables
   - Add the required variables listed above

3. **Trigger a new deployment:**
   - Netlify will automatically deploy when you push to main
   - Or manually trigger a redeploy from the Netlify dashboard

## Files Changed

- ✅ **Created:** `server/config/supabase.js` - Centralized Supabase configuration
- ✅ **Updated:** `server/middleware/auth.js` - Now imports from config
- ✅ **No changes needed:** `server/routes/auth.js` - Already had correct import path

## Verification

After deployment, verify the API is working:
```bash
curl https://your-site-name.netlify.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-16T11:15:00.000Z",
  "uptime": 12.345,
  "environment": "production"
}
```

## Additional Notes

- The Express app is properly wrapped with `serverless-http` in `netlify/functions/api.js`
- All routes are configured to work through the API function
- Rate limiting is using in-memory storage (consider Redis for production)
- File uploads will need to use Supabase Storage (already configured)

## Troubleshooting

If you still encounter errors:

1. **Check Netlify Build Logs:**
   - Look for any missing dependencies
   - Verify environment variables are set

2. **Verify Supabase Credentials:**
   - Test connection in Supabase dashboard
   - Ensure service_role key is used (not anon key)

3. **Check Function Logs:**
   - Navigate to: Netlify Dashboard → Functions → api
   - Check real-time logs for runtime errors

4. **Clear Build Cache:**
   - Netlify Dashboard → Deploys → Deploy settings → Clear build cache
   - Trigger a new deployment

