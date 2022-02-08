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
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const DATE_UNITS = {
  date: 2419200,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

Timestamp.prototype.secsAgo = function () {
  const dateTimestamp = +this.toDate();
  const currentTimestamp = Date.now();

  return (currentTimestamp - dateTimestamp) / 1000;
};

Timestamp.prototype.unitvalue = function () {
  const secondsElapsed = this.secsAgo();

  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    const match = secondsElapsed >= secondsInUnit || unit === 'second';

    if (match) {
      const value = Math.floor(secondsElapsed / secondsInUnit) * -1;

      return { value, unit };
    }
  }
};

Timestamp.prototype.timeAgo = function (locale = 'en-GB') {
  const { value = 0, unit = 'second' } = this.unitvalue();

  let formater;
  if (unit === 'date') {
    formater = Intl.DateTimeFormat(locale, { dateStyle: 'short' });
  } else {
    formater = new Intl.RelativeTimeFormat(locale, 'short');
  }

  return formater.format(value, unit);
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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

export function fetchLatestDevits() {
  const devitsRef = collection(db, 'devits');

  const queryOrderByDateCreated = query(
    devitsRef,
    orderBy('createdAt', 'desc')
  );

  return getDocs(queryOrderByDateCreated).then((snapshot) => {
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      const { createdAt } = data;
      // const intl = new Intl.DateTimeFormat('es-ES');
      // const normalizedCreatedAt = intl.format(createdAt.toDate());
      const normalizedCreatedAt = createdAt.timeAgo('es-ES');
      return { ...data, id, createdAt: normalizedCreatedAt };
    });
  });
}

export function uploadImage(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  return uploadBytesResumable(storageRef, file);
}
