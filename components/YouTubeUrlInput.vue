<template>
  <div>
    <div class="input-group">
      <input 
        v-model="inputUrl" 
        type="text" 
        placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)" 
        class="url-input"
        @keyup.enter="emitCheck"
      />
      <button @click="emitCheck" class="check-button" :disabled="isLoading">
        {{ isLoading ? 'Checking...' : 'Check' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['check']);

const inputUrl = ref('');

const emitCheck = () => {
  if (inputUrl.value.trim()) {
    emit('check', inputUrl.value);
  } else {
    alert('Please enter a YouTube URL');
  }
};

// Reset input when loading is done
watch(() => props.isLoading, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    // Reset after successful check
    // Uncomment if you want to clear the input after checking
    // inputUrl.value = '';
  }
});
</script>

<style scoped>
.input-group {
  display: flex;
  margin-bottom: 24px;
  gap: 10px;
}

.url-input {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.url-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.check-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.check-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.check-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .input-group {
    flex-direction: column;
  }
  
  .check-button {
    width: 100%;
    padding: 14px;
    margin-top: 10px;
  }
}
</style>