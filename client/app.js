import React from 'react';

import Navbar from './components/Nav';
import Routes from './routes';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(() => ({
  main: {
    height: '100%',
    width: '100%',
  },
}));
const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
