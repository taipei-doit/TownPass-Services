import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface CitizenReportData {
  hot_report: {
    id: string;
    name: string;
    icon: string;
  }[];
  all_report: {
    id: string;
    name: string;
    icon: string;
    service_requesting: {
      id: string;
      name: string;
    }[];
    problem_reporting: {
      id: string;
      name: string;
    }[];
  }[];
}

export interface CitizenResultData {
  citizen: {
    id: string;
    title: string;
    date: string;
    status: string;
  }[];
  disaster: never[];
}

export const useCitizenReportStore = defineStore('citizenReport', () => {
  const citizenReport = ref<CitizenReportData>();
  const citizenResult = ref<CitizenResultData>();

  const concatData = computed(() => {
    if (!citizenReport.value) {
      return [];
    }

    const problemReporting = citizenReport.value.all_report
      .map((item) => item.problem_reporting)
      .flat();

    const serviceRequesting = citizenReport.value.all_report
      .map((item) => item.service_requesting)
      .flat();

    const concatData = [...problemReporting, ...serviceRequesting];

    return concatData;
  });

  const reportItemMap = computed(() => {
    if (!citizenReport.value || !citizenReport.value.all_report) {
      return new Map([]);
    } else {
      return new Map(concatData.value.map((item) => [item.id, item]));
    }
  });

  return { citizenReport, citizenResult, reportItemMap, concatData };
});
