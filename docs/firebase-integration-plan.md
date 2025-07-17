# Firebase Integration Plan

This document outlines the steps to integrate the frontend of the Task Manager application with a Firebase backend.

## 1. Firebase Project Setup

*   Go to the [Firebase Console](https://console.firebase.google.com/).
*   Create a new Firebase project.
*   Enable **Firestore** as the database.
*   Enable **Firebase Authentication** and configure the desired sign-in methods (e.g., Email/Password, Google).

## 2. Install Firebase SDK

We need to add the Firebase client-side SDK to our project.

```bash
npm install firebase
```

## 3. Firebase Configuration

*   In the Firebase project settings, find your web app's configuration object. It will look something like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "..."
    };
    ```
*   Create a new file `src/lib/firebase.ts` to initialize Firebase.
*   Store your Firebase configuration in environment variables (`.env.local`) to keep them secure.

**`src/lib/firebase.ts`:**
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

## 4. Refactor Data Actions

The current data fetching logic is in `src/lib/actions.ts` and `src/lib/tasks.ts`. We will refactor these files to use Firestore.

### `src/lib/tasks.ts` -> `src/lib/tasks-fs.ts` (Firestore version)

We will create a new set of functions to interact with Firestore for tasks. This will involve using functions like `collection`, `query`, `where`, `getDocs`, `addDoc`, `updateDoc`, and `deleteDoc`.

### `src/lib/actions.ts`

Update the server actions to call the new Firestore task functions. We'll need to handle user authentication to ensure users can only access their own tasks.

## 5. Implement Real-time Updates

To provide a dynamic experience, we will use Firestore's real-time listeners (`onSnapshot`) to update the UI whenever the data changes in the database.

*   We can create a custom hook (e.g., `useTasks`) that subscribes to the user's tasks collection and provides the tasks to the components.
*   This will replace the current data-fetching mechanism that relies on server actions and `revalidatePath`.

## 6. Authentication

*   Replace the `dummy-login-button.tsx` with a real authentication flow using Firebase Authentication.
*   Create a context provider for authentication to make the user's state available throughout the app.
*   Protect routes and data based on the user's authentication status.

## 7. Update Firestore Security Rules

To secure the data, we will update the Firestore security rules to:

*   Allow users to only read and write their own tasks.
*   Ensure that a user must be authenticated to access the tasks collection.

Example rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 8. UI Component Adjustments

*   Update components like `task-list.tsx` to use the new `useTasks` hook for real-time data.
*   Add loading spinners and handle empty states gracefully while the data is being fetched for the first time.
*   Ensure all CRUD operations on tasks are reflected in real-time in the UI.
