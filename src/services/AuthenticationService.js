import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class AuthenticationService {
    
    authenticate = (credentials, callback) => AxiosService.post(apiUrl('/api/authentication/authenticate'), credentials, callback);

}