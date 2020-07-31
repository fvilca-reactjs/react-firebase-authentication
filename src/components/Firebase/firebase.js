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
        this.facebookProvider = new app.auth.FacebookAuthProvider();
    }

    // ====> Auth api

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider)

    doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider)

    doSignOut = () => this.auth.signOut();

    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

    user = (uid) => this.db.ref(`users/${uid}`)

    users = () => this.db.ref('users')

    // *** Merge Auth and db User api *** //

    onAuthUserListener = (next, fallback) => {

        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.db.collection('Users')
                    .doc(authUser.uid)
                    .get()
                    .then(doc => {
                        console.log('data:', doc.data())
                        const dbUser = doc.data();
                        //console.log('dbUser:', dbUser)
                        if (!dbUser.roles) {
                            dbUser.roles = [];
                        }
                        //merge
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser,
                        };
                        next(authUser);
                    })
            } else {
                fallback();
            }
        })

    }

    //* Message API
    message = (uid) => this.db.ref(`messages/${uid}`);
    messages = () => this.db.ref('messages');


}

export default Firebase;