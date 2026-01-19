export interface EmbeddingVector {
  values: number[];
  dimension: number;
}

export interface EncodedResponse {
  textEmbeddings: {
    favoriteFeatures?: EmbeddingVector;
    culturalElements?: EmbeddingVector;
    culturalMotivation?: EmbeddingVector;
    interviewResponses?: Record<string, EmbeddingVector>;
  };
  responseVector: EmbeddingVector;
  metadata: {
    sentiment?: {
      score: number;
      label: "positive" | "neutral" | "negative";
    };
    culturalKeywords?: string[];
  };
}

class MLEncoder {
  private get apiKey(): string | null {
    // Read env var lazily to ensure Next.js has loaded it
    const envKey = process.env.HUGGINGFACE_API_KEY;
    if (envKey && envKey.trim().length > 0) {
      return envKey.trim();
    }
    return null;
  }

  private get useLocalModel(): boolean {
    // Read env var lazily to ensure Next.js has loaded it
    return process.env.USE_LOCAL_ML_MODEL === "true";
  }

  async encodeText(text: string): Promise<EmbeddingVector> {
    if (!text || text.trim().length === 0) {
      return { values: new Array(384).fill(0), dimension: 384 };
    }

    if (this.useLocalModel) {
      return this.encodeWithLocalModel(text);
    }

    const key = this.apiKey;
    if (key) {
      return this.encodeWithHuggingFace(text, key);
    }

    return this.encodeWithFallback(text);
  }

