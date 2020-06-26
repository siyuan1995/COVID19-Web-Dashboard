import {AfterViewInit, Component, Renderer2, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import {Covid19HttpService} from '../services/Covid19Http.service';
import {TweetObject} from '../tweetobject';
import {Observable, observable} from 'rxjs';
// import "./leaflet-heat";
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;


@Component({
  selector: 'app-lmap',
  templateUrl: './LMap.component.html',
  styleUrls: ['./LMap.component.css']
})
export class LMapComponent implements  AfterViewInit, OnInit, OnChanges {

  public isBrowser: boolean;
  private map;
  public tweetobj: TweetObject;
  public tweetsdata: TweetObject[];
  public layergroup = L.layerGroup();
  public tweetsdatachanged: Observable<TweetObject[]>;

  constructor(@Inject(PLATFORM_ID) private platformId, private httpservices: Covid19HttpService) {
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
      this.initMap();
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      this.httpservices.InitialTweets(this.map, this.layergroup);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tweetsdata']) {
      console.log('tweetsdata is changed');
    }
  }

  public initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });
  }
  public TransformData2Tweets(data) {
    const tweets =  [];
    for (const ele of data['tweets'].rows) {
      this.tweetobj = {
        tweet_id: ele.tweet_id,
        tweet_dayofweek: ele.tweet_dayofweek,
        tweet_day: ele.tweet_day,
        tweet_month: ele.tweet_month,
        tweet_year: ele.tweet_year,
        tweet_hour: ele.tweet_hour,
        tweet_minute: ele.tweet_minute,
        tweet_second: ele.tweet_second,
        has_coordinates: ele.has_coordinates,
        has_place: ele.has_place,
        tweet_text: ele.tweet_text,
        tweet_language: ele.tweet_language,
        tweet_favourites: ele.tweet_favourites,
        tweet_rewteets: ele.tweet_rewteets,
        tweet_quotes: ele.tweet_quotes,
        tweet_country: ele.tweet_country,
        tweet_countrycode: ele.tweet_countrycode,
        tweet_place: ele.tweet_place,
        tweet_placetype: ele.tweet_placetype,
        tweet_longitude: ele.tweet_longitude,
        tweet_latitude: ele.tweet_latitude,
        user_id: ele.user
      };
      tweets.push(this.tweetobj);
    }
    return tweets;
  }
  public VisualizeTweets(map: L.map, data) {
    const tweets: any[] = [];
    for (let ele of data['tweets'].rows) {
      const tweetobj = {
        type: 'Feature',
        properties: {
          tweet_id: ele.tweet_id,
          tweet_dayofweek: ele.tweet_dayofweek,
          tweet_day: ele.tweet_day,
          tweet_month: ele.tweet_month,
          tweet_year: ele.tweet_year,
          tweet_hour: ele.tweet_hour,
          tweet_minute: ele.tweet_minute,
          tweet_second: ele.tweet_second,
          has_coordinates: ele.has_coordinates,
          has_place: ele.has_place,
          tweet_text: ele.tweet_text,
          tweet_language: ele.tweet_language,
          tweet_favourites: ele.tweet_favourites,
          tweet_rewteets: ele.tweet_rewteets,
          tweet_quotes: ele.tweet_quotes,
          tweet_country: ele.tweet_country,
          tweet_countrycode: ele.tweet_countrycode,
          tweet_place: ele.tweet_place,
          tweet_placetype: ele.tweet_placetype,
          tweet_longitude: ele.tweet_longitude,
          tweet_latitude: ele.tweet_latitude,
          user_id: ele.user_id
        },
        geometry: {
          type: 'Point',
          coordinates: [ele.tweet_longitude, ele.tweet_latitude]
        }
      };
      tweets.push(tweetobj);
    }
    return L.geoJSON(tweets, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {color:"#000",fillColor: "Red", radius: 10});
      },
      onEachFeature: this.onEachFeature
    }); // .addTo(this.map)

  }
  public onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.tweet_text) {
      layer.bindPopup("<dl><dt>TweetContent</dt>"
        + "<dd>" + feature.properties.tweet_text + "</dd>"
        + "<dt>TweetRetweets</dt>"
        + "<dd>" + feature.properties.tweet_rewteets + "</dd>"
      );

    }
  }

  public FilterByKeyword(keyword: string)  {
    this.layergroup.clearLayers();
    // this.httpservices.FetchDataByKeyword(this.map, keyword, this.layergroup, this.tweetsdatachanged);
    this.httpservices.FetchDataByKeyword(this.map, keyword, this.layergroup, this.tweetsdatachanged).subscribe(data => {
      this.layergroup.addLayer(this.VisualizeTweets(this.map, data));
      this.layergroup.addTo(this.map);
      const FilterdTweets = this.TransformData2Tweets(data);
      this.tweetsdata = FilterdTweets;
      console.log(FilterdTweets);
    });
  }





}
