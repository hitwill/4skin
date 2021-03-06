import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import Toast from './Toast';

interface FollowProps {
    userID: string;
}

interface FollowState {
    userID: string;
    isFollowed: boolean;
}

class FollowButton extends React.Component<FollowProps, FollowState> {
    constructor(props: Readonly<FollowProps>) {
        super(props);

        this.state = {
            userID: this.props.userID,
            isFollowed: this.isFollowed(this.props.userID)
        };
    }

    justFollowed = false;
    isFollowed(userId: string): boolean {
        return FollowButton.followList()[userId] ? true : false;
    }

    static followList() {
        return JSON.parse(localStorage.getItem('peopleIfollow')) || {};
    }

    handleFollow(userId: string) {
        let followList = FollowButton.followList();
        this.justFollowed = !this.state.isFollowed;
        this.setState(state => ({
            ...this.state,
            isFollowed: this.justFollowed
        }));

        if (this.justFollowed) {
            followList[userId] = 1;
        } else {
            delete followList[userId];
        }
        localStorage.setItem('peopleIfollow', JSON.stringify(followList));
    }

    render() {
        let classes;
        let message = 'Posts from ' + this.props.userID + ' will show up on top.';
        if (this.state.isFollowed) {
            classes = 'follow-user followed-user';
        } else {
            classes = 'follow-user muted';
        }
        if(this.state.userID === 'anon') return null;// user doesn't have an id or trip - so can't be followed
        return (
            <span>
                {this.justFollowed ? <Toast message={message} /> : null}
                <Chip
                    data-user-id={this.props.userID}
                    className={classes}
                    label={this.state.isFollowed ? 'Following' : 'Follow'}
                    clickable
                    variant={this.state.isFollowed ? 'default' : 'outlined'}
                    size="small"
                    onClick={this.handleFollow.bind(this, this.props.userID)}
                />
            </span>
        );
    }
}

export default FollowButton;
