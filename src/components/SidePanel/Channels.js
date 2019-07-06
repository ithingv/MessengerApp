import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel} from '../../actions';
import { Menu, Icon , Modal, Form, Input, Button, Label} from 'semantic-ui-react';

class Channels extends React.Component{
    
    state = {
        activeChannel: '',
        user : this.props.currentUser,
        channel: null,
        channels : [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true,
        messagesRef: firebase.database().ref('messages'),
        notifications: []
    }

    componentDidMount(){
        this.addListeners();
    }

    componentWillMount(){
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels : loadedChannels }, () => this.setFirstChannel());
            this.addNotificationListener(snap.key); // tkae the Id of every channel
        })
    };

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value', snap => { // listen for any new messages added
            if(this.state.channel){
                this.handleNotification(channelId, this.state.channel.id, this.state.notifications, snap);
                // show the number of messages that are new and the other channels that they're not on
            }
        })
    }


    handleNotification = ( channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId);
        // we will iterate over the notifications array that we're getting from state
        // we will want to see if we have any information about a given channel
    
        if(index !== -1){ // if we have an index
            if(channelId !== currentChannelId){ // not equal to the currentChannelId
                lastTotal = notifications[index].total; // we will update the last total value using the total value from the given array element 

                if(snap.numChildren() - lastTotal >0){ // if there is a new meesage or multiple messages added to a given channel 
                    notifications[index].count = snap.numChildren() - lastTotal;
                } // we're gonna upate the count property for a given element
            }
            notifications[index].lastKnownTotal = snap.numChildren();
            // this should be the number of new meesages
        } else { // no index
            notifications.push({
                id: channelId,
                total: snap.numChildren(), // total number of the messages 
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }
        this.setState({ notifications});
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length >0){
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({channel : firstChannel});
        }
        this.setState({ firstLoad: false});
    }
    addChannel = () => {
        const { channelName, channelDetails, channelsRef, user} = this.state;
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy : {
                name: user.displayName,
                avatar: user.photoURL
            }
        };
        channelsRef
            .child(key)
            .update(newChannel)
            .then(()=> {
                this.setState({ channelName: '', channelDetails: ''});
                this.closeModal();
                console.log('channel added')
            })
            .catch(err=> {
                console.error(err);
            })
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel();
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name] : event.target.value});
    };

    changeChannel = channel => {
       this.setActiveChannel(channel);
       this.clearNotifications();
       this.props.setCurrentChannel(channel);
       this.props.setPrivateChannel(false);
       this.setState({ channel});
    }

    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id})
    }

    getNotificationCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notifiaction => {
            if(notifiaction.id === channel.id){
                count = notifiaction.count;
            }
        });
        if(count>0) return count;
    }


    clearNotifications = () => { //remove any notifications that we're getting for a channel that we're currently on 
        let index = this.state.notifications.findIndex(notifiaction => notifiaction.id === this.state.channel.id);

        if( index !== -1 ){
            let updateNotifications  = [...this.state.notifications];
            updateNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updateNotifications[index].count = 0;
            this.setState({ notifications : updateNotifications })
        }
    }


    displayChannels = channels => 
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{opacity: 0.7}}
                active={channel.id === this.state.activeChannel}
            >
                {this.getNotificationCount(channel) && (
                    <Label color="red">{this.getNotificationCount(channel)}</Label>
                )}
                # {channel.name}
            </Menu.Item>
        ));
    

    isFormValid = ({ channelName, channelDetails}) => channelName && channelDetails;

    openModal = () => this.setState({modal: true});
    closeModal = () => this.setState({modal: false});

    render(){
        const { channels, modal } = this.state;

        return(
            <React.Fragment>
            <Menu.Menu className="menu" style={{paddingBottom: '2em' }}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange"/> CHANNELS
                    </span>{" "}
                    ({channels.length}) <Icon name="add" onClick={this.openModal} />
                </Menu.Item>
                {this.displayChannels(channels)}
            </Menu.Menu>

            {/* Add channel modal
             this will set the open property false and hide our modal*/}

            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Field style={{ paddingBottom: '1em'}}>
                        <Input 
                            fluid
                            label="Name of Channel"
                            name ="channelName"
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <Input 
                            fluid
                            label="About the Channel"
                            name ="channelDetails"
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark" /> Add
                    </Button>
                    
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </React.Fragment> 
            // to group multiple components to return just one component within a file
        
        )
    }

}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);