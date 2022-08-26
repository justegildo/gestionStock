import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class CvaService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/cva/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/cva/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/cva/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/cva/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/cva/delete/${id}`), callback);

}