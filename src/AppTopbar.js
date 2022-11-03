import React, {useState}  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export const AppTopbar = (props) => {
    const toast = useRef();
    const history = useHistory();
    const [yesNo, setYesNo] = useState({});

    /* const logout2 = () =>{
        history.replace("/login")
    } */

    let data = localStorage.getItem('user');
    let recup = JSON.parse(data);
    //console.log(JSON.parse(data));
   /*  console.log(recup.utilisateur.structure.institution.libelle);
    const profile = () =>{
        let name = recup.utilisateur.nom;
        let name2 = recup.utilisateur.prenom;
        let type = recup.utilisateur.typeUtilisateur;
        let nameInst = recup.utilisateur.structure.institution.libelle;
        console.log();
        toast.current.show({ severity: 'info', summary: 'Success Message', detail: 'Nom: ' +name + ' ' + name2 + ' Type: '+type + '; Instituiton: '+nameInst, life: 8000 });
    }  */

    const logout =()=>{
        //console.log("coucou")
        setYesNo({
            visible: true,
            message: "Voulez-vous vraiment se déconnecter ?",
            hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
            callback: ()=>{
                localStorage.clear('token');
                history.push("/login");
            }
        })
    }

    const Confirmation = (props)=>{
        const {visible, hide, message, callback } = props;
        
        return (
            <Dialog modal visible={visible} onHide={hide} 
                header="Confirmation" style={{ width: '350px' }}
                footer={
                    <>
                        <Button type="button" label="Non" icon="pi pi-times" 
                            onClick={hide} 
                            className="p-button-text" />
                        <Button type="button" label="Oui" icon="pi pi-check" 
                            onClick={() => { hide(); callback() }} 
                            className="p-button-text" autoFocus />
                    </>
                }>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>{message != null ? message : "Voulez-vous continuer ?"}</span>
                </div>
            </Dialog>
        )
    } 
   
    
    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark.svg' : 'assets/layout/images/logo-white.svg'} alt="logo"/>
                <span>GESTION </span>
            </Link>

            <Confirmation {...yesNo} />

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick} >
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>
            
            <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                
                <li>
                    <Link to="/update" >
                        <Button label='Modifier mot de passe' className="p-button-text mr-2 mb-2" /> 
                    </Link>
                </li>
               {/*  <li>
                    <Button label='Profile' className="p-button-text mr-2 mb-2" onClick={profile} >
                        <Toast ref={toast} />
                    </Button>
                </li> */}
                <li>
                    <Button label=' Déconnexion' className='p-button-danger p-button-text mr-2 mb-2' onClick={logout}/>
                </li>
            </ul>
        </div>
    );
}
