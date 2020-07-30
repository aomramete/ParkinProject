import { Component, OnInit, AfterViewChecked, ViewChild, AfterViewInit } from '@angular/core';
import { ReservePage } from '../pages/pages/reserve/reserve.page';
import { ReservePageModule } from '../pages/pages/reserve/reserve.module';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { Alert } from '../_alert';

declare let paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements AfterViewChecked {

  constructor(public location: Location, public router: Router, public global: GlobalService,
    private http: HttpClient, private activatedRoute: ActivatedRoute,
    private localNotifications: LocalNotifications, public navCtrl: NavController,
    private plt: Platform, public alertCtrl: AlertController) {

    // this.plt.ready().then(() => {
    //   this.localNotifications.on('click').subscribe(res => {

    //   });
    // })
  }

  addScript: boolean = false;
  paypalLoad: boolean = true;
  finalAmount: number = this.global.myGlobalPrice;;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + this.global.tokenID
    })
  };

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AbtJNHLtvOLGNUyiRWSQBNbS8GLxLEiGM2VvB3RHoFvDl8P9tbjFs_Wn_NZTQXiteqUTfbnd6YEply8t',
      production: ''
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: 'THB' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        //Do something when payment is successful.
        console.log(payment)
        this.http.post<any>('YOUR API ENDPOINT HERE', this.httpOptions, this.global.myGlobalVar).subscribe(data => {
          this.global.myGlobalVar = data;
          this.global.myGlobalPrice = data.Need2PAY;
          this.global.reserveto = data.reserveto;
          this.global.before5mins = data.before;
          this.global.itstime = data.itstime;
          alert("Paid Successful");
          this.localNotifications.schedule([
            {
              id: 1,
              title: 'Time to park',
              text: "It's time to park at the parking lot that you reserved.",
              trigger: { in: this.global.itstime, unit: ELocalNotificationTriggerUnit.SECOND },
              data: { mydata: 'Please press the arrive button when parked.' }
            }, {
              id: 23,
              title: 'Times running out',
              text: 'You have 5 minutes left on your parking reservation.',
              trigger: { in: this.global.before5mins, unit: ELocalNotificationTriggerUnit.SECOND },
              data: { mydata: 'Please leave the parking lot at the end of your reservation time.' }
            }
            , {
              id: 23333,
              title: 'Times up!',
              text: 'Your parking reservation is over.',
              trigger: { in: this.global.reserveto, unit: ELocalNotificationTriggerUnit.SECOND },
              data: { mydata: 'Please go back and press leave button and leave the parking lot.' }
            }
          ]);
          this.router.navigate(['/members']);
          //console.log(data);
        });
      })
    }
  };

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = false;
      })
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.global.myGlobalPrice)
    //this.amount = this.global.myGlobalPrice;
  }

}
