# Stratos (Expo iOS starter)

Minimal Expo-managed React Native app that renders a centered Stratos logo on a deep brand background.
It now includes a simple top header with a modal menu for Home, About, and Contact screens.

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
