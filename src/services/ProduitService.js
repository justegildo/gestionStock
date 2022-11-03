import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class ProduitService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/produit/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/produit/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/produit/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/produit/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api///delete/${id}`), callback);
    
}