import axios from 'axios';

export class InstiService {
    getInstituts() {
        return axios.get('https://ms-parc.herokuapp.com/api/crud/institution/get?', {
            params: {
                size: 10
              }
            }).then(function (response) {
                console.log(JSON.stringify(response.data, null, 2));
        
            })
            

    }
}