import React from 'react';
import { useHistory } from 'react-router-dom';

function Splash(props) {
    const history = useHistory();
    //setInterval(()=>{history.replace("/dashboard")}, 3000);
    const token = localStorage.getItem("AUTHORIZATION");
    if(token == null) {
        history.replace("/login")
    }else{
        history.replace("/dashboard")
    }
    return (
        <div>
            <i className="pi pi-spin pi-spinner" style={{fontSize: '2rem'}}></i>
        </div>
    );
}

export default Splash;
