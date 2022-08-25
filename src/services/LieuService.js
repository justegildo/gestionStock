import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class LieuService {
    
    get = (callback) => AxiosService.get(apiUrl('/api/crud/lieu/get'), credentials, callback);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/lieu/get/${id}`), credentials, callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/lieu/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/lieu/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/lieu/delete/${id}`), credentials, callback);

}