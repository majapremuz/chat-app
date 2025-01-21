import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async register() {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      console.log('User registered:', userCredential);
      // Optionally, update the user's display name
      await userCredential.user?.updateProfile({ displayName: this.name });
      // Redirect to another page, e.g., login or home
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error during registration:', error);
      alert(error.message);
    }
  }

  /*async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      console.log('Google login successful:', userCredential);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Google login error:', error);
      alert(error.message);
    }
  }*/

}
