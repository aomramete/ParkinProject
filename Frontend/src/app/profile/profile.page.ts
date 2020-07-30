import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public router: Router,public global: GlobalService,private authservice: AuthService) { }

  ngOnInit() {
  }
  logout(){
    this.authservice.logout()
  }

  reservedata(){
    this.router.navigate(['/reservedata']);
  }

}
