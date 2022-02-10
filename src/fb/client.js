import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GithubAuthProvider,
  onAuthStateChanged as onAuthStateChangedFirebase,
  signInWithPopup,
  signOut as signOutFirebase,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import timeAgo from 'lib/timeago';

Timestamp.prototype.timeAgo = function (locale = 'en-GB') {
  return timeAgo(this.toDate(), locale);
};

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function mapUserFromFireBaseAuth(user) {
  if (user?.accessToken) {
    const { accessToken, email, displayName, photoURL, reloadUserInfo, uid } =
      user;
    const username = reloadUserInfo.screenName;

    return {
      uid,
      accessToken,
      avatar: photoURL,
      username,
      email,
      displayName,
    };
  }

  return user || null;
}

export function onAuthStateChanged(onChange) {
  onChange(onAuthStateChangedFirebase(auth, mapUserFromFireBaseAuth));
  return onAuthStateChangedFirebase(auth, (user) => {
    const userData = mapUserFromFireBaseAuth(user);
    onChange(userData);

    return userData;
  });
}

export function loginWithGitHub() {
  const githubProvider = new GithubAuthProvider();
  return signInWithPopup(auth, githubProvider).then(({ user }) =>
    mapUserFromFireBaseAuth(user)
  );
}

export function logOut() {
  return signOutFirebase(auth);
}

export function addDevit({ avatar, userName, userId, content, imgURL = null }) {
  return addDoc(collection(db, 'devits'), {
    avatar,
    userName,
    userId,
    content,
    createdAt: Timestamp.fromDate(new Date()),
    likesCount: 0,
    sharedCount: 0,
    imgURL,
  });
}

function mapDocDevitToDevitObject(doc) {
  const data = doc.data();
  const id = doc.id;
  const { createdAt } = data;
  // const intl = new Intl.DateTimeFormat('es-ES');
  // const normalizedCreatedAt = intl.format(createdAt.toDate());
  const normalizedCreatedAt = createdAt.toDate();
  const timeago = createdAt.timeAgo('es-ES');

  return { ...data, id, createdAt: normalizedCreatedAt, timeago };
}

export function fetchLatestDevits() {
  const devitsRef = collection(db, 'devits');

  const queryOrderByDateCreated = query(
    devitsRef,
    orderBy('createdAt', 'desc')
  );

  return getDocs(queryOrderByDateCreated).then((snapshot) => {
    return snapshot.docs.map(mapDocDevitToDevitObject);
  });
}

export function listenLatestDevits(callback) {
  const colRef = collection(db, 'devits');
  const queryOrderByDateCreated = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(queryOrderByDateCreated, ({ docs }) =>
    callback(docs.map(mapDocDevitToDevitObject))
  );
}

export function uploadImage(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  return uploadBytesResumable(storageRef, file);
}

export { Timestamp };
