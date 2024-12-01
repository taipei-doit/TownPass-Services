# 貢獻

## 目錄

- [貢獻](#貢獻)
  - [目錄](#目錄)
  - [如何幫助專案](#如何幫助專案)
  - [貢獻指南](#貢獻指南)
  - [開始開發](#開始開發)
  - [程式碼風格](#程式碼風格)
    - [Lint the Code](#lint-the-code)

## 如何幫助專案

作為開源專案，我們非常歡迎與感謝任何的建議與修改來讓專案更好。

當您決定要為此專案貢獻時，代表您同意遵守我們的[行為守則](./CODE_OF_CONDUCT.md)。

若您想做出貢獻，但發現時間不夠或自身經驗稍嫌不足時，請不要猶豫提出[新的 issue](https://github.com/taipei-doit/TownPass-Services/issues/new) 讓我們知道。

## 貢獻指南

微服務是由各種多樣化功能組成的網站，當新功能與舊功能相似或是重疊時，PR 是有可能被拒絕的，或者我們會要求將程式碼搬移到更適合它的地方。

請遵守以下主要的貢獻規範，以維持專案基本的一致性：

- 遵守程式碼風格：

  - [Lint the code](#lint-the-code)。

- 不隨意修改套件版本。

## 開始開發

1. 安裝 [Node.js 18 或更高版本 (推薦 LTS)](https://nodejs.org/en/download/)

2. Fork 專案，並 clone 它

```bash [pnpm]
# 安裝套件
pnpm install

# Run dev: http://localhost:5173/
pnpm dev
```

## 程式碼風格

### Lint the Code

專案遵守 [ESLint](https://eslint.org/) 與 [ESLint Vue](https://eslint.vuejs.org/)，程式碼檢查與風格規範，並用 [Prettier](https://prettier.io/) 統一風格。

檢查程式碼：

```bash [pnpm]
pnpm lint
```
