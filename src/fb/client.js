import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GithubAuthProvider,
  onAuthStateChanged as onAuthStateChangedFirebase,
  signInWithPopup,
  signOut as signOutFirebase,
} from 'firebase/auth';

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

!getApps() && initializeApp(firebaseConfig);
const auth = getAuth();

function mapUserFromFireBaseAuth(user) {
  if (user?.accessToken) {
    const { accessToken, email, displayName, photoURL, reloadUserInfo } = user;
    const username = reloadUserInfo.screenName;

    localStorage.setItem('accessToken', accessToken);

    return {
      accessToken,
      avatar: photoURL,
      username,
      email,
      displayName,
      signOut: () => signOutFirebase(auth),
    };
  }

  return user;
}

export function onAuthStateChanged(onChange) {
  return onAuthStateChangedFirebase(auth, mapUserFromFireBaseAuth);
  // return onAuthStateChangedFirebase(auth, (data)).then((user) => {
  //   console.log(user);
  //   onChange(user);
  // });
}

export function loginWithGitHub() {
  const githubProvider = new GithubAuthProvider();
  return signInWithPopup(auth, githubProvider).then(({ user }) =>
    mapUserFromFireBaseAuth(user)
  );
}
