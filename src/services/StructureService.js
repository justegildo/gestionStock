import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class StructureService {
    
    getStructure = (callback) => AxiosService.get(apiUrl('/api/crud/structure/get'), callback);
    /*getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/structure/get/${id}`), credentials, callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/structure/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/structure/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/structure/delete/${id}`), credentials, callback);*/

}