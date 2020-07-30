import { Component, ViewChild, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReservePageModule } from './reserve.module';
import { Router } from '@angular/router';
import { GlobalService } from '../../../global.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavController, AlertController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
})


export class ReservePage {

  myId = null;
  public detail = [];
  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = ['s/u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l/u00f8r'];
  customPickerOptions: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + this.global.tokenID
    })
  };
  myDate: String = new Date().toISOString();
  @ViewChild('DateFromInput', { static: false }) dfrom: { value: string; };
  @ViewChild('DateToInput', { static: false }) dto: { value: string; };
  @ViewChild('TimeFromInput', { static: false }) mfrom: { value: string; };
  @ViewChild('TimeToInput', { static: false }) mto: { value: string; };


  constructor(public global: GlobalService, public router: Router, private activatedRoute: ActivatedRoute
    , private http: HttpClient, private localNotifications: LocalNotifications, public navCtrl: NavController) {
    this.customPickerOptions = {
      buttons: [{
        text: 'save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }
  }
  ngOnInit() {
    this.myId = this.activatedRoute.snapshot.paramMap.get('myid');
    //console.log(this.global.uidgoogle);
  }
  OnClickReserveBtn() {
    var dateFrom = this.dfrom.value.split('T')[0];
    var timeFrom = this.mfrom.value.split('T')[1];
    var timeFrom1 = timeFrom.split('+')[0];
    var timeFrom2 = timeFrom1.split(':')[0] + ":" + timeFrom1.split(':')[1];
    var dateFrom2 = dateFrom + " " + timeFrom2;
    var dateTo = this.dto.value.split('T')[0];
    var timeTo = this.mto.value.split('T')[1];
    var timeTo1 = timeTo.split('+')[0];
    var timeTo2 = timeTo1.split(':')[0] + ":" + timeTo1.split(':')[1];
    var dateTo2 = dateTo + " " + timeTo2;


    console.log("Parking From: " + dateFrom2 + " To: " + dateTo2 + " ID: " + this.myId);

    const body = {
      "user_ID": this.global.uidgoogle,
      "reserve_from": dateFrom2,
      "reserve_to": dateTo2,
      "meter_ID": this.myId
    }
    this.http.post<any>('YOUR API ENDPOINT HERE', this.httpOptions, body).subscribe(data => {
      this.global.myGlobalVar = data;
      this.global.myGlobalPrice = data.Need2PAY;
      if (this.global.myGlobalPrice != null) {
        this.router.navigate(['/payment']);
      };
    }, (err) => {
      console.log(err);
      var errdata = err.error;
      if (err.status == 401) {
        alert('Time is conflicted. \n Please choose available time.');
      }
      else if (err.status == 402) {
        alert('You cannot pick the same start/end time. \n Please choose again.');
      }
      else if (err.status == 405) {
        alert('Please correct the date and time.');
      }
    });;
  }
}
