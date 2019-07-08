import React from 'react';
import { Sidebar, Menu, Divider, Button, Label , Icon, Modal} from 'semantic-ui-react';
import {SliderPicker} from 'react-color';

class ColorPanel extends React.Component{

    state={
        modal: false
    }

    onpenModal = () => this.setState({modal:true});
    closeModal = () => this.setState({modal:false});
        render(){

            const { modal } = this.state;

        return(
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider />
                <Button
                    icon="add"
                    size="small"
                    color="blue"
                    onClick={this.onpenModal}
            />

            {/* {color picker}  <- casesandberg.github.io/react-color*/}
            <Modal basic open={modal} onClick={this.closeModal}>
                <Modal.Header>Choose App colors</Modal.Header>
                <Modal.Content>
                    <Label content="Primary Color" />
                    <SliderPicker />
                    <Label content="Secondary Color" />
                    <SliderPicker />
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted>
                        <Icon name="checkmar" /> SaveColors
                    </Button>
                    
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </Sidebar>



        )
    }
}

export default ColorPanel;