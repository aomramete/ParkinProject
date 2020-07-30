import { AuthService } from './../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, OnInit } from '@angular/core';
import { DetailsPage } from '../pages/pages/details/details.page';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({

  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  users = [];
  placeName = [];
  items = [];
  listUsers = []; //Store all data from provider
  filterData = [];//Store filtered data
  page = 0;
  maximumPages = 3;
  show: boolean = true;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + this.global.tokenID
    })
  };
  //myDate: String = new Date().toISOString();
  date = new Date(); myDate: String = new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString();

  @ViewChild('DateFilter', { static: false }) dfilter: { value: string; };

  constructor(public router: Router, private http: HttpClient, private authservice: AuthService, public global: GlobalService,) {
    this.loadUsers();
  }
  ngOnInit() {
  }

  loadUsers(event?) {
    this.http.get<any>('PUT YOUR URL HERE', this.httpOptions)
      .subscribe(res => {
        //console.log(res);
        this.users = res;
        this.listUsers = this.users;
        if (event) {
          event.target.complete();
        }
      })
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.loadUsers(event);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  loadMore(event) {
    this.page++;
    this.loadUsers(event);
    if (this.page === this.maximumPages) {
      event.target.disabled = true;
    }
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.users = this.users.filter((item) => {
        return (item.meter_Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })

    }
  }

  initializeItems() {
    this.users = this.listUsers;

  }

  goMap() {
    this.router.navigate(['/maps']);
  }

  filterPage() {
    this.router.navigate(['/filter']);
  }

  OnClickFilterBtn() {
    var dateFilter = this.dfilter.value.split('T')[0];
    this.http.get<any>('PUT YOUR URL HERE', this.httpOptions).subscribe(res => {
      this.filterData = res;
      console.log(this.filterData);

    });
  }
}
