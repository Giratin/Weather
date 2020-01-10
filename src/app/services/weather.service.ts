import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private baseUrl = environment.proxy;
  private appId = environment.AppId;
  constructor(private http: HttpClient) { }

  getTemperature(lang,lat){
    return this.http.get(`${this.baseUrl}${this.appId}/${lat},${lang}`)
  }
}
