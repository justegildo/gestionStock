import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class NiveauService {
    
    getNiveau = (callback) => AxiosService.get(apiUrl('/api/crud/niveau/get'), callback);
    /*getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/niveau/get/${id}`), credentials, callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/niveau/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/niveau/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/niveau/delete/${id}`), credentials, callback);*/

}