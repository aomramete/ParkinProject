import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public myGlobalVar: string;
  public myGlobalPrice: number;
  public uidgoogle: string;
  public uidTOKEN: string;
  public tokenID: string;
  public ProfileName: string;
  public ProfilePic: string;
  public email: string;
  public serverAuth: string;
  public before5mins: number;
  public reserveto: number;
  public itstime: number;
  public alertNum: string;
  public resData: string;
  public serverTK: null;

  constructor() { }
}
