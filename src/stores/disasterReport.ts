import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface disasterReportData {
  id: string;
  name: string;
  icon: string;
  options: {
    id: string;
    name: string;
    form_format?: Record<string, any>[];
  }[];
}

export const useDisasterReportStore = defineStore('disasterReport', () => {
  const disasterReport = ref<disasterReportData[]>();

  const disasterReportFlat = computed(() => {
    if (!disasterReport.value) {
      return [];
    }

    const flatData = disasterReport.value.reduce<
      { id: string; name: string; form_format?: Record<string, any>[] }[]
    >((acc, current) => {
      return [...acc, ...current.options];
    }, []);

    return flatData;
  });

  const disasterReportMap = computed(
    () => new Map(disasterReportFlat.value.map((item) => [item.id, item]))
  );

  return { disasterReport, disasterReportMap };
});
