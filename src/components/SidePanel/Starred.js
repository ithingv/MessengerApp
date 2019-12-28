import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon} from 'semantic-ui-react';

class Starred extends React.Component{
    state = {
        activeChannel: '',
        starredChannel: [],
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users')
    }

    componentDidMount() {
        if(this.state.user){
        this.addListeners(this.state.user.uid);
        }
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
    };

    addListeners = (userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap =>{
                const starredChannel = { id: snap.key, ...snap.val()};
                this.setState({
                    starredChannel : [...this.state.starredChannel, starredChannel]
                });
            });
            this.state.usersRef
                .child(userId)
                .child('starred')
                .on('child_removed', snap => {
                    const channelToRemove = { id: snap.key, ...snap.val()};
                    const filterdChannels = this.state.starredChannel.filter(channel => {
                        return channel.id !== channelToRemove.id
                    });
                    this.setState({starredChannel: filterdChannels})
                })
        }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);

     }
 

    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id})
    }

    displayChannels = starredChannel => 
    starredChannel.length > 0 && starredChannel.map(channel => (
        <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{opacity: 0.7}}
            active={channel.id === this.state.activeChannel}
        >
            
            # {channel.name}
        </Menu.Item>
    ));

    render(){
        const { starredChannel} = this.state
        return(
            <Menu.Menu className="menu">
            <Menu.Item>
                    <span>
                        <Icon name="star"/> STARRED
                    </span>{" "}
                    ({starredChannel.length}) 
                </Menu.Item>
                {this.displayChannels(starredChannel)}
            </Menu.Menu>

        )
    }

}

export default connect(null, { setCurrentChannel, setPrivateChannel})(Starred);