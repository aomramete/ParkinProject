import { AuthService } from './../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, OnInit } from '@angular/core';
//import { NavController , NavParams} from '@ionic/angular/ionic-angular';
import { DetailsPage } from '../pages/pages/details/details.page';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  users = [];
  placeName = [];
  items = [];
  listUsers = []; //Store all data from provider
  filterData = [];//Store filtered data
  page = 0;
  maximumPages = 3;
  show: boolean = true;
  //myDate: String = new Date().toISOString();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + this.global.tokenID
    })
  };
  date = new Date(); myDate: String = new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString();
  @ViewChild('DateFilter', { static: false }) dfilter: { value: string; };

  constructor(public router: Router, private http: HttpClient, private authservice: AuthService, private global: GlobalService) { }

  ngOnInit() {
  }

  OnClickFilterBtn() {
    var dateFilter = this.dfilter.value.split('T')[0];
    this.http.get<any>('YOUR URL HERE', HttpHeaders).subscribe(res => {
      this.filterData = res;
      console.log(this.filterData);

    });
  }

}
