# Survey & Step Counter Data Storage - Explained

## ✅ YES - Database Storage IS Implemented!

### 📊 Survey Data Storage

**When someone takes the survey:**

1. **Data is saved to**: Vercel Postgres database
2. **Table name**: `survey_responses`
3. **Automatic processing**: 
   - ML sentiment analysis
   - Text embeddings
   - Cultural keyword extraction

**Database Schema**:
```sql
CREATE TABLE survey_responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  section_a JSONB NOT NULL,      -- Demographics
  section_b JSONB NOT NULL,      -- Gamification features
  section_c JSONB NOT NULL,      -- Cultural context
  section_d JSONB NOT NULL,      -- Motivation & engagement
  embeddings JSONB,               -- ML embeddings
  ml_metadata JSONB               -- Sentiment analysis
);
```

**What gets stored**:
- ✅ Age, gender, country, activity frequency
- ✅ All 8 gamification feature ratings (1-5)
- ✅ Cultural preferences and barriers
- ✅ Motivation scores and adoption likelihood
- ✅ Open-text responses (favorite features, cultural elements)
- ✅ ML-generated sentiment analysis
- ✅ Text embeddings for similarity matching

**How to view data**:
1. **Admin Dashboard**: `/admin` → See all responses
2. **Direct Database**: Vercel Postgres SQL editor
3. **Export**: `/api/export?type=survey&format=csv`

---

### 🚶 Step Counter Data Storage

**When someone uses the step counter:**

1. **Real-time display**: Steps shown on screen immediately
2. **Auto-save**: Every 30 seconds while walking
3. **Final save**: When stopping or closing page
4. **Table name**: `step_activity_logs`

**Database Schema**:
```sql
CREATE TABLE step_activity_logs (
  id SERIAL PRIMARY KEY,
  survey_response_id INTEGER REFERENCES survey_responses(id),
  session_id VARCHAR(255),
  steps INTEGER DEFAULT 0,
  distance_meters DECIMAL(10,2) DEFAULT 0,
  calories_burned DECIMAL(10,2) DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);
```

**What gets stored**:
- ✅ Step count
- ✅ Distance (in meters)
- ✅ Calories burned
- ✅ Duration of activity
- ✅ Session ID for tracking
- ✅ Link to survey respondent (if available)
- ✅ Device metadata

**Auto-save timing**:
- **0-30 seconds**: Steps shown on screen only
- **30+ seconds**: First auto-save to database
- **Every 30s after**: Continuous saves
- **On stop/close**: Final save with total counts

**How to view data**:
1. **Admin Dashboard**: Coming soon (currently via export)
2. **Direct Database**: `SELECT * FROM step_activity_logs;`
3. **Export**: `/api/export?type=steps&format=csv`

---

### 🎤 Interview Data Storage

**When someone completes the interview:**

1. **Table name**: `interview_responses`
2. **Automatic processing**: Sentiment analysis, keyword extraction

**Database Schema**:
```sql
CREATE TABLE interview_responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responses JSONB NOT NULL,      -- All 11 questions
  embeddings JSONB,               -- Text embeddings
  ml_metadata JSONB               -- Sentiment analysis
);
```

**What gets stored**:
- ✅ All 11 interview question responses
- ✅ ML sentiment analysis
- ✅ Cultural keywords detected
- ✅ Text embeddings

---

## 📈 Complete Data Flow

### Survey Flow:
```
User fills form → Submit → ML Processing → Save to DB → Admin Dashboard
```

### Step Counter Flow:
```
User walks → Steps counted → Display on screen → 
  ↓
Every 30s: Save to DB → Continue counting → 
  ↓
User stops: Final save → Data available in admin
```

### Interview Flow:
```
User answers questions → Submit → ML Processing → Save to DB → Admin Dashboard
```

---

## 🔍 How to Verify Data is Being Saved

### Method 1: Admin Dashboard
1. Go to `/admin`
2. Login with credentials
3. Check "Submissions" tab
4. See survey and interview responses

### Method 2: Database Query
```sql
-- Check survey count
SELECT COUNT(*) FROM survey_responses;

-- Check step activity
SELECT COUNT(*), SUM(steps) as total_steps FROM step_activity_logs;

-- Recent activity
SELECT * FROM survey_responses ORDER BY created_at DESC LIMIT 5;
```

### Method 3: API Export
```bash
# Download survey data
curl https://your-app.vercel.app/api/export?type=survey&format=json

# Download step data
curl https://your-app.vercel.app/api/export?type=steps&format=json
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Survey submitted but not showing in admin"

**Possible causes**:
1. Database not initialized
2. Admin dashboard cache
3. Wrong database connection

**Solution**:
```bash
# Check database tables exist
npx vercel postgres query "SELECT table_name FROM information_schema.tables;"

# Check data exists
npx vercel postgres query "SELECT COUNT(*) FROM survey_responses;"
```

### Issue: "Steps not saving to database"

**Possible causes**:
1. Session too short (< 30 seconds)
2. No database connection
3. Browser doesn't support sensors

**Solution**:
- Walk for at least 30-60 seconds
- Check browser console for errors
- Verify HTTPS is enabled
- Check `.env.local` has `POSTGRES_URL`

### Issue: "No data in Chapter 4 report"

**Possible causes**:
1. No survey responses yet
2. Database connection missing
3. Need minimum 3 responses for statistics

**Solution**:
- Collect at least 10-30 survey responses
- Verify database connection in Vercel
- Check admin dashboard shows data first

---

## 📊 Data Available for Chapter 4

### From Survey Responses:
- ✅ Demographic distributions (country, age, gender)
- ✅ Feature importance rankings (mean, SD)
- ✅ Cultural motivation patterns
- ✅ Sentiment analysis results
- ✅ Cronbach's Alpha reliability scores
- ✅ ANOVA test results for cultural differences

### From Step Activity:
- ✅ Total steps per user session
- ✅ Distance walked
- ✅ Calories burned
- ✅ Activity duration
- ✅ Engagement over time

### From Session Logs:
- ✅ Page views and navigation
- ✅ Feature usage frequency
- ✅ Time spent on each section
- ✅ User engagement patterns

---

## 🎯 Summary

| Data Type | Stored in DB? | Auto-Save? | Viewable in Admin? | Exportable? |
|-----------|---------------|------------|-------------------|-------------|
| Survey Responses | ✅ Yes | On submit | ✅ Yes | ✅ CSV/JSON |
| Interview Responses | ✅ Yes | On submit | ✅ Yes | ✅ CSV/JSON |
| Step Activity | ✅ Yes | Every 30s | ⏳ Coming | ✅ CSV/JSON |
| Session Logs | ✅ Yes | Real-time | ⏳ Coming | ✅ CSV/JSON |
| System Metrics | ✅ Yes | On events | ⏳ Coming | ✅ CSV/JSON |

---

## ✅ Bottom Line

**YES, everything is being saved to the database!**

- **Surveys**: Saved immediately on submission ✅
- **Interviews**: Saved immediately on submission ✅
- **Steps**: Saved every 30 seconds + on stop ✅
- **Sessions**: Logged in real-time ✅

**To access your data**:
1. Go to `/admin` for dashboard view
2. Use `/api/export` for raw data
3. Query Vercel Postgres directly for SQL access

---

**Need help?** Check:
- Browser console for errors
- Vercel dashboard for deployment status
- `.env.local` for database credentials
- `STEP_COUNTER_TROUBLESHOOTING.md` for step counter issues
