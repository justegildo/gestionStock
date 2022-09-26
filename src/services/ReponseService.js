import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class ReponseService {
    
    save = (data, callback) => AxiosService.put(apiUrl('/api/crud/reponse/save-all'), data, callback);
    
    /*
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/vehicule/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/vehicule/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/crud/vehicule/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/crud/vehicule/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/vehicule/delete/${id}`), callback);
    */
}