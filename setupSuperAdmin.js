import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };







// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "gym-project-1-11d17" // Replace with your actual project ID
});

async function setupSuperAdmin() {
    const email = 'saikatsaha.rph@gmail.com'; // Replace with your super admin email

    try {
        console.log('Setting up super admin...');

        const userRecord = await admin.auth().getUserByEmail(email);
        console.log('User found:', userRecord.email);

        await admin.auth().setCustomUserClaims(userRecord.uid, {
            admin: true,
            superAdmin: true
        });

        console.log('✅ Super admin privileges granted successfully!');
        console.log('User ID:', userRecord.uid);
        console.log('Email:', userRecord.email);

        const updatedUser = await admin.auth().getUser(userRecord.uid);
        console.log('Custom claims:', updatedUser.customClaims);

    } catch (error) {
        console.error('❌ Error setting super admin:', error.message);

        if (error.code === 'auth/user-not-found') {
            console.log('Make sure the user exists in Firebase Authentication first!');
        }
    }

    process.exit(0);
}




setupSuperAdmin();

