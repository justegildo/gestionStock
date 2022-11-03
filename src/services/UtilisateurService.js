import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class UtilisateurService {

    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/utilisateur/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/utilisateur/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/utilisateur/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/utilisateur/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/utilisateur/delete/${id}`), callback);
    getByStructureId = (id, callback) => AxiosService.get(apiUrl(`/api/utilisateur/structure/${id}`), callback);

}