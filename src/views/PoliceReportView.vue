<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

const router = useRouter();

const isAgree = ref([]);

const onAgreeClick = () => {
  router.push({
    name: 'police-report-form'
  });
};
</script>

<template>
  <div class="pt-6 px-6 pb-36 bg-grey-50">
    <div class="shadow-card bg-white p-6 rounded relative">
      <img
        src="@/assets/images/police-report-icon.svg"
        class="absolute top-0 left-0"
        width="80"
        height="80"
      />
      <h1 class="text-[#5AB4C5] font-semibold text-2xl text-center">網路報案</h1>
      <p class="text-grey-700 text-center my-4">使用須知說明</p>
      <p>請詳閱以下須知內容後繼續網路投案程序。</p>
      <p class="flex flex-col my-6">
        <span>網路報案使用須知</span>
        <span>Terms of Use</span>
      </p>
      <ul class="flex flex-col gap-y-6">
        <li>
          <p>
            1.網路報案性質如同110，為報案管道之一種，如有緊急事件，請撥打110，將有專人為您受理。
          </p>
          <p class="mt-1">
            Online Police Report is only for non-emergency incidents that do not require immediate
            police actions.For emergencies, please call 1-1-0.
          </p>
        </li>
        <li>
          <p>
            2.於填寫報案人資料時，請您務必留下正確聯絡資料（本局對報案人身分及資料嚴予保密），否則若無具體事證，本局將不予處理，並提醒您切勿提供不實之事證，以免觸犯刑法『誣告』罪。
          </p>
          <p class="mt-1">
            When filling out personal information of the reporting person,please ensure that the
            contact information is correct(the Department maintains strict confidentiality on
            personal information).The Department will not process the case if there is no concrete
            evidence.Anyone filing a false police report may be prosecuted under malicious
            accusation section of the Criminal Code.
          </p>
        </li>
        <li>
          <p>
            3.110為緊急報案電話，無故撥打110報案專線，經勸阻報聽者，依社會秩序維護法裁處拘留或新臺幣1萬2千元以下罰緩。
          </p>
          <p class="mt-1">
            110 is an emergency hotline. Dialing the hotline 110 without reason, despite the effort
            to dissuade, shall entail detention or a fine of up to NTD12,000 according to the Social
            Order Maintenance Act.
          </p>
        </li>
      </ul>
      <p class="my-6 flex flex-col">
        <span>網路報案使用限制</span>
        <span>Restrictions to Online Police Reporting</span>
      </p>
      <ul class="flex flex-col gap-y-6">
        <li>
          <p>
            1.本局辦理網路報案，回覆時間以5日為基準（例假日順延），緊急事件，並不適合網路報案，仍請撥打110報案，為最快之處理方式，本局將有專人為您即時服務處理。
          </p>
          <p class="mt-1">
            The Department will respond to an online police report within 5 work days (excluding
            weekends and holidays).
          </p>
        </li>
        <li>
          <p>2.網路報案與110電話報案均為報案之管道，若已選擇其中一種管道報案，請勿再重複報案。</p>
          <p class="mt-1">
            Online Police Reporting and the 110 hotline are both ways to submit police reports. If
            you have selected either way to submit a police report, please do not report the case
            again.
          </p>
        </li>
      </ul>
      <p class="my-6 flex flex-col">
        <span>系統送出成功確認</span>
        <span>System sends confirmation</span>
      </p>

      <div>
        <p>
          進入作業系統報案，送出成功後，頁面將顯示出您的報案編號及查詢密碼，若未顯示，則表示送出未成功！您可以再檢視您填入的資料，重報一次;
          或撥打110直接報案。
        </p>
        <p class="mt-1">
          After successfully submitting an online police report, your Case Number and Enquiry
          Password will be displayed on the page. If not, it indicates that the report has not been
          successfully submitted. You may have to review the entered information and resubmit, or
          dial 110 to directly report the case to the police.
        </p>
      </div>

      <p class="my-6 flex flex-col">
        <span>案件分類處理流程</span>
        <span>Process flow for different case types:</span>
      </p>

      <ul class="flex flex-col gap-y-6">
        <li>
          <p>1.竊盜、恐嚇、詐欺、網路遊戲犯罪等刑事案件</p>
          <p class="mt-1">Criminal cases such as theft, threat, fraud, online gaming crime, etc.</p>
          <p class="mt-6">
            依據刑事訴訟法規定，告訴、告發應以書狀或製作筆錄為之，執行上必須確保報案人身分，因此在失竊、恐嚇、詐欺、網路遊戲犯罪或其他刑案案件中，您的報案，尚未完成正式報案程序，於網路報案後仍須請您致派出所製作筆錄，造成您的不便，敬請見諒。如您要報案，歡迎您使用110或逕赴鄰近警察單位舉報製作報案筆錄。
          </p>
          <p class="mt-1">
            Criminal cases such as theft, threatm fraud, online gaming crime, etc. According to
            section 242 of the Code of Criminal Procedure, a criminal complaint or report shall be
            made in writing or verbally to a public prosecutor or judicial police officer. Hence,
            for theft, threat, fraud, online gaming crime and other criminal cases, online police
            reporting is not yet completed in terms of the official reporting procedure. Therefore,
            after receiving your online report, the police will contact you to visit a nearby police
            station to have your statement taken.
          </p>
        </li>
        <li>
          <p>
            2.遺失案件Lost Property
            依據現行法律規定，您的網路報案，尚無法完成正式報案程序，於網路報案後仍須請您至派出所製作相關文件，造成您的不便，敬請見諒。如您要報案，歡迎您使用110或逕赴鄰近警察單位舉報。
          </p>
          <p class="mt-1">
            After receiving your online report, the police will provide guidance via phone or make
            an appointment with you if you need a report certificate.
          </p>
        </li>
        <li>
          <p>3.汽機車（含車牌）失竊、遺失案件</p>
          <p class="mt-1">Motor Vehicle Related Theft or Loss</p>
          <p class="mt-6">
            依據現行法律規定，您的網路報案，尚無法完成正式報案程序，於網路報案後仍須請您至派出所製作相關文件、開具四聯單後，再行輸入電腦協尋，造成您的不便，敬請見諒。如您要報案，歡迎您使用110或逕赴鄰近警察單位舉報。
          </p>
          <p class="mt-1">
            After receiving your online report, the police will contact you to visit a nearby police
            station to review the surveillance footages, make a statement and get a police report
            receipt.
          </p>
        </li>
        <li>
          <p>
            4.檢舉、申訴等案件Complaint本局對報案人身分及資料嚴予保密，並將依據您所提供、舉報內容逕行處理、追查，請您務必留下正確聯絡資料。
          </p>
          <p class="mt-1">
            The Department will start processing the case right after receibig your online report.
          </p>
        </li>
      </ul>
      <p class="my-6 flex flex-col">
        <span>其他縣市網路報案系統</span>
        <span>Online Police Reporting System of Other Counties and Cities</span>
      </p>
      <p class="flex flex-col">
        <span>
          除了本局網路報案系統之外，您可選擇交由居住地最近之縣市警察局受理，除方便您報案後程序的進行，亦可加速案件受理之時效。
        </span>
        <span>
          in addition to the Taipei City Police Department's Online Police Reporting service. You
          may choose a police station nearest to your residence to report a case. It will help speed
          up post-report follow ups and processing of the case
        </span>
      </p>
    </div>
    <div class="fixed bottom-0 left-0 bg-white p-4 w-full shadow-card">
      <BaseCheckbox :option="{ label: '本人已詳閱須知並同意繼續', value: 'Y' }" v-model="isAgree" />
      <BaseButton :disabled="!isAgree.length" @click="onAgreeClick" class="w-full mt-4">
        同意
      </BaseButton>
    </div>
  </div>
</template>
