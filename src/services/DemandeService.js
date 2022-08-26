import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class DeamandeVehiculeService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/crud/demande-vehicule/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/demande-vehicule/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/demande-vehicule/add'), credentials, callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/demande-vehicule/update'), credentials, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/demande-vehicule/delete/${id}`), callback);

}