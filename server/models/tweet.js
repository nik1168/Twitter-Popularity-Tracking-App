class Tweet {
    constructor(tweet) {
        this.name = tweet.user.name;
        this.screen_name = tweet.user.screen_name;
        this.name = tweet.user.name;
        this.text = tweet.text;
        this.user = tweet.user;
        this.quote_count = tweet.quote_count;
        this.reply_count = tweet.reply_count;
        this.coordinates = tweet.coordinates;
        this.place = tweet.place;
        this.retweet_count = tweet.retweet_count;
        this.favorite_count = tweet.favorite_count;
        this.entities = tweet.entities;
    }
}
