import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class StructureService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/structure/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/structure/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/crud/structure/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/crud/structure/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/structure/delete/${id}`), callback);

}