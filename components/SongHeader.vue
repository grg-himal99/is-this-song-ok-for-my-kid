<template>
  <div class="song-info">
    <div class="song-header">
      <div>
        <h2>{{ songInfo.title }}</h2>
        <p v-if="songInfo.artist"><strong>Artist:</strong> {{ songInfo.artist }}</p>
      </div>
      <img v-if="songInfo.thumbnailUrl" :src="songInfo.thumbnailUrl" alt="Song thumbnail" class="thumbnail" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  songInfo: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.song-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.song-info h2 {
  margin: 0 0 10px 0;
  color: #1e40af;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

@media (max-width: 640px) {
  .song-header {
    flex-direction: column;
    text-align: center;
  }
  
  .thumbnail {
    margin-top: 15px;
  }
}
</style>