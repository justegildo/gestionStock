import axios from "axios";
import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class DeamandeVehiculeService {
    
    getDemandeVehicule = (callback) => AxiosService.get(apiUrl('/api/crud/demande-vehicule/get'),  callback);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/demande-vehicule/get/${id}`), callback);
    add = (credentials, callback) => AxiosService.post(apiUrl('/api/crud/demande-vehicule/add'), callback);
    update = (credentials, callback) => AxiosService.put(apiUrl('/api/crud/demande-vehicule/update'),  callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/crud/demande-vehicule/delete/${id}`), callback);

}