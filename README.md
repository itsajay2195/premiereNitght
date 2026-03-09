# Première Night 🎬

A film discovery app for Mytheresa's internal screening curation. Browse now-playing and popular titles, filter by genre, search the TMDb catalogue, and build a watchlist — all in a dark, editorial UI.

[View on Appetize.io](https://appetize.io/app/b_4m5xnr74zil3yxngynw2rbtgda)

---

## Getting Started

You'll need Node 20+, JDK 17+, and Android Studio (or Xcode on Mac) set up before running the app.

```bash
git clone https://github.com/itsajay2195/premiereNight.git
cd premiere-night
npm install
```

**Add your TMDb API key** — create `src/config.ts`:

```ts
export const TMDB_API_KEY = 'your_api_key_here';
```

Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

**iOS only:**

```bash
cd ios && pod install && cd ..
```

---

## Running

```bash
npm run android
npm run ios
npm run start       # Metro only
npm test
npm run lint
npm run lint:fix
```

---

## Stack

|            |                                               |
| ---------- | --------------------------------------------- |
| Framework  | React Native 0.81.5 (bare CLI)                |
| Navigation | React Navigation — Native Stack + Bottom Tabs |
| State      | Zustand 5                                     |
| Storage    | react-native-mmkv                             |
| API        | TMDb REST v3                                  |
| Icons      | react-native-vector-icons                     |
| Network    | @react-native-community/netinfo               |
| Toast      | react-native-toast-message                    |

---

## Architecture Notes

**Single FlatList over SectionList**

The home screen renders a `Section[]` array from a pure `buildSections()` function, each section being a horizontal scroll. I looked at `SectionList` but it doesn't compose well here — the sections have different data sources, different loading states, and one of them is conditional (genre filter). With `buildSections`, adding a new section is just pushing an object into an array.

**useReducer in useHomeScreen**

Started with individual `useState` calls and it got messy fast — loading and error flags going out of sync, hard to trace what triggered what. Moved everything into a reducer with named actions. Easier to follow, easier to test, and all the fetching logic lives in `useHomeScreen` so `HomeScreen.tsx` stays clean.

**MMKV over AsyncStorage**

MMKV reads synchronously via JSI — no async overhead for something as simple as a watchlist. It also has no size limits and plugs straight into Zustand's `persist` middleware with a small adapter. AsyncStorage would have worked but felt like the wrong tool.

**Zustand over Redux**

Redux felt like overkill for one store with a handful of actions. Zustand gives you the same persistence and selector patterns without the boilerplate.

**Error handling**

Errors are handled at three levels: `httpClient.ts` throws a typed `ApiError`, screens catch and show inline error states for primary content, and toast messages handle background failures. `ErrorBoundary` wraps the navigator as a last resort. `NetworkBanner` sits outside `SafeAreaView` and slides in when the device goes offline.

**AbortController**

Only applied in `DetailScreen` — it cancels the in-flight request if the user navigates away before it completes. Search uses a 400ms debounce so abort would be redundant there.

---

## Deep Linking

Scheme: `premierenight://`

| URL                         | Opens         |
| --------------------------- | ------------- |
| `premierenight://home`      | Home tab      |
| `premierenight://watchlist` | Watchlist tab |
| `premierenight://movie/:id` | Detail screen |

```bash
# Android
adb shell am start -W -a android.intent.action.VIEW -d "premierenight://movie/550" com.premierenight

# iOS
xcrun simctl openurl booted "premierenight://movie/550"
```

---

## Tests

```bash
npm test
```

Covers the two pure functions that drive most of the home screen logic:

- `buildSections.test.ts` — all section combinations including search, genre filter, loading and error states
- `homeReducer.test.ts` — every reducer action

---

## What I'd improve with more time

- **Pagination** — carousels currently cap at 15 items, `onEndReached` + page tracking would be straightforward to add
- **React Query** — `useHomeScreen` manages loading/error/refresh manually via `useReducer`; swapping to `@tanstack/query` would simplify it to a few `useQuery` calls and add caching for free
- **Image sizing** — backdrop images are fetched at `w1280` regardless of screen size

---

## AI Usage

Claude (Anthropic) helped with:

- Initial scaffolding and navigation boilerplate
- Test suite for `buildSections` and `homeReducer`
- Parts of this README

All architectural decisions were my own. Everything the AI produced was reviewed and adjusted before committing.
