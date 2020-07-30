import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-eachreserve',
  templateUrl: './eachreserve.page.html',
  styleUrls: ['./eachreserve.page.scss'],
})
export class EachreservePage implements OnInit {

  myId = null;
  reservedata = [];
  uid = null;
  reserveID = null;
  headers = null;
  arrivestatus = null;
  alertPage = null;
  passcode = null;
  meterID = null;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic' + this.global.tokenID
    })
  };

  constructor(public location: Location, public alertController: AlertController, public router: Router, public global: GlobalService, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.myId = this.activatedRoute.snapshot.paramMap.get('myid');
    //this.headers = {"Authorization": "Basic " + this.global.tokenID};
    this.http.get<any>('YOUR URL HERE', this.httpOptions).subscribe(data => {
      this.reservedata = data;
      this.meterID = data[0].meter_ID;
      this.reserveID = data[0].reserve_ID;
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  confirm() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Type The Password To Confirm The Reservation",
      inputs: [
        {
          name: 'input',
          type: 'number',
          placeholder: "Enter 4- Digit Password",
          max: 4,
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (alertData) => { //takes the data 
            this.passcode = alertData.input
            this.http.get<any>('YOUR URL HERE', this.httpOptions).subscribe(res => {
              this.arrivestatus = res;
              console.log(this.arrivestatus);
              if (this.arrivestatus != "") {
                alert("Correct Password");
                // Change LED
                this.http.get<any>('YOUR URL HERE', this.httpOptions).subscribe(res => {
                  this.arrivestatus = res;
                });
                this.router.navigate(['/reservedata']);
              }
            },
              (err) => {
                if (err.status == 402) {
                  alert('Incorrect Password \n Please type again');
                }
              });
          }
        }
      ]
    }).then((promptElement) => {
      promptElement.present();
    });
  }

  async leave() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you leaving this parking lot?',
      message: 'Press the confirm button if you leave the parking lot.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.http.get<any>('YOUR URL HERE', this.httpOptions).subscribe(data => {
              this.reservedata = data;
            });
            //Change LED
            this.http.get<any>('YOUR URL HERE', this.httpOptions).subscribe(data => {
              this.reservedata = data;
              //this.router.navigate(['/reservedata']);
            });
            console.log('Confirm Okay');
            this.router.navigate(['/reservedata']);
          }
        }
      ]
    });
    await alert.present();

  }

  async cancel() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete This Reservation?',
      message: 'This cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.http.get<any>('YOUR URL HERE', this.httpOptions).subscribe(data => {
              this.reservedata = data;
              this.router.navigate(['/reservedata']);
            });
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }
}
