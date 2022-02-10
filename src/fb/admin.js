import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_CONFIG);

try {
  if (getApps().length === 0)
    initializeApp({
      credential: cert(serviceAccount),
      // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
} catch (e) {
  console.error('Fail initilization');
  console.error(e);
  console.log(serviceAccount);
}

export const firestore = getFirestore(getApp());
