import React, {Component} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import Topbar from './Topbar';
import {from, Subject, timer} from 'rxjs';
import {concatAll, debounce, distinct, filter, groupBy, map, scan, takeUntil} from 'rxjs/operators';
import {MuiThemeProvider} from '@material-ui/core';
import {disconnectSocket, subscribeToTweets} from "../sockets/api";
import {changeTrack} from "../Api";
import TextField from "@material-ui/core/TextField";
import TweetComp from "../components/TweetComp";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {green, red} from "@material-ui/core/colors";
import {languages} from "../languages";
import {languagesMapper} from "../languagesMapper";


const backgroundShape = require('../images/shape.svg');


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        overflow: 'hidden',
        background: `url(${backgroundShape}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: '0 400px',
        paddingBottom: 200
    },
    grid: {
        width: 1200,
        // height: 50,
        marginTop: 40,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 20px)'
        }
    },
    paper: {
        padding: theme.spacing(3),
        height: '250px',
        overflow: 'auto',
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    rangeLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.spacing(2)
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32
    },
    outlinedButtom: {
        textTransform: 'uppercase',
        margin: theme.spacing(1)
    },
    actionButtom: {
        textTransform: 'uppercase',
        margin: theme.spacing(1),
        width: 152
    },
    blockCenter: {
        padding: theme.spacing(2),
        textAlign: 'center'
    },
    block: {
        padding: theme.spacing(2),
    },
    box: {
        marginBottom: 40,
        height: 65
    },
    inlining: {
        display: 'inline-block',
        marginRight: 10
    },
    buttonBar: {
        display: 'flex'
    },
    alignRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    noBorder: {
        borderBottomStyle: 'hidden'
    },
    loadingState: {
        opacity: 0.05
    },
    loadingMessage: {
        position: 'absolute',
        top: '40%',
        left: '40%'
    }
});
const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: red
    },
});
const Styles = {
    prefBut: {
        marginTop: 50,
        marginLeft: 50,
        height: 50,
        width: 200,
        fontSize: 25
    },
    blackDiv: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        background: 'black',
        padding: 25
    },
    inputBox: {
        height: 50,
        width: 680,
        fontSize: 25,
        margin: 50,
        paddingLeft: 15,
        borderWidth: 6,
        borderColor: 'yellow'
    },
    searchBut: {
        marginLeft: 50,
        height: 50,
        width: 200,
        fontSize: 25,
        backgroundColor: 'yellow',
        borderRadius: 2
    }
};

let tweetsStream = new Subject();
let unsub = new Subject();

class Main extends Component {


    state = {
        learnMoredialog: false,
        getStartedDialog: false,
        prefStatus: [{people: true}, {planets: false}, {vehicles: false}],
        searchText: '',
        count: 0,
        data: {
            people: {count: 0, dataArray: []},
            vehicles: {count: 0, dataArray: []},
            planets: {count: 0, dataArray: []}
        },
        actualTweet: {
            user: {
                profile_image_url: "http://www.croop.cl/UI/twitter/images/doug.jpg"
            },
            screen_name: "Nik1168",
            text: "Computer Science student :)",
            id: "1181810060453961730"
        },
        trackText: 'christmas',
        topicSent: '',
        connected: false,
        popularHashtags: [],
        languages: []
    };


    initializeSocketStream() {
        console.log("Init socket stream");
        subscribeToTweets(tweetsStream);
        changeTrack(this.state.trackText).subscribe((value) => {
            this.setState({topicSent: this.state.trackText})
        });
    }

    initializeTweetsStream() {
        console.log("Init tweet stream!!");
        tweetsStream
            .pipe(
                // startWith(this.state.actualTweet),
                takeUntil(unsub),
                debounce(() => timer(50))
            )
            .subscribe((tweet) => {
                this.setState({
                    connected: true,
                    actualTweet: tweet
                })
            })
    }

    initializeCountTweetsStream() {
        tweetsStream
            .pipe(
                takeUntil(unsub),
                scan(counter => counter + 1, 0))
            .subscribe(counter => {
                this.setState({count: counter})
            })
    }

    initializeHashtagTweetsStream() {
        tweetsStream
            .pipe(
                takeUntil(unsub),
                filter(tweet => tweet.entities.hashtags.length > 0),
                map(tweet => from(tweet.entities.hashtags)),
                concatAll(), // merge observables :)
                groupBy(hashtag => hashtag.text)
            )
            .subscribe(groupedObservable => {
                groupedObservable
                    .pipe(
                        scan((count, current) => {
                            return {key: current, size: count.size + 1}
                        }, {key: '', size: 0}),
                        filter(res => {
                            return res.size > 1
                        })
                    )
                    .subscribe((result) => {
                        const stateCopy = {...this.state};
                        const index = stateCopy.popularHashtags.findIndex((r) => r.key.text === result.key.text);
                        if (index === -1) {
                            stateCopy.popularHashtags.push(result);
                        } else {
                            stateCopy.popularHashtags[index].size = result.size;
                        }
                        this.setState(stateCopy)

                    });
                // console.log("Hashtags papaya de zelaya");
                // console.log(groupedObservable)
            })
    }

    initializeLanguageTweetsStream() {
        tweetsStream
            .pipe(
                takeUntil(unsub),
                distinct(tweet => tweet.lang))
            .subscribe(tweet => {
                const stateCopy = {...this.state};
                stateCopy.languages.push(tweet.lang);
                this.setState(stateCopy)
            })
    }

    changeTrackTest(track) {

        this.setState({trackText: track})
    }

    componentDidMount() {
        console.log("Component did mount Twitter popularity");
        this.initializeTweetsStream();
        this.initializeCountTweetsStream();
        this.initializeHashtagTweetsStream();
        this.initializeLanguageTweetsStream()
    }

    componentWillUnmount() {
        console.log("Component will unmount");
        unsub.next();
        unsub.complete();
        disconnectSocket();
        // socket.disconnect()
    }

    openDialog = (event) => {
        this.setState({learnMoredialog: true});
    };

    dialogClose = (event) => {
        this.setState({learnMoredialog: false});
    };

    openGetStartedDialog = (event) => {
        this.setState({getStartedDialog: true});
    };

    closeGetStartedDialog = (event) => {
        this.setState({getStartedDialog: false});
    };

    changeTrackTopic = () => {
        changeTrack(this.state.trackText).subscribe((value) => {
            console.log(value);
            this.setState({topicSent: this.state.trackText})
        });
    };


    disconnect = () => {
        disconnectSocket(() => {
            this.setState({connected: false})
        });
    };

    connect = () => {
        this.initializeSocketStream();
    };

    handleConnection = () => {
        if (this.state.connected) {
            this.disconnect()
        } else {
            this.connect()
        }
    };

    render() {
        const {classes} = this.props;
        const {count, actualTweet, popularHashtags} = this.state;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Topbar/>
                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid spacing={4} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid container spacing={4} item xs={12}>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography color='secondary' variant="h5" gutterBottom>
                                            Tweets counter: {count}
                                        </Typography>
                                        <TextField id="standard-basic"
                                                   defaultValue={this.state.trackText}
                                                   onChange={(event) => this.changeTrackTest(event.target.value)}
                                                   label="Tweet topic"/>
                                        <Button style={{paddingTop: '20px'}}
                                                disabled={this.state.trackText.length === 0}
                                                onClick={() => this.changeTrackTopic()} variant='text' color="primary"
                                                autoFocus>
                                            Change track
                                        </Button>
                                        <MuiThemeProvider theme={theme}>
                                            <Button
                                                style={{marginTop: '19px', color: 'white'}}
                                                variant="contained"
                                                color={!this.state.connected ? "primary" : "secondary"}
                                                onClick={() => this.handleConnection()}
                                                disabled={false}
                                                startIcon={!this.state.connected ? <PlayArrowIcon/> : <StopIcon/>}

                                            >
                                                {
                                                    this.state.connected && (
                                                        <span>Disconnect</span>
                                                    )
                                                }
                                                {

                                                    !this.state.connected && (
                                                        <span>Connect</span>
                                                    )
                                                }

                                            </Button>
                                        </MuiThemeProvider>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography color='secondary' variant="h5" gutterBottom>
                                            Topic {this.state.topicSent}
                                        </Typography>
                                        <TweetComp key={actualTweet.id}
                                                   img={actualTweet.user.profile_image_url}
                                                   id={actualTweet.id}
                                                   user={actualTweet.screen_name} text={actualTweet.text}/>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container item spacing={4} xs={12}>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography color='secondary' variant="h5" gutterBottom>
                                            Popular Hashtags
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {
                                                this.state.popularHashtags.sort((a, b) => b.size - a.size).map(((res, index) => (
                                                    <span>
                                                         <span key={index}><b>#{res.key.text}</b> : {res.size} </span>
                                                        <br/>
                                                    </span>

                                                )))
                                            }
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography color='secondary' variant="h5" gutterBottom>
                                            Languages
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {
                                                this.state.languages.map(((res, index) => (
                                                    <span>
                                                         <span
                                                             key={index}><b>{languagesMapper[res] ? languagesMapper[res]['name'] : 'Undefined'}</b></span>
                                                        <br/>
                                                    </span>

                                                )))
                                            }
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(withStyles(styles)(Main));

