import React, {Component} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

import Topbar from './Topbar';
import MapNik from "../components/Map";
import {Subject} from "rxjs";
import {filter, startWith} from "rxjs/operators";

import {disconnectSocket, subscribeToTweets} from "../sockets/api";
import {changeTrack} from "../Api";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const numeral = require('numeral');
numeral.defaultFormat('0,000');

const styles = theme => ({
    root: {
        // flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        overflow: 'auto',
        height: 200
    },
    inline: {
        display: 'inline',
    },
    grid: {
        width: 1200,
        margin: `0 ${theme.spacing(2)}px`,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 20px)'
        }
    },
    loadingState: {
        opacity: 0.05
    },
    paper: {
        padding: theme.spacing(3),
        margin: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    rangeLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.spacing(2)
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    outlinedButtom: {
        textTransform: 'uppercase',
        margin: theme.spacing(1)
    },
    actionButtom: {
        textTransform: 'uppercase',
        margin: theme.spacing(1),
        width: 152,
        height: 36
    },
    blockCenter: {
        padding: theme.spacing(2),
        textAlign: 'center'
    },
    block: {
        padding: theme.spacing(2),
    },
    inlining: {
        display: 'inline-block',
        marginRight: 10
    },
    buttonBar: {
        display: 'flex'
    },
    noBorder: {
        borderBottomStyle: 'hidden'
    },
    mainBadge: {
        textAlign: 'center',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4)
    }
});

let tweetsStream = new Subject();

class Locations extends Component {
    initializeSocketStream() {
        subscribeToTweets(tweetsStream);
        changeTrack(this.state.trackText).subscribe((value) => {
        });
    }

    state = {
        loading: true,
        amount: 15000,
        period: 3,
        start: 0,
        monthlyInterest: 0,
        totalInterest: 0,
        monthlyPayment: 0,
        totalPayment: 0,
        data: [],
        lat: 51.505,
        lng: -0.09,
        zoom: 13,
        trackText: 'christmas'
        // trackText: 'christmas'

    };


    componentDidMount() {
        this.initializeSocketStream();
        tweetsStream
            .pipe(
                startWith({
                    id : "1207339939769257989",
                    screen_name : "Nik1168",
                    coordinates : {coordinates : [100.883, 12.9333]},
                    text : "Doing a project for a Cloud Computing Course at #VUB using #RxJS and #React",
                    user : {profile_image_url: "http://www.croop.cl/UI/twitter/images/doug.jpg"}
                }),
                filter(tweet => tweet.coordinates !== null)
            )
            .subscribe((tweet) => {
                const stateCopy = {...this.state};
                stateCopy.data.push(tweet);
                this.setState(stateCopy);
            })
    }

    componentWillUnmount() {
        disconnectSocket();
        // socket.disconnect()
    }


    render() {
        const {classes} = this.props;
        const currentPath = this.props.location.pathname;
        const position = [this.state.lat, this.state.lng];

        return (
            <div>
                <CssBaseline/>
                <Topbar currentPath={currentPath}/>
                <MapNik data={this.state.data}/>
                <List className={classes.root}>
                    {
                        this.state.data.map((tweet) => (
                            <div key={tweet.id} id={tweet.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={tweet.user.profile_image_url}/>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={<a
                                            href={"http://twitter.com/" + tweet.screen_name + "/status/" + tweet.id + ""}>{tweet.screen_name}</a>}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    color="textPrimary"
                                                >
                                                </Typography>
                                                {tweet.text}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                            </div>

                        ))
                    }
                </List>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(Locations));
