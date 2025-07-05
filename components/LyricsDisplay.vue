<template>
  <div class="lyrics-section">
    <h3>Lyrics</h3>
    <pre class="lyrics">{{ lyrics }}</pre>
  </div>
</template>

<script setup>
defineProps({
  lyrics: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.lyrics-section {
  margin-top: 30px;
}

.lyrics-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #1e40af;
}

.lyrics {
  white-space: pre-wrap;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>