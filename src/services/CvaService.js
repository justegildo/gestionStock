import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class CvaService {
    
    getCva = (callback) => AxiosService.get(apiUrl('/api/crud/cva/get'), callback);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/cva/get/${id}`), callback);
    add = (callback) => AxiosService.post(apiUrl('/api/crud/cva/add'), callback);
    update = (callback) => AxiosService.put(apiUrl('/api/crud/cva/update'), callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/cva/delete/${id}`), callback);

}