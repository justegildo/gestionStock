import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class JourneeService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/journee/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/journee/get/${id}`), callback);
    open = (data, callback) => AxiosService.post(apiUrl('/api/journee/open'), data, callback);
    close = (data, callback) => AxiosService.post(apiUrl('/api/journee/close'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/journee/delete/${id}`), callback);
    
}