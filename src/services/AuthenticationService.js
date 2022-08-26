import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class AuthenticationService {
    
    authenticate = (data, callback) => AxiosService.post(apiUrl('/api/authentication/authenticate'), data, callback);

}