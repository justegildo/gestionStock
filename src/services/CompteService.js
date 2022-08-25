import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class CompteService {
    
    get = (callback) => AxiosService.get(apiUrl('/api/crud/compte/get'), credentials, callback);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/compte/get/${id}`), credentials, callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/compte/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/compte/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/compte/delete/${id}`), credentials, callback);

}