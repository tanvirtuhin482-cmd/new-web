# Implementation Plan - Fix Remote Sync for Admin Customizations & Settings

## Problem
Admin customizations (settings, hero slides, banner, content) were persisting locally in browser cache and local dev state, but opening the website from a DIFFERENT device or browser loaded the old default/cached state instead of the admin's live changes.

## Root Causes Identified & Addressed
1. **Cloud Firestore Quota Shield Write Block:** In `src/utils/firebaseUtils.ts`, writes were previously bypassed if `quotaExhausted` was flagged, causing cloud updates to be skipped. Fixed to always attempt direct writes to cloud Firestore.
2. **Payload Splitting & Pruning:** `splitSettingsForFirestore` was structuring settings into redundant nested groups and pruning strings, which caused slides and customization properties to be lost in Firestore `settings/global`. Now using complete, sanitized root payload `sanitizeForFirestore(nextSettings)`.
3. **Hero Slides Binding:** In `src/App.tsx`, `currentSiteData` was missing a fallback-guarded `heroSlides` binding, resulting in `TEMPLATES.spices.heroSlides` overriding admin-configured slides on fresh sessions.
4. **Listener Echoing POSTs:** Real-time listeners `unsubSettings` and `unsubProducts` were triggering echoing HTTP POSTs back to `/api/settings/update` and `/api/products/update` on read, which could overwrite fresh server state. Removed echoing POSTs from read listeners.
5. **Real-time Distribution:** All connected devices receive updates via both active Firestore `onSnapshot` subscriptions and SSE (`/api/events`) with continuous polling fallback (`/api/sync`).

## Changes
- `src/utils/firebaseUtils.ts`: Unblocked `safeFirestoreWrite` to guarantee persistent Firestore synchronization.
- `src/App.tsx`:
  - Updated `handleUpdateSettings` to write complete sanitized settings to Firestore `settings/global`.
  - Updated `handleUpdateProducts` to write sanitized product documents and update `settings/global`.
  - Updated `unsubSettings` to cleanly merge snapshot data into React state and update local device storage without echoing POSTs.
  - Updated `currentSiteData` to pass `heroSlides: (Array.isArray(storeSettings.heroSlides) && storeSettings.heroSlides.length > 0) ? storeSettings.heroSlides : TEMPLATES.spices.heroSlides`.
- `server.ts` & `data_store.json`: Synchronized persistent product and settings data.

## Verification
- `tsc --noEmit` passed with 0 errors.
- `compile_applet` passed successfully.
- `/api/sync` verified responding with live data.
- UI layout, CSS, Tailwind classes, and styling left 100% untouched.
