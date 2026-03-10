# Stratos (Expo iOS starter)

Minimal Expo-managed React Native app that renders a centered Stratos logo on a deep brand background.
Navigation now uses bottom tabs for Home, Products, About, and Contact, plus a lightweight
drawer entry for Seasonal Campaigns (opened via the "More" button in the header).

Edit screen content in:
- `src/screens/HomeScreen.tsx`
- `src/screens/ProductsScreen.tsx`
- `src/screens/AboutScreen.tsx`
- `src/screens/ContactScreen.tsx`
- `src/screens/SeasonalCampaignsScreen.tsx`
- `src/screens/RecipesScreen.tsx`
- `src/screens/RecipeDetailsScreen.tsx`

## Recipes

Recipe data lives in:
- `src/data/recipes/recipes.ts`

Edit or add recipes by updating the seed data. Each recipe lists `productRefs`,
which are matched against products by `MasterERPNumber` or name contains.

## UGC Gallery

Curated UGC posts live in:
- `src/data/ugc/curatedPosts.ts`

To add or remove posts, edit the curated list. This MVP is curated-only and does
not accept user uploads.

## Barcode scan

Barcode scanning lives in:
- `src/screens/BarcodeScanScreen.tsx`

The scanner matches GTIN (from product image URLs) or `MasterERPNumber` to open the
product detail screen.

## Sliding Puzzle Mini Game

Sliding puzzle files live in:
- `src/games/slidingPuzzle/SlidingPuzzleScreen.tsx`
- `src/games/slidingPuzzle/SlidingPuzzleBoard.tsx`
- `src/games/slidingPuzzle/Tile.tsx`
- `src/games/slidingPuzzle/useSlidingPuzzle.ts`
- `src/games/slidingPuzzle/utils.ts`

The puzzle uses a 3x3 grid with one empty tile and renders slices of
`assets/stratos/stratos-cow.png`.

To scale grid size in future, adjust `GRID_SIZE` in
`src/games/slidingPuzzle/utils.ts`. The board and hook are size-driven.

## Four in a Row Mini Game

Four in a Row files live in:
- `src/games/fourInARow/FourInARowScreen.tsx`
- `src/games/fourInARow/Board.tsx`
- `src/games/fourInARow/Cell.tsx`
- `src/games/fourInARow/useFourInARow.ts`
- `src/games/fourInARow/winCheck.ts`
- `src/games/fourInARow/utils.ts`

Token image selection is configured in:
- `src/assets/stratosImages.ts` via `STRATOS_PIECES` (`p1` and `p2`).

## Spinning Wheel Mini Game

Spinning wheel files live in:
- `src/games/spinWheel/SpinWheelScreen.tsx`
- `src/games/spinWheel/Wheel.tsx`
- `src/games/spinWheel/Pointer.tsx`
- `src/games/spinWheel/ResultModal.tsx`
- `src/games/spinWheel/config.ts`
- `src/games/spinWheel/utils.ts`

Win chance is configured in:
- `src/games/spinWheel/config.ts` via `WHEEL_CONFIG.winProbability`.

## Tic-Tac-Toe Mini Game

Tic-tac-toe files live in:
- `src/games/ticTacToe/TicTacToeScreen.tsx`
- `src/games/ticTacToe/Board.tsx`
- `src/games/ticTacToe/Cell.tsx`
- `src/games/ticTacToe/useTicTacToe.ts`
- `src/games/ticTacToe/utils.ts`

Mark images are used in:
- `src/games/ticTacToe/Cell.tsx`

Current image mapping:
- Player O: `assets/stratos/straots-bubble.png`
- Player X: `assets/stratos/stratos-splas.png`

To swap images later, update those two static `require(...)` lines in `Cell.tsx`.

## Build Your Own Chocolate

Build-your-own files live in:
- `src/games/buildChocolate/BuildChocolateScreen.tsx`
- `src/games/buildChocolate/ChocolatePreview.tsx`
- `src/games/buildChocolate/IngredientSelector.tsx`
- `src/games/buildChocolate/IngredientChip.tsx`
- `src/games/buildChocolate/useChocolateBuilder.ts`
- `src/games/buildChocolate/ingredients.ts`

