import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class CvaService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/cva/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/cva/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/crud/cva/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/crud/cva/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/cva/delete/${id}`), callback);

}