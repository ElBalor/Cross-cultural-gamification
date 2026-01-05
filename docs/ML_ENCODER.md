# ML Encoder Integration

## Overview

The survey application now includes ML-powered encoding and analysis capabilities to extract deeper insights from survey and interview responses.

## How It Works

### 1. **Text Embeddings**
When users submit survey or interview responses, the system automatically:
- Converts text responses into vector embeddings (384-dimensional vectors)
- Uses semantic understanding to capture meaning, not just keywords
- Stores embeddings in the database for analysis

### 2. **Encoding Methods**

The system supports three encoding methods (in order of preference):

1. **Hugging Face API** (Recommended)
   - Uses `sentence-transformers/all-MiniLM-L6-v2` model
   - Requires `HUGGINGFACE_API_KEY` environment variable
   - High-quality semantic embeddings
   - Free tier available

2. **Local Model** (`@xenova/transformers`)
   - Runs entirely on your server
   - No API calls needed
   - Set `USE_LOCAL_ML_MODEL=true` in environment
   - Slightly slower but more private

3. **Fallback Method**
   - Simple hash-based encoding if APIs unavailable
   - Basic functionality maintained
   - No external dependencies

### 3. **What Gets Encoded**

**Survey Responses:**
- Favorite gamification features (text)
- Cultural elements mentioned
- Complete response vector (all fields combined)

**Interview Responses:**
- Each individual question response
- Combined response vector
- Sentiment analysis
- Cultural keyword extraction

### 4. **Analysis Capabilities**

#### Clustering
- Groups similar responses together
- Identifies user segments based on preferences
- Helps understand different user personas

#### Feature Importance
- Analyzes which gamification features are most valued
- Calculates average importance scores
- Ranks features by user preference

#### Cultural Pattern Detection
- Extracts cultural keywords (Nigerian, African, local, etc.)
- Tracks cultural motivation levels
- Analyzes country distribution

#### Sentiment Analysis
- Determines positive/neutral/negative sentiment
- Calculates sentiment scores
- Helps understand user motivation levels

## API Endpoints

### `/api/analysis?type=overview`
Returns overall statistics:
- Total responses
- Average sentiment
- Cultural mentions count

### `/api/analysis?type=clusters`
Performs K-means clustering on responses:
- Groups users into clusters
- Analyzes cluster characteristics
- Identifies user segments

### `/api/analysis?type=features`
Analyzes gamification feature importance:
- Average importance scores
- Most/least important features
- Feature rankings

### `/api/analysis?type=cultural`
Cultural pattern analysis:
- Cultural keywords frequency
- Country distribution
- Cultural motivation statistics

### `/api/analysis?type=sentiment`
Sentiment analysis:
- Sentiment distribution
- Average sentiment score
- Total analyzed responses

## Setup

### 1. Environment Variables

Add to `.env.local`:

```env
# Optional: Hugging Face API (recommended)
HUGGINGFACE_API_KEY=your_api_key_here

# Optional: Use local model instead
USE_LOCAL_ML_MODEL=false
```

### 2. Get Hugging Face API Key (Optional but Recommended)

1. Go to https://huggingface.co/
2. Create an account
3. Go to Settings → Access Tokens
4. Create a new token
5. Add to `.env.local`

### 3. Database Migration

The database schema has been updated to include:
- `embeddings` JSONB column (stores vector embeddings)
- `ml_metadata` JSONB column (stores sentiment, keywords, etc.)

Run the updated SQL script in `scripts/init-db.sql` or let it auto-create on first use.

## Benefits for Research

### 1. **Semantic Understanding**
- Finds similar responses even with different wording
- Understands context and meaning, not just keywords

### 2. **Pattern Discovery**
- Automatically identifies user segments
- Discovers hidden patterns in responses
- Cultural adaptation insights

### 3. **Feature Prioritization**
- Data-driven feature importance
- Understands which gamification elements matter most
- Helps with Objective (i) - identifying key features

### 4. **Cultural Insights**
- Tracks cultural mentions automatically
- Analyzes cultural motivation levels
- Supports Objective (ii) - Nigerian context adaptation

### 5. **Engagement Analysis**
- Sentiment analysis of motivation
- Clustering by engagement levels
- Supports Objective (iv) - evaluating impact

## Example Usage

```typescript
// Automatically happens on form submission
const encoded = await mlEncoder.encodeSurveyResponse(surveyData)

// Find similar responses
const similar = await findSimilarResponses(encoded.responseVector.values)

// Analyze clusters
const clusters = await mlEncoder.clusterResponses(embeddings, k=3)

// Calculate similarity
const similarity = mlEncoder.calculateSimilarity(embedding1, embedding2)
```

## Performance Considerations

- Embeddings are generated asynchronously during form submission
- Cached in database for fast retrieval
- Analysis endpoints can be called on-demand
- Clustering runs server-side (may take a few seconds for large datasets)

## Future Enhancements

- Real-time similarity search
- Predictive modeling for engagement
- Automated report generation
- Visualization dashboard
- Multi-language support

