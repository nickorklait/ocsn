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
