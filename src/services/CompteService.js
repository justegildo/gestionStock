import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class CompteService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/compte/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/compte/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/crud/compte/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/crud/compte/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/compte/delete/${id}`), callback);
    resetPassword = (data, callback) => AxiosService.put(apiUrl('/api/crud/compte/reset-password'), data, callback);
    disableAccount = (data, callback) => AxiosService.put(apiUrl('/api/crud/compte/disable-account'), data, callback);
    enableAccount = (data, callback) => AxiosService.put(apiUrl('/api/crud/compte/enable-account'), data, callback);
}