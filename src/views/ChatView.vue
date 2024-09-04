<template>
    <div class="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <header class="flex justify-between items-center bg-white p-4">
            <h1 class="text-3xl font-bold text-tiffany-blue">人工智慧助理</h1>
            <router-link to="/settings" class="text-[#71b2c2] hover:text-tiffany-blue">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </router-link>
        </header>
        <div class="flex-grow overflow-y-auto p-4 space-y-4" ref="chatContainer">
            <div v-for="message in chatHistory" :key="message.id" class="p-3 rounded-lg"
                :class="message.isUser ? 'bg-tiffany-blue text-white' : 'bg-gray-100'">
                <p class="font-semibold">{{ message.isUser ? '你' : '人工智慧助理' }}:</p>
                <div v-if="message.isUser" class="mt-1">{{ message.content }}</div>
                <div v-else v-html="renderMarkdown(message.content)" class="mt-1 prose prose-sm max-w-none"></div>
            </div>
        </div>
        <div class="p-4 bg-white border-t border-gray-200">
            <div class="flex items-center">
                <input v-model="userInput" @keyup.enter="sendMessage" :disabled="loading"
                    class="flex-grow h-10 px-4 border border-tiffany-blue rounded-l-lg focus:outline-none focus:ring-2 focus:ring-tiffany-blue"
                    placeholder="輸入你的問題" />
                <button @click="sendMessage" :disabled="loading"
                    class="bg-tiffany-blue text-white h-10 px-3 py-2 rounded-r-lg hover:bg-tiffany-blue-dark transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform rotate-90" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
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
import { getNearestRentableStation, getNearestReturnableStation, YouBikeDataWithDistance} from './youbike';
import { getNearestMetroStation, MetroDataWithDistance } from './metro';
import { getDistance } from './distance'
// import { googleSearch } from './search';
let userLatitude: number | null = null;
let userLongitude: number | null = null;

function initGeolocation(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLatitude = position.coords.latitude;
                    userLongitude = position.coords.longitude;
                    resolve();
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const userInput = ref('');
const chatHistory = ref<Array<{ id: number; isUser: boolean; content: string }>>([]);
const loading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

async function findRentableStation(): Promise<YouBikeDataWithDistance | null> {
    try {
        return await getNearestRentableStation();
    } catch (error) {
        console.error("Error finding nearest rentable station:", error);
        return null;
    }
}

async function findReturnableStation(): Promise<YouBikeDataWithDistance | null> {
    try {
        return await getNearestReturnableStation();
    } catch (error) {
        console.error("Error finding nearest returnable station:", error);
        return null;
    }
}

async function findNearestMetroStation(): Promise<MetroDataWithDistance> {
    try {
        return await getNearestMetroStation();
    } catch (error) {
        console.error("Error finding nearest metro station:", error);
        return null;
    }
}

async function findDistance(lat1: number, lon1: number): Promise<any | null> {
    try {
        initGeolocation()
        return await getDistance(lat1, lon1, userLatitude, userLongitude);
    } catch (error) {
        console.error("Error finding nearest metro station:", error);
        return null;
    }
}

// async function searchGoogle(query: string): Promise<any | null> {
//     try {
//         return await googleSearch(query);
//     } catch (error) {
//         console.error("Error searching Google:", error);
//         return null;
//     }
// }
const functionDeclarations = [
    {
        name: "findRentableStation",
        description: "Get the nearest YouBike station's data where there are available bikes to rent, including the distance from the user.",
        parameters: {
            type: "object", properties: {
                dummy: {
                    type: "string",
                    description: "This parameter is not used but is required by the API."
                }
            } 
        }
    },
    {
        name: "findReturnableStation",
        description: "Get the nearest YouBike station's data where there are available vacancies to return the bikes, including the distance from the user.",
        parameters: {
            type: "object", properties: {
                dummy: {
                    type: "string",
                    description: "This parameter is not used but is required by the API."
                }
            }
        }
    },
    {
        name: "findNearestMetroStation",
        description: "Get the nearest Metro station's data, including the distance from the user.",
        parameters: {
            type: "object", properties: {
                query: {
                    type: "string",
                    description: "This parameter is not used but is required by the API."
                }
            }
        }
    },
    // {
    //     name: "findDistance",
    //     description: "This tool can retrieve the distance between a location and the user.",
    //     parameters: {
    //         type: "object", properties: {
    //             lat1: {
    //                 type: "number",
    //                 description: "This parameter is the latitude of the location"
    //             },
    //             lon1: {
    //                 type: "number",
    //                 description: "This parameter is the longitude of the location"
    //             }
    //         }
    //     }
    // },
    // {
    //     name: "searchGoogle",
    //     description: "Tool to obtain real-time data and real-time data only",
    //     parameters: {
    //         type: "object",
    //         properties: {
    //             query: {
    //                 type: "string",
    //                 description: "The search query you want to use"
    //             }
    //         },
    //         required: ["query"]
    //     }
    // }
];

const functions = {
    findRentableStation,
    findReturnableStation,
    findNearestMetroStation,
    // findDistance
    // searchGoogle
};

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", systemInstruction: "You are a smart assistant, you use tools when you can use them but you also answer questions on your own when tools are not available" });
const chat = model.startChat({ tools: [{ functionDeclarations }] });

const renderMarkdown = (text: string) => {
    return marked(text);
};

const sendMessage = async () => {
    if (userInput.value.trim() === '') return;

    loading.value = true;
    chatHistory.value.push({ id: Date.now(), isUser: true, content: userInput.value });

    try {
        const result = await chat.sendMessage(userInput.value);
        const aiResponse = result.response;
        const text = aiResponse.text();
        const functionCalls = aiResponse.functionCalls();
        console.log(text)
        console.log(functionCalls)
        if (functionCalls && functionCalls.length > 0) {
            const functionResults = await Promise.all(functionCalls.map(async (call) => {
                if (call.name in functions) {
                    console.log(call.name)
                    if (call.name === 'searchGoogle') {
                        const query = call.args['query'];
                        if (query) {
                            const data = await functions[call.name](query);
                            return { name: call.name, data };
                        }
                    } else {
                        const data = await functions[call.name as keyof typeof functions]();
                        return { name: call.name, data };
                    }
                }
                return null;
            }));

            const validResults = functionResults.filter((result): result is { name: string; data: any } => result !== null);

            if (validResults.length > 0) {
                const followUpResult = await chat.sendMessage(JSON.stringify(validResults));
                chatHistory.value.push({ id: Date.now(), isUser: false, content: followUpResult.response.text() });
            } else {
                // console.log("no tools used")
                chatHistory.value.push({ id: Date.now(), isUser: false, content: text });
            }
        } else {
            console.log("no tools used")
            
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