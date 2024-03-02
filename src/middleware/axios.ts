import axios from 'axios';

import { getMD5Hash } from '../utils';

const PASSWORD = 'Valantis';
const API_URL = 'https://api.valantis.store:41000';

const instance = axios.create({
  baseURL: API_URL,
  method: 'POST',
  headers: {
    'X-Auth': getMD5Hash(PASSWORD),
    'Content-Type': 'application/json',
  },
});

export default instance;
