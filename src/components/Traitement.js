import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { InputNumber } from 'primereact/inputnumber';
import DemandeService from '../services/DemandeService';
import LieuService from '../services/LieuService';
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast'
import { Route, Switch, useHistory } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import VehiculeService from '../services/VehiculeService';
import CvaService from '../services/CvaService';


const Traitement = () => {
    const [yesNo, setYesNo] = useState({});
    const [chefParcform, setChefParcForm] = useState({});

    return (
        <div>
            <div className="card">
                <Table {...{ setChefParcForm, setYesNo }} />
                <ChefParcForm {...{ chefParcform, setYesNo }} />
                <Confirmation {...yesNo} />
            </div>

        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setChefParcForm, setYesNo } = props;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        DemandeService.get((data, status) => {
            setLoading(false);
            if (status) setItems(data);
        },
            { size: itemPerPage }
        );
    }

    const showDemandeDetails = (item) => {
        setChefParcForm({
            visible: true,
            hide: () => setChefParcForm((prev) => ({ ...prev, visible: false })),
            data: item,
            setData: (data) => setChefParcForm((prev) => ({ ...prev, data })),
            callback: () => {
                setLoading(true);
                loadItems();
            }
        })
    }

    const table = (
        <DataTable dataKey="id" value={items}
            paginator rows={itemPerPage}
            loading={loading} globalFilter={globalFilter}
            responsiveLayout="scroll" emptyMessage="Aucune donnée disponible.">

            <Column field="id" header="Identifiant" sortable hidden />
            {/* <Column field="dateDemande" header="Date de demande" sortable 
                    body={(item)=> new Date(item.dateDemande).toLocaleDateString()}/> */}
            <Column field="utilisateur.nom" header="Demandeur" sortable body={(selectedItem) =>
                selectedItem.utilisateur && (selectedItem.utilisateur.nom + " "
                    + selectedItem.utilisateur.prenom)
            } />
            <Column field="lieu.libelle" header="Lieu" sortable />
            {/* <Column field="nbreParticipant" header="Nombre de participants" sortable /> */}
            <Column field="nbreVehicule" header="Nombre de véhicules" sortable style={{ fontWeight: 'bold' }} />
            <Column field="dateDebutActivite" header="Date début de l'activité" sortable
                body={(item) => new Date(item.dateDebutActivite).toLocaleDateString()} />
            <Column field="dateFinActivite" header="Date fin de l'activité" sortable
                body={(item) => new Date(item.dateFinActivite).toLocaleDateString()} />

            <Column field="etat" header="Etat" sortable body={(item) =>
                <span className={`customer-badge status-${item.etat === 'ACCEPTEE'
                    ? 'qualified'
                    : (item.etat === 'APPROUVEE' ? 'new'
                        : item.etat === 'REJETEE' ? 'unqualified' : 'proposal')}`}>
                    {item.etat}
                </span>
            } />
            <Column body={(selectedItem) =>
                <div className="flex justify-content-end">
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"
                        onClick={() => showDemandeDetails(selectedItem)} />
                </div>
            } />
        </DataTable>
    );

    return (
        <>
            <h5>Liste des demandes</h5>
            <Toolbar className="mb-4"
                right={
                    <React.Fragment>
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" placeholder="Recherche..."
                                onInput={(e) => setGlobalFilter(e.target.value)} />
                        </span>
                    </React.Fragment>
                } />

            <TabView activeIndex={activeIndex} onTabChange={(e) => { setActiveIndex(e.index);/* alert(e.index)*/ }} >
                <TabPanel header="Demandes en traitement">{table}</TabPanel>
                <TabPanel header="Demandes traitées">{table}</TabPanel>
            </TabView>
        </>
    );
}

