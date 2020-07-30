import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  name: string;

  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit() {
  }

  doLogin()
  {
    this.authService.login(this.email, this.password).then( () =>{
      this.router.navigate(['members']);
    }).catch(err => {
      alert(err);
    })
  }

  loginGoogle(){
    this.authService.loginWithGoogle().then(() =>{
      // this.router.navigate(['/members']);
      this.router.navigateByUrl('/members');
      
    }).catch(err => {
      alert(err);
    })
  }

  loginFacebook(){
    alert('facebook');
  }

  regist(){
    //this.authService.register(this.email,this.password,this.name).then(() => {
      this.router.navigate(['/registerPage']);
    // }).catch(err => {
    //   alert(err);
    // })
  }

}
