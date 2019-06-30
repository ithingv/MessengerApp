import React,{Component} from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'; 
import {Link} from 'react-router-dom';
import firebase from "../../firebase";

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: []
    }
    
    // Form should be filled out 

    isFormValid = () => {

        let errors = [];
        let error;


        if(this.isFormEmpty(this.state)){
            error = { message: 'Fill in all fields'};
            this.setState({ errors: errors.concat(error)});
            return false;
            // throw error
        } else if(!this.isPasswordValid(this.state)){
            error = { message: 'Password is invalid'};
            this.setState({ errors: errors.concat(error)});
            return false;
            // throw error
        } else {
            // Form valid
            return true;
        }
    }

    isFormEmpty = ({username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ( {password, passwordConfirmation}) => {
        if (password.length < 6 || passwordConfirmation.length < 6){
            return false;
        } else if (password !== passwordConfirmation){
            return false;
        } else {   
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    // we attach to every input via the onchange handler
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    }
    handleSubmit = event => {
        if(this.isFormValid()){
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
    }
    render(){
        
        const { username, email, password, passwordConfirmation, errors} = this.state;

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
                        </Segment>
                    </Form>
                    {(errors.length >0) && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}           
                    <Message>Already a user? <Link to="/login">  Login</Link></Message>
                    
                </Grid.Column>
            </Grid>
        )
    }

}

export default Register;