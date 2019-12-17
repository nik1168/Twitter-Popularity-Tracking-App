import React, {Component} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import {withRouter, Link} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Months from './common/Months';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Loading from './common/Loading';

import Topbar from './Topbar';
import MapNik from "../components/Map";
import {Subject, timer} from "rxjs";
import {debounce} from "rxjs/operators";





const numeral = require('numeral');
numeral.defaultFormat('0,000');

const styles = theme => ({
    root: {
        // flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        overflow: 'hidden',
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

    };


    componentDidMount() {
        console.log("Component did mount maps");
        tweetsStream
            .pipe(debounce(() => timer(50)))
            .subscribe((tweet) => {
                console.log("Tweets from observable :)");
                console.log(tweet);

            })
    }


    render() {
        const {classes} = this.props;
        const currentPath = this.props.location.pathname;
        const position = [this.state.lat, this.state.lng];

        return (
            <div>
                <CssBaseline/>
                <Topbar currentPath={currentPath}/>
                <MapNik></MapNik>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(Locations));
