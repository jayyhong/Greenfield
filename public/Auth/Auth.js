import history from '../src/history';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';


  
export default class Auth {

  constructor() {
    this.service = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientId,
      redirectUri: AUTH_CONFIG.callbackUrl,
      audience: `https://${AUTH_CONFIG.domain}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid'
    });
    this.state = {
      sub: {}
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this)
  }

  login() {
    console.log("in login", this.service);
    this.service.authorize();
  }

  handleAuthentication() {
    this.service.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getUserInfo() {
    return this.service
  }
  
  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    
    // navigate to the home route
    history.replace('/home');
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/home');
    alert("you are logged out ")
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    // console.log("in setSession id_token:", localStorage.id_token, "access_token:", localStorage.access_token)
    // console.log("token expiration time", expiresAt)
    return new Date().getTime() < expiresAt;
  }
}
