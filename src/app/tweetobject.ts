export interface TweetObject {
  tweet_id: number;
  tweet_dayofweek: number;
  tweet_day: number;
  tweet_month: number;
  tweet_year: number;
  tweet_hour: number;
  tweet_minute: number;
  tweet_second: number;
  has_coordinates: string;
  has_place: string;
  tweet_text: string;
  tweet_language: string;
  tweet_favourites: number;
  tweet_rewteets: number;
  tweet_quotes: number;
  tweet_country: string;
  tweet_countrycode: string;
  tweet_place: string;
  tweet_placetype: string;
  tweet_longitude: number;
  tweet_latitude: number;
  user_id: number;
}
