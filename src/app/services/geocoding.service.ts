import { Injectable } from '@angular/core';

export interface Coordinates  {
  lng : number
  lat : number
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor() { }

  public getPosition(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
    }
  }

  private displayLocationInfo(position) {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
  
    console.log(`longitude: ${ lng } | latitude: ${ lat }`);
  }
}
