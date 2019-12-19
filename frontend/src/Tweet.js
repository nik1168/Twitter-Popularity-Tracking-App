export class Tweet {
    constructor(tweet) {
        this.id = tweet.id_str;
        this.timestamp = tweet.created_at;
        this.text = tweet.text;
        this.user = tweet.user.name;
        this.username = tweet.user.screen_name;
        this.retweeted_status = tweet.retweeted_status;
        this.retweet_count = tweet.retweet_count;
        this.favorite_count = tweet.favorite_count;
        this.coordinates = null
    }

    hasLocation() {
        return this.coordinates !== null;
    }
}
