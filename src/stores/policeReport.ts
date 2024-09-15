import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface PoliceRecordData {
  id: string;
  title: string;
  type: string;
  status: string;
  time_of_acceptance: string;
  date_of_occurrence: string;
  time_of_occurrence: string;
  location_of_occurrence: string;
  content: string;
  reply?: {
    from: string;
    time: string;
    status: string;
  };
}

export const usePoliceReportStore = defineStore('policeReport', () => {
  const policeRecord = ref<PoliceRecordData[]>();

  const policeRecordMap = computed(
    () => new Map(policeRecord.value?.map((item) => [item.id, item]))
  );

  return { policeRecord, policeRecordMap };
});
