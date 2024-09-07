<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
const props = defineProps<{
    parkName: string;
    remainingSpace: number;
    price: string;
    distance: number;
    address: string;
}>();
</script>
<template>
    <div class="goto-card flex flex-col absolute bottom-0 bg-white rounded-lg p-4 mb-8">
        <h2 class="text-2xl w-full">{{ props.parkName }}({{ props.remainingSpace }})</h2>
        <div>
            {{ props.price }}<br />
            {{ props.distance }}公尺
        </div>
        <div class="flex justify-center w-full">
            <BaseButton class="button-go" @click="$emit('button-go')">過去</BaseButton>
            <BaseButton outline class="button-back" @click="$emit('button-back')">返回</BaseButton>
        </div>
    </div>
</template>
<style lang="postcss">
.goto-card
{
    width: calc(100% - 32px);
    margin-left: 16px;
    margin-right: 16px;
}
.button-go
{
    @apply mr-2;
    width: 200px;
}
.button-back
{
    @apply ml-2;
    width: 200px;
}
</style>