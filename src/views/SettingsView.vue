<template>
    <div class="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <h1 class="text-3xl font-bold p-4 text-tiffany-blue bg-white">Settings</h1>
        <div class="p-4 bg-white border-t border-gray-200">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="apiKey">
                Google API Key
            </label>
            <input v-model="apiKey" id="apiKey" type="text"
                class="w-full p-2 border border-tiffany-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-tiffany-blue"
                placeholder="Enter your API key" />
            <button @click="saveApiKey"
                class="mt-4 bg-tiffany-blue text-white px-4 py-2 rounded-lg hover:bg-tiffany-blue-dark transition-colors">
                Save API Key
            </button>
            <p v-if="saving" class="mt-2 text-gray-600">Saving...</p>
            <p v-if="saveStatus" class="mt-2" :class="{ 'text-green-600': !saveError, 'text-red-600': saveError }">
                {{ saveStatus }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const apiKey = ref('');
const saving = ref(false);
const saveStatus = ref('');
const saveError = ref(false);

async function saveApiKey() {
    saving.value = true;
    saveStatus.value = '';
    saveError.value = false;

    try {
        const response = await fetch('http://localhost:3000/api/save-env', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ GOOGLE_API_KEY: apiKey.value }),
        });

        if (!response.ok) {
            throw new Error('Failed to save API key');
        }

        saveStatus.value = 'API key saved successfully to .env file!';
    } catch (error) {
        console.error('Error saving API key:', error);
        saveStatus.value = 'Failed to save API key. Please try again.';
        saveError.value = true;
    } finally {
        saving.value = false;
    }
}
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

:root {
    --tiffany-blue: #71b2c2;
    --tiffany-blue-dark: #0abab5;
}

.bg-tiffany-blue {
    background-color: var(--tiffany-blue);
}

.text-tiffany-blue {
    color: var(--tiffany-blue);
}

.border-tiffany-blue {
    border-color: var(--tiffany-blue);
}

.hover\:bg-tiffany-blue-dark:hover {
    background-color: var(--tiffany-blue-dark);
}

.focus\:ring-tiffany-blue:focus {
    --tw-ring-color: var(--tiffany-blue);
}
</style>