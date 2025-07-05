<template>
  <div v-if="message" class="error-message">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: null
  }
});
</script>

<style scoped>
.error-message {
  color: #ef4444;
  margin: 20px 0;
  padding: 10px;
  background-color: #fee2e2;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
  text-align: left;
}
</style>