const ChefParcForm = (props) => {
    const { visible, hide, data, setData, callback } = props.chefParcform;
    const { setYesNo } = props;
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [lieux, setLieux] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();

    const [vehicules, setVehicules] = useState([]);
    const [chauffeurs, setChauffeurs] = useState([]);

    const [reponse, setReponse] = useState({
        coupleVehiculeCva : [], 
        demandeVehiculeId: 0, 
        observation: null
    });

    useEffect(() => {
        setActiveIndex(0);
        history.replace("/traitement/step1")
        if (!visible) return;
    }, [visible])

    useEffect(()=> {
        if(!visible) return;
        loadVehicules();
        loadChauffeurs()
    }, [visible]);

    const loadVehicules = () => {
        VehiculeService.get((data)=> data && setVehicules(data), {size: pageMaxSize})
    }
    const loadChauffeurs = ()=>{
        CvaService.get((data)=> data && setChauffeurs(data), {size: pageMaxSize})
    }

    const addChoice = (e)=>{
        const data2 = data;
       console.log(JSON.stringify(data2, null, 2));
       //alert(data.lieu.libelle)
    }

    const bind = (e) => {
        //console.log(JSON.stringify(reponse, null, 2))
        if (e.target.value !== undefined) {
            let value = e.target.value;
            setReponse({ ...reponse, [e.target.id]: value });
        }
        else if (e.checked !== undefined) {
            setReponse({ ...reponse, [e.target.id]: e.target.checked });
        } else {
            alert("Binding fails.")
        }
    }

    const goBack = (e) => {
        if (activeIndex === 1) {
            setActiveIndex(0);
            history.replace("/traitement/step1")
        } else {
            hide(e);
        }
    }

    const goNext = (e) => {
        if (activeIndex !== 1) {
            setActiveIndex(1);
            history.replace("/traitement/step2")
            return true;
        }
        return false;
    }

    const goNext2 = (e)=>{
        if (activeIndex !== 1) {
            setActiveIndex(1);
            history.replace("/traitement/step3")
        }
    }
    const submit = (e) => {
        if(goNext()) return;
        console.log(JSON.stringify(data, null, 2))

        /*
        let currentUser = JSON.parse(localStorage.getItem('user'));
        let request = {...data, utilisateur : {id: currentUser.utilisateur.id }}
        setYesNo(
            {   
                visible: true,
                message : data.id ? "Confirmez-vous la modification ?" : "Confirmez-vous l'ajout ?",
                hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
                callback : ()=> {
                    setLoading(true);
                    let onResponse = (data, status)=> {
                            setLoading(false);
                            if(!status) return;
                            hide();
                            callback();
                    }
                    //console.log(JSON.stringify(data, null, 2))
                    if(data.id) DemandeService.update(request, onResponse); 
                    else DemandeService.add(request, onResponse);
                },
            }
        )
            */
    }

    const step1Form = (
        <div className='p-fluid'>
            <div className="field" hidden>
                <label htmlFor="id">Identifiant</label>
                <InputText id="id" value={data && data.id} />
            </div>
            <div className="field" >
                <label htmlFor="dateDemande">Date de demande</label>
                <InputText id="dateDemande" value={data && data.dateDemande} 
                    mask="99/99/9999"  required readOnly/>
            </div>
            <div className="field" >
                <label htmlFor="lieu">Lieu</label>
                <InputText id="lieu" value={data?.lieu.libelle} readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreParticipant">Nombre de participants</label>
                <InputNumber id="nbreParticipant" value={data && data.nbreParticipant} 
                    required readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreVehicule">Nombre de véhicules</label>
                <InputNumber id="nbreVehicule" value={data && data.nbreVehicule} 
                    required readOnly/>
            </div>
            <div className="field">
                <label htmlFor="dateDebutActivite">Date début de l'activité</label>
                <InputText id="dateDebutActivite" value={data && data.dateDebutActivite} 
                    mask="99/99/9999" required readOnly />
                    
            </div>
            <div className="field">
                <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                <InputText id="dateFinActivite" value={data && data.dateFinActivite} 
                    mask="99/99/9999" required readOnly/>
            </div>
        </div>
    )

    const step2Form = (
        <div className='p-fluid'>
           <div className="field">
                <label htmlFor="immatriculation">Véhicules</label>
                <MultiSelect id="immatriculation" options={vehicules} value={data?.immatriculation} 
                    onChange={bind}
                    optionLabel="immatriculation" 
                    placeholder="Aucune option selectionéé" 
                    />
            </div>
            <div className="field">
                <label htmlFor="chauffeur">Chauffeurs</label>
                <MultiSelect id="nom" options={chauffeurs} value={data?.nom} 
                    onChange={bind}
                    optionLabel={(data)=> data.nom + " " + data.prenom}
                    placeholder="Aucune option selectionéé" 
                    />
            </div>
            <div className="field">
                <Button label="Ajouter" className="mr-2 mb-2" onClick={addChoice}/>
            </div>
            <DataTable dataKey="id" value={vehicules} responsiveLayout="scroll" 
                paginator rows={10}>
                <Column field="immatriculation" header="Immatriculation"></Column>
                <Column field="marque" header="Marque"></Column>
                <Column field="nbrePlace" header="Nombre de places"></Column>
                <Column field="" header="Chauffeurs" ></Column>   
            </DataTable>
            
        </div>
    )

    const[val, setVal] = useState();
    const step3Form = (
        <div className='p-fluid'>
            <div className="field" >
                <label htmlFor="observation">Observation</label>
                <InputText id="observation" value={val} onChange={(e)=> setVal(e.target.value)}
                    required  />
                {/* <InputTextarea id="observation" value={reponse?.observation} onChange={bind} autoResize required /> */}
            </div>
        </div>
        
    )

    return (
        <Dialog visible={visible} style={{ width: '800px' }} modal className="p-fluid"
            header={
                <div className='flex flex-row align-items-center'>
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text mr-2"
                        onClick={goBack} />
                    <h5 className='m-0'>Traitement demande</h5>
                </div>
            }
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide} />
                    {activeIndex === 0 &&
                        <Button icon="pi pi-ban" className="p-button-danger p-button-text" 
                            label={ "Rejeter" }
                            onClick={goNext2}  
                            />
                    }
                    <Button className="p-button-text" loading={loading}
                        label={activeIndex === 1 ? "Terminer" : "Continuer"}
                        icon={`pi pi-${activeIndex === 1 ? "check" : "angle-right"}`}
                        iconPos={`${activeIndex === 1 ? "left" : "right"}`}
                        onClick={submit} />
                </>
            }
            onHide={hide}
        >
            <Steps className='mt-1'
                model={[
                    { label: 'Détails demande', command: () => history.push('/traitement/step1') },
                    { label: 'Ajout véhicules', command: () => history.push('/traitement/step2') }
                ]}
                activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true}
            />
            
                <Route path={'/traitement/step1'} exact
                    component={() => <div className='mt-5'>{step1Form}</div>} />
                <Route path={'/traitement/step2'}
                    component={() => <div className='mt-5'>{step2Form}</div>} />
                <Route path={'/traitement/step3'}
                    component={() => <div className='mt-5'>{step3Form}</div>} />
        </Dialog>
    )
}

const Confirmation = (props) => {
    const { visible, hide, message, callback } = props;

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

{/*
return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails de la demande" modal className="p-fluid" 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide}  />
                    <Button label="Continuer" icon="pi pi-check" className="p-button-text"  loading={loading} />
                    </>
                } 
                onHide={hide}
                >  
    
                <TabView visible={visible} onHide={hide} >
                    <TabPanel header="Demandes initiées" >
                        <DataTable dataKey="id" value={items}>
                            <Column field="utilisateur.nom" header="Demandeur" sortable body= { (selectedItem)=>
                            selectedItem.utilisateur && (selectedItem.utilisateur.nom + " " 
                            + selectedItem.utilisateur.prenom)
                            } />
                            <Column field="etat" sortable body={ (item)=> 
                                <span className={`customer-badge status-${item.etat === 'ACCEPTEE'
                                        ? 'qualified' 
                                        : (item.etat === 'APPROUVEE' ? 'new' 
                                        : item.etat === 'REJETEE' ? 'unqualified' :  'proposal')}`}>
                                    {item.etat}
                                </span>
                            } />
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Demandes approuvées">
                    </TabPanel>
                </TabView>
            </Dialog>    
        )
*/}


export default Traitement;