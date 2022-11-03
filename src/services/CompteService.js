import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class CompteService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/compte/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/compte/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/compte/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/compte/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/compte/delete/${id}`), callback);
    resetPassword = (data, callback) => AxiosService.put(apiUrl('/api/compte/reset-password'), data, callback);
    disableAccount = (data, callback) => AxiosService.put(apiUrl('/api/compte/disable-account'), data, callback);
    enableAccount = (data, callback) => AxiosService.put(apiUrl('/api/compte/enable-account'), data, callback);
}