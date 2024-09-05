# TownPass-Services

TownPass-Services project made with Vue3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### ```server.cjs``` for writing .env
## IMPORTANT
### ```.env``` 
- for ```VITE_GOOGLE_API_KEY```
    - create .env file at root and add your own google api key like .env.sample
    - you can get your own api key at https://ai.google.dev/gemini-api/docs/api-key
    - ENABLE search api, open https://console.cloud.google.com/welcome?hl=zh-TW&pli=1&project=gen-lang-client-0229406453 and select the project of the api key, select top left corner menu and click API and services, on top, search "google search", choose first and enable the service
- for ```VITE_GOOGLE_CX```
    - https://stackoverflow.com/questions/6562125/getting-a-cx-id-for-custom-search-google-api-python follow the link's first comment to obtain the id of your search engine, which is ```VITE_GOOGLE_CX```
<!-- ### remeber to run ```pnpm install axios``` if error -->

### ```src/view/chatview.vue```
### ```src/view/youbike.ts, metro.ts, distance.ts```
### ```src/view/settingsview.vue```
## Current problems: don't know how to modify user's api key (.env file)
