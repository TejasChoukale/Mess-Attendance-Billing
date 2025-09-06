// functions/index.js
import functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();

// onCreate: ensure user doc + set default custom claim role:user
export const onAuthUserCreate = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email || null;
  const displayName = user.displayName || "";

  const userRef = admin.firestore().collection("users").doc(uid);

  const snap = await userRef.get();
  if (!snap.exists) {
    await userRef.set({
      name: displayName,
      email,
      role: "user",
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  // set custom claim role:user
  await admin.auth().setCustomUserClaims(uid, { role: "user" });

  return null;
});

// callable: admin-only role setter (set custom claim + update user doc)
export const setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const callerUid = context.auth.uid;
  const callerClaims = context.auth.token || {};
  if (callerClaims.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set roles.');
  }

  const { targetUid, role } = data;
  if (!targetUid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing targetUid or role');
  }

  const allowedRoles = ['user','admin','manager'];
  if (!allowedRoles.includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Role not allowed');
  }

  try {
    await admin.auth().setCustomUserClaims(targetUid, { role });
    await admin.firestore().collection('users').doc(targetUid).set({ role }, { merge: true });
    await admin.firestore().collection('audit_role_changes').add({
      targetUid,
      newRole: role,
      changedBy: callerUid,
      changedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true, role };
  } catch (err) {
    console.error("setUserRole error:", err);
    throw new functions.https.HttpsError('internal', 'Failed to set role');
  }
});
