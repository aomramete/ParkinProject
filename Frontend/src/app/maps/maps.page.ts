import { Component, OnInit, AfterContentInit,ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx'

declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit, AfterContentInit {
  map;
  latitude: any;
  longitude: any;
  @ViewChild('mapElement', {static: true}) mapElement;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: {lat: 13.726556, lng: 100.775070},
        zoom: 20
      });
  }

}
