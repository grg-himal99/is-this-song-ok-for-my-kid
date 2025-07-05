<template>
  <div class="age-rating" :class="is18Plus ? 'rating-18-plus' : 'rating-safe'">
    <span class="rating-badge">{{ is18Plus ? '18+' : 'SAFE' }}</span>
    <div>
      <p>{{ is18Plus ? 'This song contains 18+ content' : 'This song appears safe for all ages' }}</p>
      <p v-if="detectedLanguage" class="detected-language">
        Detected language: <span class="language-badge">{{ formattedLanguage }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  is18Plus: {
    type: Boolean,
    required: true
  },
  detectedLanguage: {
    type: String,
    default: null
  }
});

const formattedLanguage = computed(() => {
  if (!props.detectedLanguage) return '';
  return props.detectedLanguage.charAt(0).toUpperCase() + props.detectedLanguage.slice(1);
});
</script>

<style scoped>
.age-rating {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.rating-18-plus {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
}

.rating-safe {
  background-color: #f0fdf4;
  border-left: 4px solid #10b981;
}

.rating-badge {
  font-size: 1.2rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 6px;
  margin-right: 15px;
}

.rating-18-plus .rating-badge {
  background-color: #ef4444;
  color: white;
}

.rating-safe .rating-badge {
  background-color: #10b981;
  color: white;
}

.detected-language {
  font-size: 0.9rem;
  margin-top: 5px;
  color: #4b5563;
}

.language-badge {
  background-color: #e5e7eb;
  color: #1f2937;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
</style>