import admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import nodemailer from 'nodemailer';
import { defineSecret } from 'firebase-functions/params';


// Initialize admin SDK
admin.initializeApp();

// Define your secrets using defineSecret
const GMAIL_USER = defineSecret('GMAIL_USER');
const GMAIL_PASSWORD = defineSecret('GMAIL_PASSWORD');




// Set custom claims for admin
export const setAdminClaim = onCall(async (request) => {
  if (!request.auth || !request.auth.token.superAdmin) {
    throw new HttpsError('permission-denied', 'Only super admin can set admin claims');
  }

  try {
    const data = request.data;
    // Get user by email first
    const userRecord = await admin.auth().getUserByEmail(data.email);

    // Set admin claim using the UID
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    return {
      success: true,
      message: `Admin privileges granted to ${data.email}`,
      uid: userRecord.uid
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new HttpsError('not-found', 'User not found with this email');
    }
    throw new HttpsError('internal', 'Failed to set admin claim: ' + error.message);
  }
});






// Remove admin claim
export const removeAdminClaim = onCall(async (request) => {
  if (!request.auth || !request.auth.token.superAdmin) {
    throw new HttpsError('permission-denied', 'Only super admin can remove admin claims');
  }

  try {
    const data = request.data;
    // Get user by email first
    const userRecord = await admin.auth().getUserByEmail(data.email);

    // Remove admin claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: false });

    return {
      success: true,
      message: `Admin privileges removed from ${data.email}`,
      uid: userRecord.uid
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new HttpsError('not-found', 'User not found with this email');
    }
    throw new HttpsError('internal', 'Failed to remove admin claim: ' + error.message);
  }
});











export const getAllUsers = onCall(async (request) => {
  if (!request.auth || (!request.auth.token.admin && !request.auth.token.superAdmin)) {
    throw new HttpsError('permission-denied', 'Only admins can fetch user info.');
  }
  try {
    const allUsers = [];

    const listAllUsers = async (nextPageToken) => {
      const result = await admin.auth().listUsers(1000, nextPageToken);

      result.users.forEach((userRecord) => {
        allUsers.push({
          uid: userRecord.uid,
          email: userRecord.email || null,
          displayName: userRecord.displayName || null,
          emailVerified: userRecord.emailVerified,
          customClaims: userRecord.customClaims || {},
          creationTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime,
        });
      });

      if (result.pageToken) {
        await listAllUsers(result.pageToken); // recursively fetch next batch
      }
    };

    await listAllUsers(); // start the recursion

    return {
      success: true,
      users: allUsers,
      total: allUsers.length,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new HttpsError('internal', 'Failed to fetch users: ' + error.message);
  }
});







// Get user info by email
export const getUserByEmail = onCall(async (request) => {
  if (!request.auth || (!request.auth.token.admin && !request.auth.token.superAdmin)) {
    throw new HttpsError('permission-denied', 'Only admins can fetch user info.');
  }

  const { email } = request.data;

  if (!email) {
    throw new HttpsError('invalid-argument', 'Email is required');
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    return {
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || null,
        emailVerified: userRecord.emailVerified,
        customClaims: userRecord.customClaims || {},
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      },
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new HttpsError('not-found', 'User not found with this email');
    }
    console.error('Error fetching user:', error);
    throw new HttpsError('internal', 'Failed to fetch user: ' + error.message);
  }
});









export const sendReminderEmail = onCall({
  secrets: [GMAIL_USER, GMAIL_PASSWORD],
  cors: true,
}, async (request) => {
  if (!request.auth || !request.auth.token.admin) {
    throw new HttpsError('permission-denied', 'Only admins can send renewal reminders.');
  }

  const { to, subject, messageHtml } = request.data;

  if (!to || !subject || !messageHtml) {
    throw new HttpsError('invalid-argument', 'Missing required fields: to, subject, messageHtml');
  }

  // Create transporter inside the function
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER.value(), // Use environment variable
      pass: GMAIL_PASSWORD.value(), // Use environment variable
    },
  });

  try {
    await transporter.sendMail({
      from: '"Minimalist Gyms" <saikatsaha.rph@gmail.com>',
      to,
      subject,
      html: messageHtml,
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error('Email send error:', error);
    throw new HttpsError('internal', 'Failed to send email: ' + error);
  }
});