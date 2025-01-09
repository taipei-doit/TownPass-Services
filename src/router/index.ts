import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FormView from '../views/FormView.vue';
import SurroundingServiceView from '../views/SurroundingServiceView.vue';
import TopQnAListView from '../views/TopQnAListView.vue';
import QnAListView from '../views/QnAListView.vue';
import CounterCallingView from '../views/CounterCallingView.vue';
import CounterCallingDetailView from '../views/CounterCallingDetailView.vue';
import CouponView from '../views/CouponView.vue';
import CouponListView from '../views/CouponListView.vue';
import HotSpotView from '../views/HotSpotView.vue';
import TicketDetail from '../views/TicketDetail.vue';
import CouponDetail from '../views/CouponDetail.vue';
import TicketWallet from '@/views/TicketWallet.vue';
import TicketExchange from '@/views/TicketExchange.vue';
import BuyTicketView from '@/views/BuyTicketView.vue';
import TicketPayment from '@/views/TicketPayment.vue';
import PaymentFinishedView from '@/views/PaymentFinishedView.vue';
import CitizenReportView from '@/views/CitizenReportView.vue';
import CitizenReportListView from '@/views/CitizenReportListView.vue';
import CitizenReportFormView from '@/views/CitizenReportFormView.vue';
import CitizenReportSearchView from '@/views/CitizenReportSearchView.vue';
import CitizenReportSearchDetailView from '@/views/CitizenReportSearchDetailView.vue';
import SubscriptionView from '@/views/SubscriptionView.vue';
import SubscriptionItemListView from '@/views/SubscriptionItemListView.vue';
import SubscriptionItemDetailView from '@/views/SubscriptionItemDetailView.vue';
import DisasterReportView from '@/views/DisasterReportView.vue';
import DisasterReportFormView from '@/views/DisasterReportFormView.vue';
import PoliceReportView from '@/views/PoliceReportView.vue';
import PoliceReportFormView from '@/views/PoliceReportFormView.vue';
import PoliceReportRecordView from '@/views/PoliceReportRecordView.vue';
import PoliceReportRecordDetailView from '@/views/PoliceReportRecordDetailView.vue';
import LibraryServiceView from '@/views/LibraryServiceView.vue';
import LibraryKeywordSearchView from '@/views/LibraryKeywordSearchView.vue';
import LibraryRankingListView from '@/views/LibraryRankingListView.vue';
import LibraryBookDetailView from '@/views/LibraryBookDetailView.vue';
import LibraryNoticeListView from '@/views/LibraryNoticeListView.vue';
import LibraryNoticeDetailView from '@/views/LibraryNoticeDetailView.vue';
import FeePaymentOthersView from '@/views/FeePaymentOthersView.vue';
import FeePaymentSearchView from '@/views/FeePaymentSearchView.vue';
import FeePaymentDetailView from '@/views/FeePaymentDetailView.vue';
import FeePaymentResultView from '@/views/FeePaymentResultView.vue';
import FeePaymentHistoryView from '@/views/FeePaymentHistoryView.vue';
import FeePaymentHistoryDetailView from '@/views/FeePaymentHistoryDetailView.vue';
import FeePaymentScanView from '@/views/FeePaymentScanView.vue';
import FeePaymentStepView from '@/views/FeePaymentStepView.vue';
import FeePaymentFinishedView from '@/views/FeePaymentFinishedView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: '申辦服務'
      },
      component: HomeView
    },
    {
      path: '/form/:id',
      name: 'form',
      meta: {
        title: '申辦服務'
      },
      component: FormView
    },
    {
      path: '/surrounding-service',
      name: 'surrounding-service',
      meta: {
        title: '周邊服務'
      },
      component: SurroundingServiceView
    },
    {
      path: '/qna',
      name: 'top-qna-list',
      meta: {
        title: '功能教學 • 城市通'
      },
      component: TopQnAListView
    },
    {
      path: '/qna/categories',
      name: 'qna-list',
      meta: {
        title: '常見問題 • 城市通'
      },
      component: QnAListView
    },
    {
      path: '/coupon',
      meta: {
        title: '優惠'
      },
      children: [
        {
          path: '',
          name: 'coupon',
          component: CouponView
        },
        {
          path: 'list',
          name: 'coupon-list',
          component: CouponListView
        },
        {
          path: 'hotspot/:id',
          name: 'hotspot',
          component: HotSpotView
        },
        {
          path: 'ticket-detail/:id',
          name: 'ticket-detail',
          component: TicketDetail
        },
        {
          path: 'coupon-detail/:id',
          name: 'coupon-detail',
          component: CouponDetail
        },
        {
          path: 'buy-ticket/:id',
          name: 'buy-ticket',
          component: BuyTicketView
        },
        {
          path: 'ticket-payment',
          name: 'ticket-payment',
          component: TicketPayment
        },
        {
          path: 'payment-finished',
          name: 'payment-finished',
          component: PaymentFinishedView
        }
      ]
    },
    {
      path: '/ticket-wallet',
      meta: {
        title: '票夾'
      },
      children: [
        {
          path: '',
          name: 'ticket-wallet',
          component: TicketWallet
        },
        {
          path: 'exchange/:id',
          name: 'ticket-exchange',
          component: TicketExchange
        }
      ]
    },
    {
      path: '/counter-calling',
      meta: {
        title: '臨櫃叫號'
      },
      children: [
        {
          path: '',
          name: 'counter-calling',
          component: CounterCallingView
        },
        {
          path: ':id',
          name: 'counter-calling-detail',
          component: CounterCallingDetailView
        }
      ]
    },
    {
      path: '/citizen-report',
      meta: {
        title: '有話要說'
      },
      children: [
        {
          path: '',
          name: 'citizen-report',
          component: CitizenReportView
        },
        {
          path: 'list',
          name: 'citizen-report-list',
          component: CitizenReportListView
        },
        {
          path: 'form/:id',
          name: 'citizen-report-form',
          component: CitizenReportFormView
        },
        {
          path: 'search',
          name: 'citizen-report-search',
          component: CitizenReportSearchView
        },
        {
          path: 'search-detail/:id',
          name: 'citizen-report-search-detail',
          component: CitizenReportSearchDetailView
        }
      ]
    },
    {
      path: '/subscription',
      meta: {
        title: '訂閱'
      },
      children: [
        {
          path: '',
          name: 'subscription',
          component: SubscriptionView
        },
        {
          path: 'item-list',
          name: 'item-list',
          component: SubscriptionItemListView
        },
        {
          path: 'item-detail/:id',
          name: 'item-detail',
          component: SubscriptionItemDetailView
        }
      ]
    },
    {
      path: '/disaster-report',
      meta: {
        title: '災情通報'
      },
      children: [
        {
          path: '',
          name: 'disaster-report',
          component: DisasterReportView
        },
        {
          path: 'form/:id',
          name: 'disaster-report-form',
          component: DisasterReportFormView
        }
      ]
    },
    {
      path: '/police-report',
      meta: {
        title: '警政報案'
      },
      children: [
        {
          path: '',
          name: 'police-report',
          component: PoliceReportView
        },
        {
          path: 'form',
          name: 'police-report-form',
          component: PoliceReportFormView
        },
        {
          path: 'record',
          name: 'police-report-record',
          component: PoliceReportRecordView
        },
        {
          path: 'record/:id',
          name: 'police-report-record-detail',
          component: PoliceReportRecordDetailView
        }
      ]
    },
    {
      path: '/library-service',
      children: [
        {
          path: '',
          name: 'library-service',
          component: LibraryServiceView,
          meta: {
            title: '圖書借閱'
          }
        },
        {
          path: 'keyword-search',
          name: 'library-keyword-search',
          component: LibraryKeywordSearchView,
          meta: {
            title: '關鍵字搜尋'
          }
        },
        {
          path: 'ranking-list',
          name: 'library-ranking-list',
          component: LibraryRankingListView,
          meta: {
            title: '點閱排行'
          }
        },
        {
          path: 'book-detail/:id',
          name: 'library-book-detail',
          component: LibraryBookDetailView,
          meta: {
            title: '詳細內容'
          }
        },
        {
          path: 'notice-list',
          name: 'library-notice-list',
          component: LibraryNoticeListView,
          meta: {
            title: '重要訊息'
          }
        },
        {
          path: 'notice-detail/:id',
          name: 'library-notice-detail',
          component: LibraryNoticeDetailView,
          meta: {
            title: '重要訊息'
          }
        }
      ]
    },
    {
      path: '/fee-payment',
      name: 'fee-payment',
      children: [
        {
          path: 'others',
          name: 'fee-payment-others',
          component: FeePaymentOthersView,
          meta: {
            title: '其他'
          }
        },
        {
          path: 'detail/:id',
          name: 'fee-payment-detail',
          component: FeePaymentDetailView,
          meta: {
            title: '繳費項目'
          }
        },
        {
          path: 'result/:id',
          name: 'fee-payment-result',
          component: FeePaymentResultView,
          meta: {
            title: '繳費項目'
          }
        },
        {
          path: 'payment/:id/:bill_id',
          name: 'payment',
          component: FeePaymentStepView
        },
        {
          path: 'fee-payment-finished/:id',
          name: 'fee-payment-finished',
          component: FeePaymentFinishedView
        },
        {
          path: 'search',
          name: 'fee-payment-search',
          component: FeePaymentSearchView,
          meta: {
            title: '搜尋繳費項目'
          }
        },
        {
          path: 'history',
          name: 'fee-payment-history',
          component: FeePaymentHistoryView,
          meta: {
            title: '帳務紀錄'
          }
        },
        {
          path: 'history/:id',
          name: 'fee-payment-history-detail',
          component: FeePaymentHistoryDetailView,
          meta: {
            title: '帳單明細'
          }
        },
        {
          path: 'scan',
          name: 'fee-payment-scan',
          component: FeePaymentScanView,
          meta: {
            title: '掃描'
          }
        }
      ]
    }
  ]
});

// 導航守衛，用來動態修改標題
router.beforeEach((to, from, next) => {
  const defaultTitle = '城市通'; // 預設標題
  document.title = (to.meta.title as string) || defaultTitle;
  next();
});

export default router;
