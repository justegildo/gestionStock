import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class LigneInventaireService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/ligne-inventaire/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/ligne-inventaire/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/ligne-inventaire/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/ligne-inventaire/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/ligne-inventaire/delete/${id}`), callback);

}