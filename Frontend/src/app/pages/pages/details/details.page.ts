import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs';  // RxJS 6 syntax
import { GlobalService } from '../global.service';
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  myId = null;
  //details = [];
  public details: [];
  public reserveDetails: [];
  public responseData3: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + this.global.tokenID
    })
  };

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private global: GlobalService) { }

  public requestDataFromMultipleSources(): Observable<any[]> {
    this.myId = this.activatedRoute.snapshot.paramMap.get('myid');
    let response1 = this.http.get('YOUR API ENDPOINT HERE', this.httpOptions);
    let response2 = this.http.get('YOUR API ENDPOINT HERE', this.httpOptions);
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2]);
  }
  ngOnInit() {
    this.requestDataFromMultipleSources().subscribe(responseList => {
      this.details = responseList[0];
      this.reserveDetails = responseList[1];
    });
  }
}

