import axios from "axios";
import { url as apiUrl } from '../baseUrls/functions';

export class AuthenticationService {

    token() {
        return window.localStorage.getItem('token');
    }
    
    authenticate(credentials) {
        return axios.post(apiUrl('/authenticate'), )
    }
}