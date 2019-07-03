import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import registerServiceWorker from './registerServiceWorker';
import firebase from './firebase';
import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter as Router, Switch, Route , withRouter} from 'react-router-dom';

class Root extends React.Component {
    // run by based on our on our state changes as a listener
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.props.history.push('/'); // redirect them to home route
            }
        })
    }
  
    render(){
    
    return (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
    
            </Switch>
    )}
};

const RootWithAuth = withRouter(Root);

ReactDOM.render(
<Router>
<RootWithAuth />
</Router>, document.getElementById('root'));
registerServiceWorker();
