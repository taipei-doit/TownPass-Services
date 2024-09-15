/**
 * Typescript Support
 * @see https://github.com/willmcpo/body-scroll-lock/issues/19#issuecomment-394142303
 */

declare module 'body-scroll-lock' {
  export interface BodyScrollOptions {
    reserveScrollBarGap: boolean;
  }

  export function disableBodyScroll(targetElement: HTMLElement, options?: BodyScrollOptions): void;

  export function enableBodyScroll(targetElement: HTMLElement): void;

  export function clearAllBodyScrollLocks(): void;
}
