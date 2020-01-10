import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lng : number = 0;
  lat: number = 0;
  ip : string = "";

  currentWeather = {
    summary : "",
    temprature: "",
    time: "",
    date: "",
    icon: "",
    cloud : 0.0,
    wind : 0.0
  }


  today : Array<any>;
  week : Array<any>;


  imageUlr : string = null;
  imageFront : string = null;
  loading : boolean = true;
  city : string = "";
  private baseUrl = environment.proxy;
  private appId = environment.AppId;
  constructor(private weatherService: WeatherService,
              private Http : HttpClient) { }

  ngOnInit() {
    this.loading = true;
    this.getIpAdress().then((res)=>{
      this.ip = res["ip"]
      this.getCorrdinates(this.ip).then((coord)=>{
        this.lat = coord["latitude"];
        this.lng = coord["longitude"];

        this.getWeather(this.lng,this.lat).then((weather)=>{
          //console.log("weather", weather)
          var citycomposed = weather["timezone"]
          this.city = (citycomposed.split("/")[1]).toString();

          this.currentWeather.summary = weather["currently"]["summary"]
          this.currentWeather.date = (weather["currently"]["time"]*1000).toString()
          this.currentWeather.temprature = ((5/9) * (weather["currently"]["temperature"] - 32) ).toString().split(".")[0]

          var icon = (weather["currently"]["icon"]) ;
          var i = this.getIcon(icon)

          this.currentWeather.icon = i;
          this.currentWeather.cloud = weather["currently"]["cloudCover"] * 100;
          this.currentWeather.wind = weather["currently"]["windSpeed"];
          
         this.getTodaysWeather(weather["hourly"]["data"])
         this.getThisWeekWeather(weather["daily"]["data"])

          this.getImage(this.city.toLowerCase()).subscribe((res)=>{
            console.log("e", res)
            var image = res["photos"][0]["image"]["web"]
            this.imageFront = res["photos"][0]["image"]["mobile"]
            //console.log("image url", image)
            this.imageUlr = image;
            this.loading = false;
            document.querySelector('body').style.backgroundImage = `url('${this.imageUlr}')`;
            (<HTMLElement>document.querySelector('.w3_agile_main_grids')).style.backgroundImage = `url('${this.imageFront}')`

          })
        }).catch((err)=>{
          //console.log("error", err)
        })
      })
    })

  }

 
  private getIpAdress(): Promise<any>{
    const promise = this.Http.get("https://api.ipify.org/?format=json").toPromise();
    return promise;
  }
 
  private getCorrdinates(ip) : Promise<any>{
    const promise = this.Http.get(`http://api.ipstack.com/${ip}?access_key=489a76c870ad52ac18063614f3958435&format=1`).toPromise();
    return promise;
  }

  private getWeather(lng,lat): Promise<any>{
    return this.Http.get(`${this.baseUrl}${this.appId}/${lat},${lng}`).toPromise();
  }

  private getImage(city){
    return this.Http.get(`https://api.teleport.org/api/urban_areas/slug:${city}/images/`);
  }

 private getIcon(input){
   var icons = ['clear day', 'clear night', 'cloudy day', 'cloudy night', 'rain', 'cloudy', 'sleet', 'snow', 'wind'];
  var output = "";
   switch(input){
      case 'clear-day':
        output = 'clear day';
        break;
      case 'clear-night':
        output = 'clear night';
        break;
      case 'rain':
        output = 'rain';
        break;
      case 'snow':
        output = 'snow';
        break;
      case 'sleet':
        output = 'sleet';
        break;
      case 'wind':
        output = 'wind';
        break;
      case 'fog':
        output = 'sleet';
        break; 
      case 'cloudy':
        output = 'cloudy';
        break; 
      case 'partly-cloudy-day':
        output = 'cloudy day';
        break; 
      case 'partly-cloudy-night':
        output = 'cloudy night';
        break; 
   }

   return output;
 }


 private getTodaysWeather(data){
   this.today = [];

  this.today.push(this.getObj(data[0]))
  this.today.push(this.getObj(data[10]))
  this.today.push(this.getObj(data[20]))
  this.today.push(this.getObj(data[30]))
  this.today.push(this.getObj(data[40]))

   //console.log("this today",this.today)
 }

 private getThisWeekWeather(data){
   this.week = [];
   this.week.push(this.getObjWeek(data[1]))
    this.week.push(this.getObjWeek(data[2]))
    this.week.push(this.getObjWeek(data[3]))
    this.week.push(this.getObjWeek(data[4]))
    this.week.push(this.getObjWeek(data[5]))
   //console.log("this week week",this.week)
 }

 private getObj(obj){
    return {
      summary : obj["summary"],
      temprature : ((5/9) * (obj["temperature"] - 32) ).toString().split(".")[0],
      time: obj["time"]*1000,
    }
 }

 private getObjWeek(obj){
    return {
      summary : obj["summary"].replace(" throughout the day.","."),
      temprature : ((5/9) * (obj["temperatureHigh"] - 32) ).toString().split(".")[0],
      time: obj["time"]*1000,
    }
 }
}
