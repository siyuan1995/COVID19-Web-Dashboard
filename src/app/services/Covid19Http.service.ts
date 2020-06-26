// This file connect all the browser side actions with http request.

import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {TweetObject} from '../tweetobject';
import {Observable, observable} from 'rxjs';


@Injectable()

export class Covid19HttpService {
  constructor(private http: HttpClient) { }
  public tweetobj: TweetObject;

  onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.tweet_text) {
      layer.bindPopup("<dl><dt>TweetContent</dt>"
        + "<dd>" + feature.properties.tweet_text + "</dd>"
        + "<dt>TweetRetweets</dt>"
        + "<dd>" + feature.properties.tweet_rewteets + "</dd>"
      );

    }
  }

  VisualizeTweets(map: L.map, data) {
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


  FetchDataByKeyword(map: L.map, keyword: string, layergroup: L.layerGroup, tweetsdatachanged: Observable<TweetObject[]>) {
    return this.http.get('/FetchByKeyword/' + keyword)/*.subscribe(data => {
      tweetsdatachanged = new Observable<TweetObject[]>(observer => {
        observer.next(this.TransformData2Tweets(data));
      });
      layergroup.addLayer(this.VisualizeTweets(map, data));
      layergroup.addTo(map);
    });*/
  }

  InitialTweets(map: L.map, layergroup: L.layerGroup) {
    this.http.get('tweetsdisplay').subscribe(data => {
      layergroup.addLayer(this.VisualizeTweets(map, data));
      layergroup.addTo(map);
    });
  }
  TransformData2Tweets(data) {
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

}
