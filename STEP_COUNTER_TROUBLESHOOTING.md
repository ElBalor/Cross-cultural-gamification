# Step Counter Troubleshooting Guide

## ⚠️ IMPORTANT: Why Steps Aren't Recording

If your step counter is stuck at "Step 1" or not counting, here are the common issues and solutions:

---

## 1. HTTPS Requirement (MOST COMMON ISSUE)

**Problem**: Device motion sensors **ONLY work on HTTPS** (or localhost for development)

**Solution**:
- ✅ **Development**: `http://localhost:3000/step-counter` will work
- ✅ **Production**: MUST deploy to Vercel with HTTPS enabled
- ❌ **HTTP without SSL**: Will NOT work on mobile devices

**Check**: Look for the lock icon 🔒 in your browser address bar

---

## 2. iOS Permission Required

**Problem**: iOS 13+ devices require explicit permission for motion sensors

**Solution**:
1. Click "Start Counting Steps" button
2. When prompted, tap "Allow" or "Grant Permission"
3. If you denied before, go to: Settings → Safari → Motion & Orientation Access → Enable

**Check**: Console should show "iOS device detected - permission required"

---

## 3. Android Permission

**Problem**: Some Android devices need body sensor permission

**Solution**:
1. Go to: Settings → Apps → Your Browser → Permissions
2. Enable "Physical Activity" or "Body Sensors"
3. Restart the browser

---

## 4. Desktop Browsers Don't Support Motion Sensors

**Problem**: Most desktop/laptop computers don't have accelerometers

**Solution**: 
- Use a **mobile device** (iPhone or Android phone)
- Desktop browsers will show "Step counting is not supported on this device"

**Check**: Console should show "Android/Other device detected" or "iOS device detected"

---

## 5. Phone Not Moving Enough

**Problem**: Step detection algorithm requires walking motion

**Solution**:
- Hold phone in your hand OR keep in pocket
- Walk at normal pace (not too slow, not running)
- The algorithm detects peaks between 9.5-12 m/s²

**Debug**: 
- Open browser console (F12 on desktop, Inspect on mobile Safari)
- Look for "Step detected!" messages when walking

---

## 6. Threshold Too High/Low

**Problem**: Default threshold might not match your device sensitivity

**Current Settings**:
```typescript
const stepThreshold = 8; // Lowered from 15
const minAcceleration = 9.5; // Minimum m/s²
const maxAcceleration = 12.0; // Maximum m/s²
```

**To Adjust**: Edit `components/StepCounter.tsx`:
- Lower `stepThreshold` if steps aren't counting (try 6)
- Raise `stepThreshold` if counting false steps (try 10)
- Adjust `minAcceleration` and `maxAcceleration` range

---

## 7. Database Not Saving

**Problem**: Steps show on screen but don't save to database

**Possible Causes**:
1. **Database not initialized** - Run the app once to create tables
2. **No database connection** - Check `.env.local` has `POSTGRES_URL`
3. **Session too short** - Must walk for 30+ seconds before auto-save

**Check Database**:
```sql
-- In Vercel Postgres SQL editor
SELECT * FROM step_activity_logs ORDER BY created_at DESC LIMIT 10;
```

**Solution**:
- Ensure you have `.env.local` with database credentials
- Walk for at least 30 seconds (auto-saves every 30s)
- Check browser console for errors

---

## 8. Testing Steps Work

**Quick Test**:
1. Open browser console (F12 or Inspect)
2. Go to `/step-counter`
3. Click "Start Counting Steps"
4. Grant permission if prompted
5. Walk while holding phone
6. Watch console for: `Step detected! Magnitude: X.XX`

**Expected Console Output**:
```
Checking sensor support...
iOS device detected - permission required
Step detected! Magnitude: 10.23, Time since last: 420ms
Step detected! Magnitude: 10.45, Time since last: 380ms
```

---

## 9. Survey Data Not Saving

**Problem**: Survey submissions not appearing in database

**Check**:
1. Open browser console (F12)
2. Submit survey
3. Look for "Starting survey submission..." message
4. Check for errors

**Database Tables**:
```sql
-- Check survey responses
SELECT id, created_at, section_a->>'country' as country 
FROM survey_responses 
ORDER BY created_at DESC;

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected Tables**:
- `survey_responses`
- `interview_responses`
- `step_activity_logs`
- `session_logs`
- `system_metrics`

---

## 10. Quick Fix Checklist

- [ ] Using mobile device (not desktop)
- [ ] HTTPS enabled (or localhost for dev)
- [ ] Granted motion sensor permission
- [ ] Actually walking with phone
- [ ] Database connection configured in `.env.local`
- [ ] Browser console shows no errors
- [ ] Step counter shows "Active" green indicator
- [ ] Walked for 30+ seconds (for auto-save)

---

## 🔧 Debug Mode

To enable detailed logging, edit `components/StepCounter.tsx`:

```typescript
// Uncomment this line for debug logging:
console.log(`Acceleration: X=${accX.toFixed(2)}, Y=${accY.toFixed(2)}, Z=${accZ.toFixed(2)}, Magnitude=${magnitude.toFixed(2)}`);
```

This will show every acceleration reading in the console to help diagnose issues.

---

## 📱 Best Testing Practice

1. **Deploy to Vercel** (get HTTPS)
2. **Open on iPhone/Android** (not desktop)
3. **Grant permissions** when prompted
4. **Walk normally** for 1-2 minutes
5. **Check admin dashboard** at `/admin` to see saved data

---

## 🎯 Expected Behavior

**When Working Correctly**:
- Steps increment as you walk
- Distance and calories update in real-time
- "✓ Data synced to research database" appears after 30 seconds
- Data appears in `/admin` dashboard
- Exportable via `/api/export?type=steps&format=csv`

**When NOT Working**:
- Stuck at "Step 1" or 0
- Shows "not supported" message
- No "Active" indicator
- Console shows errors
- Data doesn't save after 30+ seconds

---

## 📞 Still Having Issues?

Check these in order:
1. Browser console for errors
2. Network tab for failed API calls
3. Vercel dashboard for deployment errors
4. Database connection in Vercel settings
5. Test on different device/browser

---

**Remember**: The step counter uses **device hardware sensors**. It will NOT work on:
- Desktop computers
- Laptops without accelerometers
- Browsers without HTTPS
- Devices with permissions denied
