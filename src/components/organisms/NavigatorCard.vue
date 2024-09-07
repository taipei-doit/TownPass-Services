<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { computed } from 'vue';
const props = defineProps<{
    parkName: string;
    remainingSpace: number;
    price: string;
    distance: number;
    address: string;
    show: boolean;
    display: "navigator_park" | "navigator_yellow_line" | "park_already" | "park_timer";
}>();
const emit = defineEmits(['button-go', 'button-back']);
const isNavigatorPark = computed(() => props.display === 'navigator_park');
const isNavigatorYellowLine = computed(() => props.display === 'navigator_yellow_line');
const isParkAlready = computed(() => props.display === 'park_already');
const isParkTimer = computed(() => props.display === 'park_timer');
</script>
<template>
    <div class="goto-card flex flex-col absolute bottom-0 bg-white rounded-lg p-4 mb-8" :class="{show: props.show}">
        <div v-if="isNavigatorPark" class="container">
            <h2 class="text-2xl w-full">{{ props.parkName }}({{ props.remainingSpace }})</h2>
            <div>
                {{ props.price }}<br />
                {{ props.distance }}公尺
            </div>
            <div class="button-set">
                <BaseButton class="button-go" @click="$emit('button-go')">過去</BaseButton>
                <BaseButton outline class="button-back" @click="$emit('button-back')">返回</BaseButton>
            </div>
        </div>
        <!-- 黃線停車 -->
        <div v-else-if="isNavigatorYellowLine" class="container">
            <h2 class="text-2xl w-full">黃線停車</h2>
            <div>
                {{ props.address }}<br />
                {{ props.distance }}公尺
            </div>
            <div class="button-set">
                <BaseButton class="button button-go" @click="$emit('button-go')">過去</BaseButton>
                <BaseButton outline class="button button-back" @click="$emit('button-back')">返回</BaseButton>
            </div>
        </div>
    </div>
</template>
<style lang="postcss">
.goto-card
{
    @apply flex;
    @apply flex-col;
    width: calc(100% - 32px);
    margin-left: 16px;
    margin-right: 16px;
    left: 100%;
    transition: left 0.5s;
}
.goto-card.show
{
    left: 0;
}
.container
{
    @apply flex;
    @apply flex-col;
}
.button-set
{
    @apply flex;
    @apply justify-center;
    @apply w-full;
}
.button-set .button
{
    @apply mx-2;
    @apply flex-1;
    max-width: 200px;
}
</style>