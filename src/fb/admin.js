import { cert, getApp, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from './serviceAccountKey.json';

try {
  initializeApp({
    credential: cert(serviceAccount),
    // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    databaseURL: `https://devtter-442e7.firebaseio.com`,
  });
} catch (e) {}

export const firestore = getFirestore(getApp());
