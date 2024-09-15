import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Counter } from '@/views/CounterCallingView.vue';
import counterListJson from '../../public/mock/counter_list.json';

export const useCounterStore = defineStore('counter', () => {
  /** 所有列表 */
  const counterList = ref<Counter[]>(counterListJson.data);

  /** 常用列表 */
  const regularlyUsedList = computed(() => {
    return counterList.value.flatMap((counter: Counter) => {
      // Filter the inner list where is_regularly_used is true
      return counter.list?.filter((item) => item.is_regularly_used) || [];
    });
  });

  return {
    counterList,
    regularlyUsedList
  };
});
