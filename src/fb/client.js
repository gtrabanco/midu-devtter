import { initializeApp } from 'firebase/app';
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
  Timestamp,
} from 'firebase/firestore';

Timestamp.prototype.timeAgo = function (seconds) {
  const date = new Date();
  const currentTimestamp = date.getTime();
  const nowSecs = currentTimestamp - this.seconds;

  return nowSecs;
};

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDo22nmM-YcKa7Dix-0AVFHWlDJk_7NSD8',
  authDomain: 'devtter-442e7.firebaseapp.com',
  projectId: 'devtter-442e7',
  storageBucket: 'devtter-442e7.appspot.com',
  messagingSenderId: '358428276622',
  appId: '1:358428276622:web:52f6bafa6a758222e496df',
  measurementId: 'G-N4TJB19440',
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function mapUserFromFireBaseAuth(user) {
  if (user?.accessToken) {
    const { accessToken, email, displayName, photoURL, reloadUserInfo, uid } =
      user;
    const username = reloadUserInfo.screenName;

    localStorage.setItem('accessToken', accessToken);

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

export function addDevit({ avatar, userName, userId, content }) {
  return addDoc(collection(db, 'devits'), {
    avatar,
    userName,
    userId,
    content,
    createdAt: Timestamp.fromDate(new Date()),
    likesCount: 0,
    sharedCount: 0,
  });
}

export function fetchLatestDevits() {
  return getDocs(collection(db, 'devits')).then((snapshot) => {
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      const { createdAt } = data;
      // const intl = new Intl.DateTimeFormat('es-ES');
      // const normalizedCreatedAt = intl.format(createdAt.toDate());
      const normalizedCreatedAt = createdAt.timeAgo();
      return { ...data, id, createdAt: normalizedCreatedAt };
    });
  });
}
