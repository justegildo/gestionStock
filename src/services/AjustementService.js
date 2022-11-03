import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class AjustementService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/ajustement/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/ajustement/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/ajustement/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/ajustement/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/ajustement/delete/{id}${id}`), callback);
}