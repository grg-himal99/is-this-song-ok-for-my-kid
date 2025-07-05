<template>
  <div class="warning-category">
    <h4>{{ title }}</h4>
    <div class="found-words">
      <span v-for="(word, index) in words" :key="category + '-' + index" class="word-tag">
        {{ word }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  words: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.warning-category {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.warning-category h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #ef4444;
  font-size: 1rem;
}

.found-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.word-tag {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>