import React, {Component} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import {withRouter} from "react-router-dom";

const styles = {
    avatar: {
        width: '18%',
        display: 'inline-block',
        verticalAlign: 'top',
        position: 'relative',
        overflow: 'hidden',
        marginleft: '2%'
    },
    avatarimg: {
        width: '100%',
        '-webkit-border-radius': '50%',
        '-moz-border-radius': '50%',
        '-ms-border-radius': '50%',
        '-o-border-radius': '50%',
        borderRadius: '50%',
        border: '5px solid #ecf0f1',
        position: 'relative'
    },
    bubblecontainer: {
        width: '75%',
        position: 'relative',
        paddingLeft: '20px',
        verticalAlign: 'top',
        display: 'inline-block'
    },
    bubble: {
        width: '100%',
        lineHeight: '1.4em',
        padding: '20px',
        paddingTop: '0px',
        backgroundColor: '#ecf0f1',
        position: 'relative',
        borderRadius: '8px',
        textAlign: 'left',
        display: 'inline-block'
    },
    h3: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        fontFamily: 'Lato',
        display: 'inline-block',
        marginBottom: '.2em',
        color: '#95a5a6'
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

class TweetComp extends Component {
    render() {
        const {classes, img, user, text, username, id} = this.props;
        console.log(user)
        console.log(id)

        return (
            <div>
                <div className={classes.avatar}>
                    <img className={classes.avatarimg} src={img}/>
                    <div className="hover">
                        <div className="icon-twitter"/>
                    </div>
                </div>
                <div className={classes.bubblecontainer}>
                    <div className={classes.bubble}>
                        <div className="retweet">
                            <div className="icon-retweet"/>
                        </div>
                            <h3 className={classes.h3}><a
                                href={"http://twitter.com/"+user+"/status/"+id+""}>@{user}</a></h3>
                            <br/>
                            {text}
                            <div className="over-bubble">
                                <div className="icon-mail-reply action"/>
                                <div className="icon-retweet action"/>
                                <div className="icon-star"/>
                            </div>
                    </div>

                    <div className="arrow"/>
                </div>
            </div>
    )
    }
    }

    export default withStyles(styles)(TweetComp)
