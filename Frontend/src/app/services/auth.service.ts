import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { auth } from 'firebase';
import { GlobalService } from '../global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public global: GlobalService, private AFauth: AngularFireAuth, private router: Router, private db: AngularFirestore, private google: GooglePlus) { }

  login(email: string, password: string) {
    // alert('something wrong!');
    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user);
      }).catch(err => rejected(err));
    });


  }

  logout() {
    this.AFauth.auth.signOut().then(() => {
      this.google.disconnect();
      // this.router.navigate(['/login']);
      this.router.navigateByUrl('/');
    })
  }

  register(email: string, password: string, name: string) {

    return new Promise((resolve, reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(email, password).then(res => {
        // console.log(res.user.uid);
        const uid = res.user.uid;
        this.db.collection('users').doc(uid).set({
          name: name,
          uid: uid
        })

        resolve(res)
      }).catch(err => reject(err))
    })


  }

  loginWithGoogle() {
    return this.google.login({}).then(result => {
      const user_data_google = result;
      this.global.uidTOKEN = user_data_google.accessToken;
      this.global.uidgoogle = user_data_google.userId;
      this.global.tokenID = user_data_google.idToken;
      this.global.ProfileName = user_data_google.displayName;
      this.global.email = user_data_google.email;
      this.global.ProfilePic = user_data_google.imageUrl;
      this.global.serverAuth = user_data_google.serverAuthCode;
      //alert(this.global.uidTOKEN);
      return this.AFauth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(null, user_data_google.accessToken))
    })



  }

}