import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class NiveauService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/niveau/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/niveau/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/niveau/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/niveau/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/niveau/delete/${id}`), callback);
    
}