import app from 'firebase/app'
import '@firebase/auth'
import 'firebase/firestore'

const config = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};


class Firebase {
    constructor() {
        app.initializeApp(config)
        this.auth = app.auth();
        this.db = app.firestore()
        this.googleProvider = new app.auth.GoogleAuthProvider();
    }

    // ====> Auth api

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

    user = (uid) => this.db.ref(`users/${uid}`)
    
    users = () => this.db.ref('users')

    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider)
    
}

export default Firebase;