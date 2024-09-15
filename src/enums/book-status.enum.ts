export const enum BookStatusEnum {
  /** 可借 */
  Available = '0',
  /** 借閱中 */
  Borrowed = '1',
  /** 已預約(排序中) */
  Reserved = '2',
  /** 處理中 */
  Processing = '3',
  /** 預約未取 */
  NotPicked = '4',
  /** 可取書 */
  AvailableForPickup = '5',
  /** 已還書 */
  Returned = '6'
}
