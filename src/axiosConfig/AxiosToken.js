class AxiosToken {

    getAuthorization() {
        // https://stackoverflow.com/questions/18019854/conditionally-set-an-object-property
        let token = this.token();
        return { ...(token !== null) && {Authorization: 'Bearer ' + token }};
    }
    
    token() {
        return window.localStorage.getItem('token');
    }
    
}

export default new AxiosToken();