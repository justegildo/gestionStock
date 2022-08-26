import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class NiveauService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/niveau/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/niveau/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/crud/niveau/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/crud/niveau/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/niveau/delete/${id}`), callback);
    
}