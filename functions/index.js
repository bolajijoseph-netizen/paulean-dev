/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");

setGlobalOptions({maxInstances: 10});
admin.initializeApp();

exports.updateIsActive = onDocumentWritten("userRequests/{id}", (event) => {
  const data = event.data.after.data();
  if (!data) return null;

  const status = data.status;
  const createdDate = data.createdDate.toDate();

  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 30);

  const isActive = status !== "completed" || createdDate < threshold;

  return event.data.after.ref.update({isActive});
});

exports.recomputeAgingNightly = onSchedule("0 2 * * *", async () => {
  const db = getFirestore();

  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 30);

  const snapshot = await db.collection("userRequests").get();

  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const createdDate = data.createdDate.toDate();
    const status = data.status;

    const isActive = status !== "completed" || createdDate < threshold;

    if (data.isActive !== isActive) {
      batch.update(doc.ref, {isActive});
    }
  });

  await batch.commit();
});
