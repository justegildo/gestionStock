import axios from "axios";
import { url as apiUrl } from '../baseUrls/functions';
import Service from "./bak/Service";

export class AuthenticationService {
    
    authenticate(credentials, callback) {
        Service.post(apiUrl('/api/authentication/authenticate'), credentials, callback);
    }
}