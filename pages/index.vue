<template>
  <div class="app-container">
    <!-- Background Elements -->
    <div class="bg-decoration">
      <div class="floating-notes">
        <div class="note note-1">♪</div>
        <div class="note note-2">♫</div>
        <div class="note note-3">♪</div>
        <div class="note note-4">♫</div>
        <div class="note note-5">♪</div>
      </div>
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="logo-container">
          <div class="logo-icon">🎵</div>
          <h1 class="main-title">
            <span class="title-gradient">Is This Song</span>
            <span class="title-accent">OK For My Kid?</span>
          </h1>
        </div>
        <p class="subtitle">
          <span class="subtitle-icon">🔍</span>
          Analyze YouTube songs for 18+ content in multiple languages
        </p>
      </div>

      <!-- Input Section -->
      <div class="input-section">
        <div class="input-container">
          <div class="input-wrapper">
            <div class="input-icon">🎬</div>
            <input 
              v-model="inputUrl" 
              type="text" 
              placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)" 
              class="url-input"
              @keyup.enter="handleCheck"
            />
          </div>
          <button @click="handleCheck" class="check-button" :disabled="isLoading">
            <span v-if="!isLoading" class="button-content">
              <span class="button-icon">✨</span>
              Check Song
            </span>
            <span v-else class="button-loading">
              <div class="spinner"></div>
              Analyzing...
            </span>
          </button>
        </div>
      </div>

      <!-- Loading Section -->
      <div v-if="isLoading" class="loading-section">
        <div class="loading-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring delay-1"></div>
          <div class="pulse-ring delay-2"></div>
          <div class="loading-icon">🎵</div>
        </div>
        <p class="loading-text">Analyzing song lyrics...</p>
      </div>

      <!-- Error Section -->
      <div v-if="error" class="error-section">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- Results Section -->
      <div v-if="result" class="results-section">
        <!-- Song Info Card -->
        <div v-if="result.songInfo" class="song-card">
          <div class="song-header">
            <img v-if="result.songInfo.thumbnailUrl" :src="result.songInfo.thumbnailUrl" alt="Song thumbnail" class="song-thumbnail" />
            <div class="song-details">
              <h2 class="song-title">{{ result.songInfo.title }}</h2>
              <p v-if="result.songInfo.artist" class="song-artist">
                <span class="artist-icon">👤</span>
                {{ result.songInfo.artist }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Analysis Results -->
        <div v-if="result.lyrics" class="analysis-section">
          <!-- Age Rating Card -->
          <div class="rating-card" :class="result.is18Plus ? 'rating-adult' : 'rating-safe'">
            <div class="rating-badge">
              <span class="rating-icon">{{ result.is18Plus ? '🔞' : '✅' }}</span>
              <span class="rating-text">{{ result.is18Plus ? '18+' : 'SAFE' }}</span>
            </div>
            <div class="rating-info">
              <p class="rating-description">
                {{ result.is18Plus ? 'This song contains adult content' : 'This song appears safe for all ages' }}
              </p>
              <p v-if="result.detectedLanguage" class="detected-language">
                <span class="language-icon">🌍</span>
                Language: <span class="language-name">{{ result.detectedLanguage.charAt(0).toUpperCase() + result.detectedLanguage.slice(1) }}</span>
              </p>
            </div>
          </div>
          
          <!-- Content Warnings -->
          <div v-if="result.is18Plus" class="warnings-section">
            <h3 class="warnings-title">
              <span class="warnings-icon">⚠️</span>
              Content Warnings
            </h3>
            <div class="warnings-grid">
              <div v-if="result.hasExplicitContent" class="warning-card explicit">
                <div class="warning-header">
                  <span class="warning-icon">🤬</span>
                  <h4>Explicit Language</h4>
                </div>
                <div class="warning-words">
                  <span v-for="(word, index) in result.foundExplicitWords" :key="'explicit-'+index" class="word-tag">
                    {{ word }}
                  </span>
                </div>
              </div>
              
              <div v-if="result.hasSexualContent" class="warning-card sexual">
                <div class="warning-header">
                  <span class="warning-icon">🔞</span>
                  <h4>Sexual Content</h4>
                </div>
                <div class="warning-words">
                  <span v-for="(word, index) in result.foundSexualWords" :key="'sexual-'+index" class="word-tag">
                    {{ word }}
                  </span>
                </div>
              </div>
              
              <div v-if="result.hasViolentThemes" class="warning-card violent">
                <div class="warning-header">
                  <span class="warning-icon">⚔️</span>
                  <h4>Violent Content</h4>
                </div>
                <div class="warning-words">
                  <span v-for="(word, index) in result.foundViolentWords" :key="'violent-'+index" class="word-tag">
                    {{ word }}
                  </span>
                </div>
              </div>
              
              <div v-if="result.hasDrugReferences" class="warning-card drugs">
                <div class="warning-header">
                  <span class="warning-icon">🚬</span>
                  <h4>Drug/Alcohol References</h4>
                </div>
                <div class="warning-words">
                  <span v-for="(word, index) in result.foundDrugWords" :key="'drug-'+index" class="word-tag">
                    {{ word }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Lyrics Display -->
          <div class="lyrics-card">
            <h3 class="lyrics-title">
              <span class="lyrics-icon">📝</span>
              Song Lyrics
            </h3>
            <div class="lyrics-content">
              <pre class="lyrics-text">{{ result.lyrics }}</pre>
            </div>
          </div>
        </div>
        
        <!-- No Lyrics Found -->
        <div v-if="result.lyricsNotFound" class="no-lyrics-card">
          <div class="no-lyrics-icon">😔</div>
          <h3 class="no-lyrics-title">Lyrics Not Found</h3>
          <p class="no-lyrics-description">We couldn't find lyrics for this song automatically.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useYouTubeService } from '~/composables/useYouTubeService';
import { useLyricsAnalyzer } from '~/composables/useLyricsAnalyzer';

const inputUrl = ref('');
const isLoading = ref(false);
const result = ref(null);
const error = ref(null);

const { extractVideoId, getSongInfo, getLyrics } = useYouTubeService();
const { analyzeLyrics } = useLyricsAnalyzer();

const handleCheck = async () => {
  if (!inputUrl.value.trim()) {
    error.value = 'Please enter a YouTube URL';
    return;
  }
  
  error.value = null;
  isLoading.value = true;
  result.value = null;
  
  try {
    const videoId = extractVideoId(inputUrl.value);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL. Please enter a valid YouTube video URL.');
    }
    
    const songInfo = await getSongInfo(videoId);
    
    if (!songInfo.title) {
      throw new Error('Could not extract song information from this video.');
    }
    
    const lyrics = await getLyrics(songInfo.title, songInfo.artist);
    
    if (!lyrics) {
      result.value = {
        songInfo,
        lyrics: null,
        lyricsNotFound: true
      };
      return;
    }
    
    const analysis = analyzeLyrics(lyrics);
    
    result.value = {
      songInfo,
      lyrics,
      ...analysis
    };
  } catch (err) {
    console.error('Error:', err);
    error.value = err.message || 'An error occurred while processing your request.';
    result.value = null;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-notes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.note {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.note-1 { top: 10%; left: 10%; animation-delay: 0s; }
.note-2 { top: 20%; right: 15%; animation-delay: 1s; }
.note-3 { top: 60%; left: 5%; animation-delay: 2s; }
.note-4 { bottom: 20%; right: 10%; animation-delay: 3s; }
.note-5 { bottom: 10%; left: 20%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: pulse 4s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #48dbfb, #0abde3);
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ff9ff3, #f368e0);
  top: 50%;
  left: 50%;
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.main-content {
  position: relative;
  z-index: 1;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 4rem;
  margin-bottom: 10px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.title-gradient {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-accent {
  color: white;
  display: block;
  margin-top: 5px;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.subtitle-icon {
  font-size: 1.5rem;
}

.input-section {
  margin-bottom: 40px;
}

.input-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-wrapper {
  position: relative;
  margin-bottom: 15px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  z-index: 2;
}

.url-input {
  width: 100%;
  padding: 15px 15px 15px 50px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.url-input:focus {
  outline: none;
  border-color: #feca57;
  box-shadow: 0 0 20px rgba(254, 202, 87, 0.3);
}

.check-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.check-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
}

.check-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content, .button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.button-icon {
  font-size: 1.2rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-section {
  text-align: center;
  padding: 40px;
}

.loading-animation {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.pulse-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

.delay-1 { animation-delay: 0.5s; }
.delay-2 { animation-delay: 1s; }

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.loading-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.loading-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
}

.error-section {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.error-message {
  color: #fecaca;
  font-weight: 500;
  margin: 0;
}

.results-section {
  space-y: 20px;
}

.song-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.song-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.song-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.song-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.song-artist {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.artist-icon {
  font-size: 1rem;
}

.rating-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.rating-adult {
  border-left: 4px solid #ef4444;
}

.rating-safe {
  border-left: 4px solid #10b981;
}

.rating-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rating-icon {
  font-size: 3rem;
}

.rating-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
}

.rating-description {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.detected-language {
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-name {
  font-weight: 600;
  color: #4f46e5;
}

.warnings-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.warnings-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ef4444;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.warnings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.warning-card {
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid;
}

.explicit { 
  background: #fef2f2; 
  border-left-color: #dc2626; 
}

.sexual { 
  background: #fdf2f8; 
  border-left-color: #be185d; 
}

.violent { 
  background: #fff7ed; 
  border-left-color: #ea580c; 
}

.drugs { 
  background: #f0f9ff; 
  border-left-color: #0284c7; 
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.warning-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.warning-words {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.word-tag {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.lyrics-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.lyrics-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1f2937;
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.lyrics-content {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.lyrics-text {
  white-space: pre-wrap;
  font-family: 'Georgia', serif;
  line-height: 1.6;
  color: #374151;
  margin: 0;
}

.no-lyrics-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.no-lyrics-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.no-lyrics-title {
  color: #374151;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.no-lyrics-description {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }
  
  .song-header {
    flex-direction: column;
    text-align: center;
  }
  
  .rating-card {
    flex-direction: column;
    text-align: center;
  }
  
  .warnings-grid {
    grid-template-columns: 1fr;
  }
}
</style>