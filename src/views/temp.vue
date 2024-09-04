<template>
    <div class="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <h1 class="text-3xl font-bold p-4 text-tiffany-blue bg-white">Chat with AI</h1>
        <div class="flex-grow overflow-y-auto p-4 space-y-4" ref="chatContainer">
            <div v-for="message in chatHistory" :key="message.id" class="p-3 rounded-lg"
                :class="message.isUser ? 'bg-tiffany-blue text-white' : 'bg-gray-100'">
                <p class="font-semibold">{{ message.isUser ? 'You' : 'AI' }}:</p>
                <div v-if="message.isUser" class="mt-1">{{ message.content }}</div>
                <div v-else v-html="renderMarkdown(message.content)" class="mt-1 prose prose-sm max-w-none"></div>
            </div>
        </div>
        <div class="p-4 bg-white border-t border-gray-200">
            <div class="flex items-center">
                <input v-model="userInput" @keyup.enter="sendMessage" :disabled="loading"
                    class="flex-grow p-2 border border-tiffany-blue rounded-l-lg focus:outline-none focus:ring-2 focus:ring-tiffany-blue"
                    placeholder="Type a message and press Enter" />
                <button @click="sendMessage" :disabled="loading"
                    class="bg-tiffany-blue text-white px-4 py-2 rounded-r-lg hover:bg-tiffany-blue-dark transition-colors">
                    Send
                </button>
            </div>
            <p v-if="loading" class="mt-2 text-gray-600">Waiting for response...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';
import { getNearestRentableStation, getNearestReturnableStation, YouBikeData } from './youbike';
import { getNearestMetroStation, MetroData } from './metro'
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const userInput = ref('');
const chatHistory = ref<Array<{ id: number; isUser: boolean; content: string }>>([]);
const loading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

async function findRentableStation(): Promise<YouBikeData | null> {
    try {
        const nearestStation: YouBikeData | null = await getNearestRentableStation();
        return nearestStation;
    } catch (error) {
        console.error("Error finding nearest rentable station:", error);
        return null;
    }
}

const getRentableStationFunctionDeclaration = {
    name: "findRentableStation",
    description: "Get the nearest YouBike station's data where there are available bikes to rent",
    parameters: {
        type: "object",
        properties: {
            dummy: {
                type: "string",
                description: "This parameter is not used but is required by the API."
            }
        },
    },
};

async function findReturnableStation(): Promise<YouBikeData | null> {
    try {
        const nearestStation: YouBikeData | null = await getNearestReturnableStation();
        return nearestStation;
    } catch (error) {
        console.error("Error finding nearest returnable station:", error);
        return null;
    }
}

const getReturnableStationFunctionDeclaration = {
    name: "findReturnableStation",
    description: "Get the nearest YouBike station's data where there are available vacancies to return the bikes",
    parameters: {
        type: "object",
        properties: {
            dummy: {
                type: "string",
                description: "This parameter is not used but is required by the API."
            }
        },
    },
};


async function findNearestMetroStation(): Promise<MetroData | null> {
    try {
        const nearestStation: MetroData | null = await getNearestMetroStation();
        return nearestStation
    } catch (error) {
        console.error("Error finding nearest metro station:", error);
        return null;
    }
}

const getNearestMetroFunctionDeclaration = {
    name: "findNearestMetroStation",
    description: "Get the nearest Metro station's data",
    parameters: {
        type: "object",
        properties: {
            dummy: {
                type: "string",
                description: "This parameter is not used but is required by the API."
            }
        },
    },
};



const functions = {
    findRentableStation,
    findReturnableStation,
    findNearestMetroStation
};

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const chat = model.startChat({
    tools: [{
        functionDeclarations: [
            getRentableStationFunctionDeclaration,
            getReturnableStationFunctionDeclaration,
            getNearestMetroFunctionDeclaration
        ]
    }],
});

const renderMarkdown = (text: string) => {
    return marked(text);
};

const sendMessage = async () => {
    if (userInput.value.trim() === '') return;

    loading.value = true;

    chatHistory.value.push({ id: Date.now(), isUser: true, content: userInput.value });

    try {
        const prompt = userInput.value;
        const result = await chat.sendMessage(prompt);
        const aiResponse = result.response;
        const text = aiResponse.text();
        const functionCalls = aiResponse.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
            for (const call of functionCalls) {
                if (call.name in functions) {
                    const stationData = await functions[call.name as keyof typeof functions]();
                    console.log(stationData)
                    const followUpResult = await chat.sendMessage(JSON.stringify(stationData));
                    console.log(followUpResult.response.text())
                    chatHistory.value.push({ id: Date.now(), isUser: false, content: followUpResult.response.text() });
                }
            }
        } else {
            chatHistory.value.push({ id: Date.now(), isUser: false, content: text });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        chatHistory.value.push({ id: Date.now(), isUser: false, content: 'Sorry, an error occurred. Please try again.' });
    } finally {
        userInput.value = '';
        loading.value = false;
        await nextTick();
        scrollToBottom();
    }
};

const scrollToBottom = () => {
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

onMounted(() => {
    scrollToBottom();
});
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