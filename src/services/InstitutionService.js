import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class InstitutionService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/institution/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/institution/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/institution/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/institution/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/institution/delete/${id}`), callback);

}