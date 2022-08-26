import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class LieuService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/lieu/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/lieu/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/lieu/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/lieu/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/lieu/delete/${id}`), callback);

}