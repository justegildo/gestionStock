import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class InventaireService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/inventaire/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/inventaire/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/inventaire/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/inventaire/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/inventaire/delete/${id}`), callback);

}