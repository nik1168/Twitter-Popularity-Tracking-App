import React, {Component} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InstructionDialog from './dialogs/InstructionDialog';
import SwipeDialog from './dialogs/SwipeDialog';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import Topbar from './Topbar';
import {bindActionCreators} from "redux";
import * as theoremsActions from "../actions/theoretical";
import {Subject, empty, of, timer} from 'rxjs';
import {
    flatMap,
    map,
    groupBy,
    distinctUntilChanged,
    filter,
    catchError, scan, debounce
} from 'rxjs/operators';
import {Input, MuiThemeProvider} from '@material-ui/core';

import {Tweet} from "../Tweet";
import {disconnectSocket, subscribeToTweets} from "../sockets/api";
import io from "socket.io-client";
import {changeTrack, getMocked, untrackTopic, URL_SERVER} from "../Api";
import TextField from "@material-ui/core/TextField";
import TweetComp from "../components/TweetComp";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {green, red} from "@material-ui/core/colors";


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
        height: '97%',
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
let makeCallStream = new Subject();
let prefButtonStream = new Subject();
let inputStream = new Subject();
let peopleStream = new Subject();
let planetStream = new Subject();
let vehicleStream = new Subject();
let getDataStream = new Subject();
let tweetsStream = new Subject();

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
            id:"1181810060453961730"
        },
        trackText: 'navidad',
        topicSent: '',
        connected: false,
        popularHashtags: []
    };


    initializeSearchStream() {
        makeCallStream
            .pipe(
                filter(val => this.state.searchText !== ''),
                map(val => {
                    console.log("Value for map");
                    return val.value;
                }),
                flatMap(val => {
                    console.log("Val for flat map");
                    console.log(val);
                    let arr = [];
                    this.state.prefStatus.map((item, index) => {
                        if (item[Object.keys(item)[0]]) {
                            arr.push({pref: item, text: val});
                        }
                    });
                    return of(arr);
                })
            )
            .subscribe(val => {
                console.log("Subcsribe :P :P")
                console.log(val);
                val.map((item, index) => {
                    switch (Object.keys(item.pref)[0]) {
                        case 'people':
                            peopleStream.next({searchText: item.text});
                            break;
                        case 'planets':
                            planetStream.next({searchText: item.text});
                            break;
                        case 'vehicles':
                            vehicleStream.next({searchText: item.text});
                            break;
                    }
                });
            });
    }

    initializeSocketStream() {
        console.log("Init socket stream");
        subscribeToTweets(tweetsStream);
        changeTrack(this.state.trackText).subscribe((value) => {
            this.setState({topicSent: this.state.trackText})
        });
    }

    initializeTweetsStream() {
        console.log("Init input stream!!");
        tweetsStream
            .pipe(debounce(() => timer(50)))
            .subscribe((tweet) => {
                this.setState({
                    connected: true,
                    actualTweet: tweet
                })
            })
    }

    initializeCountTweetsStream() {
        tweetsStream
            .pipe(scan(counter => counter + 1, 0))
            .subscribe(counter => {
                this.setState({count: counter})
            })
    }

    initializeHashtagTweetsStream() {
        tweetsStream
            .pipe(
                filter(tweet => tweet.entities.hashtags.length > 0),
                map(tweet => tweet.entities.hashtags[0]),
                groupBy(hashtag => hashtag.text)
            )
            .subscribe(groupedObservable => {
                groupedObservable
                    .pipe(
                        scan((count, current) => {
                            return {key: current, size: count.size + 1}
                        }, {key: '', size: 0}),
                        filter(res => {
                            return res.size > 2
                        })
                    )
                    .subscribe((result) => {
                        console.log("Final result papaya de zelaya");
                        console.log(result);
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


    initializeInputStream() {
        console.log("Init input stream!!");
        inputStream.subscribe(val => {
            console.log("Cambios que hay en mi");
            this.setState({
                searchText: val.value
            });
        });
    }

    initializePrefButtonStream() {
        prefButtonStream
            .pipe(
                filter(button => {
                    console.log("So we are filtering");
                    let count = 0;
                    button.prefStatus.map(
                        (item, index) => (item[Object.keys(item)[0]] ? count++ : undefined)
                    );
                    return count > 1 ? true : !button.status;
                }),
                filter(button => this.state.searchText !== '')
            )
            .subscribe(button => {
                console.log("Button value");
                console.log(button);
                this.state.prefStatus[button.index][button.pref] = !this.state
                    .prefStatus[button.index][button.pref];
                this.setState(
                    {
                        prefStatus: this.state.prefStatus
                    },
                    () => makeCallStream.next({value: this.state.searchText})
                );
            });
    }

    initializeDataStreams() {
        peopleStream
            .pipe(map(val => val.searchText), distinctUntilChanged())
            .subscribe(val => {
                console.log("PEOPLE STREAM!!");
                console.log(val);
                getDataStream.next({searchText: val, pref: 'people'});
            });
        planetStream
            .pipe(map(val => val.searchText), distinctUntilChanged())
            .subscribe(val => {
                    console.log("Value planets");
                    console.log(val);
                    getDataStream.next({searchText: val, pref: 'planets'})
                }
            );
        vehicleStream
            .pipe(map(val => val.searchText), distinctUntilChanged())
            .subscribe(val =>
                getDataStream.next({
                    searchText: val,
                    pref: 'vehicles'
                })
            );
        getDataStream
            .pipe(
                flatMap(val => {
                    console.log('getting new data', val);
                    let outVal = val;
                    console.log("URL");
                    console.log(`https://swapi.co/api/${val.pref}/?search=${val.searchText}`);
                    return fetch(
                        `https://swapi.co/api/${val.pref}/?search=${val.searchText}`
                    )
                        .then(val => val.json())
                        .then(val => {
                            console.log("Response from server");
                            console.log(val);
                            return of({pref: outVal.pref, res: val})
                        }) // Pasing data downstream for later use
                }),
                catchError(err => {
                    console.log("CATCH ERROR");
                    return empty();
                })
            )
            .subscribe(obs => {
                console.log("SUBSCRIBE FINAL!!!");
                console.log(obs);
                obs.subscribe((val) => {
                    console.log("THIS IS MY FINAL SUBSCRIPTION");
                    console.log(val);
                    this.setState({
                        data: {
                            ...this.state.data,
                            [val.pref]: {
                                count: val.res.count,
                                dataArray: val.res.results
                            }
                        }
                    });
                })
            });
    }

    changeTrackTest(track) {

        this.setState({trackText: track})
    }

    renderButtons(button) {
        return (
            <button
                key={button.id}
                onClick={e => {
                    prefButtonStream.next({
                        prefStatus: this.state.prefStatus,
                        status: button.status,
                        pref: button.name,
                        searchText: this.state.searchText,
                        index: button.id
                    })
                }

                }
                style={{
                    ...Styles.prefBut,
                    ...{background: button.status ? 'yellow' : undefined}
                }}
            >
                {button.name}
            </button>
        );
    }


    componentDidMount() {
        console.log("Component did mount Twitter popularity");
        // getMocked().subscribe((value) => console.log(value));
        console.log("Init sockets");
        // this.initializeSocketStream();
        this.initializeTweetsStream();
        this.initializeCountTweetsStream();
        this.initializeHashtagTweetsStream();
        const dog = "http://www.croop.cl/UI/twitter/images/doug.jpg"
        // console.log("Component mounted");
        // console.log(this.state);
        // this.initializeSearchStream();
        // this.initializePrefButtonStream();
        // this.initializeInputStream();
        // this.initializeDataStreams();
    }

    componentWillUnmount() {
        console.log("Component will unmount");
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
        disconnectSocket();
        this.setState({connected: false})
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
        console.log(actualTweet)
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
                                        {/*<p>{count}</p>*/}
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography color='secondary' variant="h5" gutterBottom>
                                            Topic {this.state.topicSent}
                                        </Typography>
                                        <TweetComp img={actualTweet.user.profile_image_url}
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
                                                this.state.popularHashtags.map(((res, index) => (
                                                    <span key={index}><b>#{res.key.text}</b> : {res.size} </span>
                                                )))
                                            }
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography color='secondary' variant="h5" gutterBottom>
                                            Locations :P
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <SwipeDialog
                        open={this.state.learnMoredialog}
                        onClose={this.dialogClose}/>
                    <InstructionDialog
                        open={this.state.getStartedDialog}
                        onClose={this.closeGetStartedDialog}
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(withStyles(styles)(Main));
// export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Main)))
