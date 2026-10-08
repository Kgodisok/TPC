const { initializeApp, getApps } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDB3_eMS2salfFQOX32QuWnWy7rD5xHvJo',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'tpc-project-ad914.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'tpc-project-ad914',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'tpc-project-ad914.firebasestorage.app',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '734459117823',
    appId: process.env.FIREBASE_APP_ID || '1:734459117823:web:ebd27373a4c699c6e60cca'
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function getDbRef(path = '') {
    return path ? `${path}` : '/';
}

module.exports = {
    firebaseConfig,
    firebaseApp,
    auth,
    firestore,
    database: firestore,
    db: firestore,
    getDbRef
};