  private async encodeWithHuggingFace(
    text: string,
    apiKey: string
  ): Promise<EmbeddingVector> {
    // Use working Hugging Face Router API endpoint with BAAI/bge-small-en-v1.5 model
    // This model works with router API and returns 384-dimensional embeddings
    const workingEndpoint = `https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      let response = await fetch(workingEndpoint, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 503 (model loading) - wait and retry
      if (response.status === 503) {
        console.log("Model is loading, waiting 2 seconds and retrying...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        const retryController = new AbortController();
        const retryTimeoutId = setTimeout(() => retryController.abort(), 5000);
        
        response = await fetch(workingEndpoint, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
          signal: retryController.signal,
        });
        clearTimeout(retryTimeoutId);
      }

      // If still fails, try fallback
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(
          `HuggingFace API error (${response.status}): ${errorText.substring(
            0,
            150
          )}`
        );
        console.warn("Falling back to basic encoding.");
        return this.encodeWithFallback(text);
      }

      const data = await response.json();

      // Handle different response formats
      let embedding: number[];
      if (Array.isArray(data)) {
        // If it's an array, check if first element is also an array
        embedding = Array.isArray(data[0]) ? data[0] : data;
      } else if (data && typeof data === "object" && "embeddings" in data) {
        embedding = data.embeddings;
      } else if (Array.isArray(data[0])) {
        embedding = data[0];
      } else {
        embedding = data as number[];
      }

      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error(
          `Invalid embedding format from HuggingFace API: ${JSON.stringify(
            data
          ).substring(0, 100)}`
        );
      }

      return {
        values: embedding,
        dimension: embedding.length,
      };
    } catch (error: any) {
      console.error("HuggingFace encoding error:", error);
      // Only fall back if it's not a critical error
      if (error.message && error.message.includes("Invalid")) {
        throw error; // Re-throw invalid format errors
      }
      return this.encodeWithFallback(text);
    }
  }

  private async encodeWithLocalModel(text: string): Promise<EmbeddingVector> {
    // Since we're using Hugging Face API, this path is rarely used
    // If you need local model, install @xenova/transformers first
    console.warn(
      "Local model not available - falling back to basic encoding. Install @xenova/transformers to use local model."
    );
    return this.encodeWithFallback(text);

    // Uncomment below if you install @xenova/transformers and want to use local model
    /*
    try {
      const transformers = await import("@xenova/transformers").catch(() => null);
      if (!transformers) {
        throw new Error("@xenova/transformers not available");
      }

      const { pipeline } = transformers;
      const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
      const output = await extractor(text, {
        pooling: "mean",
        normalize: true,
      });

      return {
        values: Array.from(output.data),
        dimension: output.data.length,
      };
    } catch (error) {
      console.error("Local model encoding error:", error);
      return this.encodeWithFallback(text);
    }
    */
  }

  private encodeWithFallback(text: string): EmbeddingVector {
    const words = text.toLowerCase().split(/\s+/);
    const dimension = 384;
    const embedding = new Array(dimension).fill(0);

    words.forEach((word, idx) => {
      const hash = this.simpleHash(word);
      const position = hash % dimension;
      embedding[position] += 1 / (idx + 1);
    });

    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );
    const normalized =
      magnitude > 0 ? embedding.map((val) => val / magnitude) : embedding;

    return {
      values: normalized,
      dimension,
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  async encodeSurveyResponse(surveyData: {
    sectionA: any;
    sectionB: any;
    sectionC: any;
    sectionD: any;
  }): Promise<EncodedResponse> {
    const textFields: string[] = [];

    if (surveyData.sectionB.favoriteFeatures) {
      textFields.push(surveyData.sectionB.favoriteFeatures);
    }
    if (surveyData.sectionC.culturalElements) {
      textFields.push(surveyData.sectionC.culturalElements);
    }
    if (surveyData.sectionC.otherBarriers) {
      textFields.push(surveyData.sectionC.otherBarriers);
    }

    const combinedText = textFields.join(" ");

    const [
      favoriteFeaturesEmbedding,
      culturalElementsEmbedding,
      responseVector,
    ] = await Promise.all([
      surveyData.sectionB.favoriteFeatures
        ? this.encodeText(surveyData.sectionB.favoriteFeatures)
        : null,
      surveyData.sectionC.culturalElements
        ? this.encodeText(surveyData.sectionC.culturalElements)
        : null,
      this.encodeCompleteResponse(surveyData),
    ]);

    const sentiment = this.analyzeSentiment(combinedText);
    const culturalKeywords = this.extractCulturalKeywords(combinedText);

    return {
      textEmbeddings: {
        favoriteFeatures: favoriteFeaturesEmbedding || undefined,
        culturalElements: culturalElementsEmbedding || undefined,
      },
      responseVector,
      metadata: {
        sentiment,
        culturalKeywords,
      },
    };
  }

  async encodeInterviewResponse(
    interviewData: Record<string, string>
  ): Promise<EncodedResponse> {
    const interviewEmbeddings: Record<string, EmbeddingVector> = {};
    const allTexts: string[] = [];

    for (const [key, value] of Object.entries(interviewData)) {
      if (value && value.trim().length > 0) {
        const embedding = await this.encodeText(value);
        interviewEmbeddings[key] = embedding;
        allTexts.push(value);
      }
    }

    const combinedText = allTexts.join(" ");
    const responseVector = await this.encodeText(combinedText);
    const sentiment = this.analyzeSentiment(combinedText);
    const culturalKeywords = this.extractCulturalKeywords(combinedText);

    return {
      textEmbeddings: {
        interviewResponses: interviewEmbeddings,
      },
      responseVector,
      metadata: {
        sentiment,
        culturalKeywords,
      },
    };
  }

  private async encodeCompleteResponse(
    surveyData: any
  ): Promise<EmbeddingVector> {
    const features = [
      surveyData.sectionA.age,
      surveyData.sectionA.gender,
      surveyData.sectionA.country,
      surveyData.sectionA.activityFrequency,
      surveyData.sectionB.pointsRewards,
      surveyData.sectionB.leaderboards,
      surveyData.sectionB.progressTracking,
      surveyData.sectionB.achievements,
      surveyData.sectionB.personalizedChallenges,
      surveyData.sectionB.socialSharing,
      surveyData.sectionB.dailyStreaks,
      surveyData.sectionB.unlockableContent,
      surveyData.sectionC.culturalMotivation,
      surveyData.sectionD.consistency,
      surveyData.sectionD.enjoyment,
      surveyData.sectionD.visualProgress,
      surveyData.sectionD.competition,
      surveyData.sectionD.likelihood,
    ]
      .filter(Boolean)
      .join(" ");

    return this.encodeText(features);
  }

  private analyzeSentiment(text: string): {
    score: number;
    label: "positive" | "neutral" | "negative";
  } {
    const positiveWords = [
      "love",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "motivated",
      "enjoy",
      "helpful",
      "good",
      "best",
    ];
    const negativeWords = [
      "hate",
      "bad",
      "terrible",
      "awful",
      "difficult",
      "hard",
      "problem",
      "issue",
      "barrier",
      "stop",
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) negativeCount++;
    });

    const score =
      (positiveCount - negativeCount) / Math.max(text.split(/\s+/).length, 1);

    if (score > 0.1) return { score, label: "positive" };
    if (score < -0.1) return { score, label: "negative" };
    return { score, label: "neutral" };
  }

  private extractCulturalKeywords(text: string): string[] {
    const culturalTerms = [
      "nigerian",
      "nigeria",
      "african",
      "culture",
      "cultural",
      "local",
      "traditional",
      "language",
      "music",
      "theme",
      "challenge",
      "yoruba",
      "igbo",
      "hausa",
      "naija",
      "nollywood",
      "afrobeats",
      "jollof",
      "local",
      "indigenous",
    ];

    const lowerText = text.toLowerCase();
    const found = culturalTerms.filter((term) => lowerText.includes(term));

    return [...new Set(found)];
  }

  calculateSimilarity(
    embedding1: EmbeddingVector,
    embedding2: EmbeddingVector
  ): number {
    if (embedding1.dimension !== embedding2.dimension) {
      throw new Error("Embeddings must have the same dimension");
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.dimension; i++) {
      dotProduct += embedding1.values[i] * embedding2.values[i];
      norm1 += embedding1.values[i] * embedding1.values[i];
      norm2 += embedding2.values[i] * embedding2.values[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  async clusterResponses(
    embeddings: EmbeddingVector[],
    k: number = 3
  ): Promise<number[]> {
    if (embeddings.length === 0) return [];
    if (embeddings.length <= k) return embeddings.map((_, i) => i);

    const centroids = this.initializeCentroids(embeddings, k);
    let clusters = new Array(embeddings.length).fill(0);
    let changed = true;
    let iterations = 0;
    const maxIterations = 100;

    while (changed && iterations < maxIterations) {
      changed = false;
      const newClusters = new Array(embeddings.length);

      embeddings.forEach((embedding, idx) => {
        let minDist = Infinity;
        let closestCentroid = 0;

        centroids.forEach((centroid, cIdx) => {
          const dist = this.euclideanDistance(embedding, centroid);
          if (dist < minDist) {
            minDist = dist;
            closestCentroid = cIdx;
          }
        });

        newClusters[idx] = closestCentroid;
        if (newClusters[idx] !== clusters[idx]) {
          changed = true;
        }
      });

      clusters = newClusters;

      centroids.forEach((centroid, cIdx) => {
        const clusterPoints = embeddings.filter(
          (_, idx) => clusters[idx] === cIdx
        );
        if (clusterPoints.length > 0) {
          const newCentroid = this.calculateCentroid(clusterPoints);
          centroids[cIdx] = newCentroid;
        }
      });

      iterations++;
    }

    return clusters;
  }

  private initializeCentroids(
    embeddings: EmbeddingVector[],
    k: number
  ): EmbeddingVector[] {
    const centroids: EmbeddingVector[] = [];
    const dimension = embeddings[0].dimension;

    for (let i = 0; i < k; i++) {
      const randomIdx = Math.floor(Math.random() * embeddings.length);
      centroids.push({
        values: [...embeddings[randomIdx].values],
        dimension,
      });
    }

    return centroids;
  }

  private calculateCentroid(embeddings: EmbeddingVector[]): EmbeddingVector {
    const dimension = embeddings[0].dimension;
    const centroid = new Array(dimension).fill(0);

    embeddings.forEach((embedding) => {
      embedding.values.forEach((val, idx) => {
        centroid[idx] += val;
      });
    });

    return {
      values: centroid.map((val) => val / embeddings.length),
      dimension,
    };
  }

  private euclideanDistance(e1: EmbeddingVector, e2: EmbeddingVector): number {
    let sum = 0;
    for (let i = 0; i < e1.dimension; i++) {
      const diff = e1.values[i] - e2.values[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }
}

export const mlEncoder = new MLEncoder();
