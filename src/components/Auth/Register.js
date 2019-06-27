import React,{Component} from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'; 
import {Link} from 'react-router-dom';
import firebase from "../../firebase";

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    }
    // we attach to every input via the onchange handler
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    }
    handleSubmit = event => {
        event.preventDefault();
        firebase
            .auth()
            .createUserAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
            .then(createUser => {
                console.log(createUser)
            })
            .catch(err => {
                console.error(err);
            })
        }

    render(){
        
        const { username, email, password, passwordConfirmation} = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450}}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange"/>
                        Register for DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left"
                            placeholder="Username" onChange={this.handleChange} value={username} type="text"/>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Email Address" onChange={this.handleChange} value={email} type="email"/>

                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                            placeholder="Password" onChange={this.handleChange} value={password} type="password"/>

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
                            placeholder="Password Confirmation" onChange={this.handleChange} value={passwordConfirmation} type="password"/>
 
                            <Button color="orange" fluid size="large">Submit</Button>
                        <Message>Already a user? <Link to="/login">  Login</Link></Message>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }

}

export default Register;