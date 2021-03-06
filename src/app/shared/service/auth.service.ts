import {Injectable, NgZone} from '@angular/core';
import {User} from "./user";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import {Router} from "@angular/router";
import firebase from 'firebase/compat/app';
import {BehaviorSubject} from "rxjs";
import auth = firebase.auth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: firebase.User | undefined; // Save logged in user data
  private loggedIn = new BehaviorSubject(false);

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    const loginUser = localStorage.getItem("user");
    if (loginUser == undefined || loginUser == "") {
      this.loggedIn.next(false);
    } else {
      this.loggedIn.next(true);
    }
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.loggedIn.next(true);
        JSON.parse(<string>localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', "");
        this.loggedIn.next(false);
      }
    })
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.setUserData(result.user);
        this.loggedIn.next(true);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.setUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.router.navigate(['/']).then()
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Send email verification when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser.then(
      user => user?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })

  }

  get isLoggedIn(): BehaviorSubject<boolean> {
    return this.loggedIn;
  }

  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
        this.setUserData(result.user);
      }).catch((error: any) => {
        window.alert(error)
      })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.router.navigate(['sign-in']);
    })
  }
}
