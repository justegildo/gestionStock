import apiUrl from '../baseUrls/functions';
import AxiosService from '../axiosConfig/AxiosService';

export default new class TypeProduitService {
    
    get = (callback, queryParams) => AxiosService.get(apiUrl('/api/type-produit/get'), callback, queryParams);
    getById = (id, callback) => AxiosService.get(apiUrl(`/api/crud/cva/get/${id}`), callback);
    add = (data, callback) => AxiosService.post(apiUrl('/api/type-produit/add'), data, callback);
    update = (data, callback) => AxiosService.put(apiUrl('/api/type-produit/update'), data, callback);
    delete = (id, callback) => AxiosService.delete(apiUrl(`/api/type-produit/delete/${id}`), callback);

}