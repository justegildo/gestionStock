import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class InstitutionService {
    
    getInstitution = (callback) => AxiosService.get(apiUrl('/api/crud/institution/get'), callback);
   /* getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/institution/get/${id}`), credentials, callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/institution/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/institution/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/institution/delete/${id}`), credentials, callback);*/

}