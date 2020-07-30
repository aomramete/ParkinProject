import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reservedata',
  templateUrl: './reservedata.page.html',
  styleUrls: ['./reservedata.page.scss'],
})
export class ReservedataPage implements OnInit {

  reservedata = [];
  uid = null;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + this.global.tokenID
    })
  };

  constructor(public router: Router, public global: GlobalService, private http: HttpClient) { }

  ngOnInit() {
    this.uid = this.global.uidgoogle
    this.http.get<any>('YOUR API ENDPOINT HERE', this.httpOptions).subscribe(res => {
      this.reservedata = res;
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  viewreserve() {
    this.router.navigate(['/eachreserve']);
  }

}
