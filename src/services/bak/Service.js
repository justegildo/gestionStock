import axios from 'axios';

class Service {
    constructor() {
        let token = this.token();
        let service = axios.create({
            headers: { csrf: 'token', ...(token == this.token())!= null && token }
        });
        service.interceptors.response.use(this.handleSuccess, this.handleError);
        this.service = service;
    }
    
    token() {
        return window.localStorage.getItem('token');
    }

    handleSuccess(response) {
        return response;
    }

    handleError = (error) => {
        switch (error.response.status) {
            case 401:
                //this.redirectTo(document, '/')
                break;
            case 404:
                //this.redirectTo(document, '/404')
                break;
            default:
                //this.redirectTo(document, '/500')
                break;
        }
        return Promise.reject(error)
    }

    redirectTo = (document, path) => {
        document.location = path
    }

    get(path, callback) {
        return this.service.get(path).then(
            (response) => callback(response.status, response.data)
        );
    }

    patch(path, payload, callback) {
        return this.service.request({
            method: 'PATCH',
            url: path,
            responseType: 'json',
            data: payload
        }).then((response) => callback(response.status, response.data));
    }

    post(path, payload, callback) {
        return this.service.request({
            method: 'POST',
            url: path,
            responseType: 'json',
            data: payload
        }).then((response) => callback(response.status, response.data));
    }


    test() {
        Service.get(
            "https://jsonplaceholder.typicode.com/todos/",
            (status, data) => {
                console.table(data);
            }
        )
    }
}

export default new Service;