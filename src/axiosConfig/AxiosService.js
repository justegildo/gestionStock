import axios from 'axios';
import AxiosToken from './AxiosToken';

class AxiosService {
    
    get(path, callback) {
        return axios.get(path, {headers: AxiosToken.getAuthorization()}).then(
            (response) => callback(response.data, response.status, response.headers)
        );
    }

    post(path, payload, callback) {
        return axios.post(path, payload, {headers: AxiosToken.getAuthorization()}).then(
            (response) => callback(response.data, response.status, response.headers)
        );
    }
    
    put(path, payload, callback) {
        return axios.put(path, payload, {headers: AxiosToken.getAuthorization()}).then(
            (response) => callback(response.data, response.status, response.headers)
        );
    }

    delete(path, payload, callback) {
        return axios.delete(path, {headers: AxiosToken.getAuthorization()}).then(
            (response) => callback(response.data, response.status, response.headers)
        );
    }
}

export default new AxiosService();