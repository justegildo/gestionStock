import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class UtilisateurService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/utilisateur/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/utilisateur/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/utilisateur/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/utilisateur/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/utilisateur/delete/${id}`), callback);

}