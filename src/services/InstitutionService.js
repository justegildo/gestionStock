import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class InstitutionService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/institution/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/institution/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/crud/institution/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/crud/institution/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/institution/delete/${id}`), callback);

}