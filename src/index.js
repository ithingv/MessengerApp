import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Spinner from "./Spinner";
import registerServiceWorker from './registerServiceWorker';
import firebase from './firebase';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Switch, Route , withRouter} from 'react-router-dom';
import { createStore} from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser, clearUser } from './actions';


const store = createStore( rootReducer, composeWithDevTools()); // store the return value from executing we create sotre function 



class Root extends React.Component {
    // run by based on our on our state changes as a listener
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                // console.log(user);
                // access user data
                this.props.setUser(user);
                this.props.history.push('/'); // redirect them to home route
            } else { 
                this.props.history.push('/login'); // user is not found by the listener
                this.props.clearUser(); // clear out user from the global state

            }
        })
    }
  
    render(){
    
    return this.props.isLoading ? <Spinner /> : (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
    
            </Switch>
    )}
};

const mapStateFromProps = state => ({
    isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(
    connect(
        mapStateFromProps, 
        { setUser, clearUser }
    )(Root)
);

ReactDOM.render(
<Provider store={store}>
<Router>
<RootWithAuth />
</Router>
</Provider>, document.getElementById('root'));
registerServiceWorker();
