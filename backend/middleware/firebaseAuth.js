import admin from 'firebase-admin';

let firebaseInitialized = false;

const initFirebaseAdmin = () => {
  if (firebaseInitialized) return;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) return;
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    firebaseInitialized = true;
  } catch (error) {
    firebaseInitialized = false;
  }
};

export const firebaseAuth = async (req, res, next) => {
  initFirebaseAdmin();
  const authHeader = req.headers.authorization || '';
  if (!firebaseInitialized || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
  } catch (error) {
    req.user = null;
  }
  return next();
};
