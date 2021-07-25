import React from 'react';
import { connect } from 'react-redux';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { IconButton, Avatar } from '@material-ui/core';
import { AccountBox } from '@material-ui/icons';

const GoogleAuth = (props) => {
  const { setAnchorEl, handleLogOut, getMe, icons } = props;

  const handleSuccess = (response) => {
    getMe(response);
  };
  const handleFail = (response) => {
    console.log('sign in failure', response);
  };
  return (
    <div id="extension-login">
      <IconButton
        className={icons}
        id="account"
        aria-label="menu"
        aria-haspopup="true"
        edge="start"
        size="medium"
        onClick={(ev) => setAnchorEl(ev.currentTarget)}
      >
        <AccountBox style={{ color: '#e0e2e4', fontSize: 30 }} />
      </IconButton>

      {props.isLoggedIn ? (
        <GoogleLogout
          clientId="811227993938-nd59os35t80qtuqgmul58232c54sbmsm.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={handleLogOut}
          isSignedIn={props.isLoggedIn}
          render={(renderProps) => (
            <Avatar
              onClick={renderProps.onClick}
              style={{
                height: 30,
                width: 30,
                border: 0,
                borderRadius: '50%',
                marginTop: '10px',
              }}
              src="https://i.pinimg.com/originals/a3/d5/8f/a3d58f0b2820871d486e9851c0fdbb60.jpg"
            />
          )}
        ></GoogleLogout>
      ) : (
        <GoogleLogin
          clientId="811227993938-nd59os35t80qtuqgmul58232c54sbmsm.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={handleSuccess}
          onFailure={handleFail}
          cookiePolicy={'single_host_origin'}
          isSignedIn={props.isLoggedIn}
          redirectUri={`${process.env.API_URL}/home`}
          render={(renderProps) => (
            <Avatar
              onClick={renderProps.onClick}
              style={{
                height: 30,
                width: 30,
                border: 0,
                borderRadius: '50%',
                marginTop: '10px',
              }}
              src="https://img-authors.flaticon.com/google.jpg"
            />
          )}
        />
      )}
    </div>
  );
};

export default connect(null)(GoogleAuth);