Ingredients are configured in:
- `src/games/buildChocolate/ingredients.ts`

To add a new topping:
1. Add a new ingredient object in `INGREDIENTS` with `id`, `label`, and visual metadata.
2. The selector updates automatically from `INGREDIENTS`.
3. Add handling for any new `layer` style in `ChocolatePreview.tsx` if needed.

Users can also add free-text custom toppings directly in the builder screen.
Custom toppings are included in the preview tags and share text.

## Stratos Trivia

Trivia files live in:
- `src/games/trivia/TriviaScreen.tsx`
- `src/games/trivia/TriviaStartScreen.tsx`
- `src/games/trivia/TriviaQuestionCard.tsx`
- `src/games/trivia/TriviaResultScreen.tsx`
- `src/games/trivia/Leaderboard.tsx`
- `src/games/trivia/useTriviaGame.ts`
- `src/games/trivia/questions.ts`
- `src/games/trivia/types.ts`
- `src/games/trivia/scoring.ts`

Questions are configured in:
- `src/games/trivia/questions.ts`

Question bank:
- Trivia now uses a larger local bank (40 questions).
- Each round randomly selects 10 questions from that bank.

Leaderboard storage:
- Stored locally in AsyncStorage with key `stratos_trivia_leaderboard_v1`.
- `useTriviaGame.ts` saves and keeps the top 10 scores sorted by score/date.

## Find Stratos Near Me

Find Stratos files live in:
- `src/features/findStratos/FindStratosScreen.tsx`
- `src/features/findStratos/StoreCard.tsx`
- `src/features/findStratos/useFindStratos.ts`
- `src/features/findStratos/kassalApi.ts`
- `src/features/findStratos/types.ts`

API endpoints used:
- `GET /products` (search for Stratos products)
- `GET /physical-stores` (nearby stores by coordinates)

API key configuration:
- Set `EXPO_PUBLIC_KASSALAPP_API_TOKEN` in your Expo environment before running.
- The app reads this token at runtime and sends it as `Authorization: Bearer <token>`.

## Crash diagnostics

The app now writes the last JS error to AsyncStorage and shows a fallback UI if a
render error occurs. This is used to debug TestFlight crashes safely.

## Products XML input

Place your product export XML at:

`/assets/PIM/OCSN_Website_Export_Orion_Nidar.xml`

This XML is bundled into the app build. To update product data for TestFlight/production,
replace this file and create a new build.

The app reads repeated `<Product>` nodes and shows products where:
- `ActiveProduct` is `Yes` (case-insensitive)
- `ProductName` contains `Stratos` (case-insensitive)

Product cards use:
- `ProductImageURL` for image
- `ProductNameWeb` (or `ProductName` fallback) for title
- `ProductDescription`
- `IngredientList` (HTML entities decoded, tags stripped)

## Requirements

- Node.js 18 LTS or newer (Node 20 recommended)
- npm 9+
- Xcode (latest stable) for iOS Simulator
- Expo Go on iOS device (optional)

## Install and run

```bash
npm install
npx expo start
```

Then either:
- Press `i` in the Expo dev server terminal to open iOS Simulator, or
- Scan the QR code with Expo Go on your device.

Alternative (native iOS run flow):

```bash
npx expo run:ios
```

## Replace the logo

Swap the file at:

`/assets/stratos/stratos-cow.png`

Keep the exact filename/path so no code changes are needed.

## iOS bundle identifier

Current placeholder is `com.example.stratos` in `app.json` under `expo.ios.bundleIdentifier`.
Replace it with your real bundle ID before App Store builds.

## Troubleshooting (short)

- If Metro cache is stale: run `npx expo start -c`.
- If simulator fails to boot: open Xcode → Settings → Platforms and update iOS runtimes.
- If `expo run:ios` fails after config changes: run `npx expo prebuild --clean` then retry.
- If device cannot connect: ensure phone and dev machine are on the same network.
- If CocoaPods errors occur: run `npx pod-install` after `expo prebuild`.
