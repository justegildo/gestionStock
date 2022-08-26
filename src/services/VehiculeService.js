import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class VehiculeService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/vehicule/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/vehicule/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/vehicule/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/vehicule/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/vehicule/delete/${id}`), callback);

}