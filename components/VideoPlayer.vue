<template>
  <div class="video-player-card">
    <h3 class="player-title">
      <span class="player-icon">✅</span>
      Safe Content - Ready to Watch!
    </h3>
    <div class="redirect-actions">
      <button @click="redirectToVideo" class="redirect-btn primary">
        <span class="btn-icon">🎬</span>
        Watch on YouTube
      </button>
      <button @click="playHere" class="redirect-btn secondary">
        <span class="btn-icon">▶️</span>
        Play Here
      </button>
    </div>
    
    <div v-if="showPlayer" class="video-container">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="video-iframe"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  videoId: {
    type: String,
    required: true
  }
});

const showPlayer = ref(false);

// Redirect to YouTube video
const redirectToVideo = () => {
  window.open(`https://www.youtube.com/watch?v=${props.videoId}`, '_blank');
};

// Play video in embedded player
const playHere = () => {
  showPlayer.value = true;
};
</script>

<style scoped>
.video-player-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #10b981;
}

.player-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #10b981;
  font-size: 1.3rem;
  margin-bottom: 16px;
  font-weight: 600;
}

.player-icon {
  font-size: 1.5rem;
}

.redirect-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.redirect-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

.secondary {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 2px solid #10b981;
}

.secondary:hover {
  background: #10b981;
  color: white;
}

.btn-icon {
  font-size: 1.1rem;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}
</style>