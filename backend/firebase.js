const { initializeApp, getApps } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'demo-api-key',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'skills-track-demo.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'skills-track-demo',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'skills-track-demo.firebasestorage.app',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '1234567890',
    appId: process.env.FIREBASE_APP_ID || '1:1234567890:web:demo-app-id'
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

function getDbRef(path = '') {
    return path ? `${path}` : '/';
}

module.exports = {
    firebaseConfig,
    firebaseApp,
    auth,
    database,
    db: database,
    getDbRef
};
