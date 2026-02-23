# 📱 STEP COUNTER - QUICK START GUIDE

## 🚀 DEPLOY (Required for HTTPS)

```bash
vercel --prod
```

Share this link with testers: `https://your-app.vercel.app/step-counter`

---

## 📲 FOR iPHONE USERS

Send them this:

```
📱 STEP COUNTER SETUP:

1. Open this link on your iPhone (NOT desktop!)
   [YOUR_LINK_HERE]

2. Click "Grant Permission & Start"

3. Tap "Allow" when popup appears

4. Start walking with phone in your hand

5. Watch steps increase!

⚠️ If denied permission:
   Settings → Safari → Motion & Orientation → Enable
   Then close Safari completely and try again
```

---

## 🤖 FOR ANDROID USERS

Send them this:

```
🤖 STEP COUNTER SETUP:

1. Open this link on your Android phone
   [YOUR_LINK_HERE]

2. Click "Start Counting"

3. Start walking with phone in your hand

4. Watch steps increase!

✅ No permission needed on most Android devices!
```

---

## ✅ WHAT WORKING LOOKS LIKE

**Screen should show:**
- Device: 📱 iPhone/iPad (or 🤖 Android)
- Sensors: ✓ Supported
- Status: 🚶 Walking... Keep moving!
- Steps: Increasing as you walk
- Debug: Shows "✓ STEP!" messages

---

## ❌ WHAT NOT WORKING LOOKS LIKE

**Screen shows:**
- Device: 💻 Desktop/Laptop
- Sensors: ✗ Not Supported
- Error: "Device does not support motion sensors"

**Fix**: Use a smartphone, not desktop!

---

## 🔍 QUICK TEST

1. Open on your phone
2. Click "Start Counting"
3. Walk 10-20 steps
4. Check if counter increases
5. Walk 30+ seconds for database save

---

## 📊 CHECK DATA SAVED

1. Go to: `/admin`
2. Or export: `/api/export?type=steps&format=csv`
3. Or database: `SELECT * FROM step_activity_logs;`

---

## ⚠️ COMMON ISSUES

| Issue | Fix |
|-------|-----|
| Desktop users | Must use smartphone |
| Permission denied (iOS) | Settings → Safari → Motion & Orientation |
| Not counting steps | Actually walk, don't just shake phone |
| No HTTPS | Deploy to Vercel for HTTPS |
| Not saving | Walk 30+ seconds for auto-save |

---

## 🎯 MINIMUM REQUIREMENTS

- ✅ Smartphone or tablet (iPhone, Android, iPad)
- ✅ HTTPS connection (Vercel deployment)
- ✅ iOS: Permission granted
- ✅ Actually walking with phone

---

**That's it! Share the link and start collecting step data!** 🚀
