import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class DepenseService {

    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/depense/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/depense/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/depense/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/depense/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/depense/delete/${id}`), callback);

}