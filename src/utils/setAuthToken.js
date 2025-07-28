// src/utils/setAuthToken.js
import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Delete auth header if logged out
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;