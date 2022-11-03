import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class VenteService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/operation-entree-sortie/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/operation-entree-sortie/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/operation-entree-sortie/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/operation-entree-sortie/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/operation-entree-sortie/delete/${id}`), callback);
}