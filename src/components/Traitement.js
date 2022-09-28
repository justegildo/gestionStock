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
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import VehiculeService from '../services/VehiculeService';
import CvaService from '../services/CvaService';
import ReponseService from '../services/ReponseService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';


const Traitement = () => {
    const [yesNo, setYesNo] = useState({});
    const [chefParcForm, setChefParcForm] = useState({});
    const [responsableStructureForm, setResponsableStructureForm] = useState({});

    return (
        <div>
            <div className="card">
                <Table {...{ setChefParcForm, setYesNo }} />
                <ChefParcForm {...{ chefParcForm, setYesNo }} />
                <ResponsableStructureForm {...{ responsableStructureForm, setYesNo }} />
                <Confirmation {...yesNo} />
            </div>

        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const {setChefParcForm, setYesNo} = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [filters1, setFilters1] = useState(null);
    const [filters2, setFilters2] = useState(null);
    const [filters3, setFilters3] = useState(null);

    useEffect(() => {
        loadItems();
        //initFilters1();
    }, [activeIndex]);

    const loadItems = () => {
        setLoading(true);
        let onResponse = (data, status) => {
            setLoading(false);
            if (status) setItems(data);
        };
        let etatDemande;
        if(activeIndex === 0) etatDemande = "INITIEE";
        if(activeIndex === 1) etatDemande = "ACCEPTEE";
        if(activeIndex === 2) etatDemande = "REJETEE";
        DemandeService.get(onResponse, { etatDemande, size: itemPerPage });
    }
    
    const processDemandeDetails = (item) => {
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

    const showDemandeDetails = (item) => {
        setChefParcForm({
            visible: true,
            hide: () => setChefParcForm((prev) => ({ ...prev, visible: false })),
            data: item,
            setData: (data) => setChefParcForm((prev) => ({ ...prev, data })),
            readOnly: true,
            callback: () => {
                setLoading(true);
                loadItems();
            }
        })
    }

    /*
    const initFilters1 = () => {
        setFilters1({
            'etatDemande': { operator: FilterOperator.AND, 
                constraints: [{ value: 'INITIEE', matchMode: FilterMatchMode.EQUALS }] },
        });
    }
    */

    const table = (
        <DataTable dataKey="id" value={items}
            paginator rows={itemPerPage}
            //filters={filters1}
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

            <Column field="etatDemande" header="Etat" sortable body={(item) =>
                <span className={`customer-badge status-${item.etatDemande === 'ACCEPTEE'
                    ? 'qualified'
                    : (item.etatDemande === 'APPROUVEE' ? 'new'
                        : item.etatDemande === 'REJETEE' ? 'unqualified' : 'proposal')}`}>
                    {item.etatDemande}
                </span>
            } />
            {activeIndex == 0 
            ?   <Column body={(selectedItem) =>
                    <div className="flex justify-content-end">
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"
                            onClick={() => processDemandeDetails(selectedItem)} />
                    </div>
                } />
            :   <Column body={(selectedItem) =>
                    <div className="flex justify-content-end">
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"
                            onClick={() => showDemandeDetails(selectedItem)} />
                    </div>
                } />
            }    
        </DataTable>
    );
    
    return (
        <>
            <h5>Liste des demandes</h5>
            <Toolbar className="mb-4"
                left={
                    <>
                        <div className="my-2">
                            <Button label="Actualiser" icon="pi pi-refresh" className="p-button-primry mr-2" 
                                onClick={()=>{setLoading(true); loadItems()}} />
                        </div>
                    </>
                }
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
                <TabPanel header="Demandes rejetées">{table}</TabPanel>
            </TabView>
        </>
    );
}

const ChefParcForm = (props) => {
    const { visible, hide, data, setData, readOnly, callback } = props.chefParcForm;
    const { setYesNo } = props;
    const history = useHistory();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    
    const [vehicules, setVehicules] = useState([]);
    const [chauffeurs, setChauffeurs] = useState([]);

    const [selectedCoupleVehiculeChauffeur, setSelectedCoupleVehiculeChauffeur] = useState();
    const [coupleVehiculeChauffeurs, setCoupleVehiculeChauffeurs] = useState([]);
    const [observation, setObservation] = useState();

    const [acceptanceScreen, onAcceptanceScreen] = useState(false);

    useEffect(() => {
        if (!visible) return;
        loadVehicules();
        loadChauffeurs();
        setCoupleVehiculeChauffeurs([]);
        //
        setActiveIndex(0);
        history.replace("/traitement")
        //
        readOnly && setCoupleVehiculeChauffeurs(data.reponses.map(couple=>({vehicule: couple.vehicule, chauffeur: couple.cva})))
        readOnly && setObservation(data.observation)
    }, [visible])

    const loadVehicules = () => {
        VehiculeService.get((data)=> data && setVehicules(data), {size: pageMaxSize})
    }
    const loadChauffeurs = ()=>{
        CvaService.get((data)=> data && setChauffeurs(data), {size: pageMaxSize})
    }

    const goBack = (e) => {
        if (activeIndex === 1) {
            setActiveIndex(0);
            history.replace("/traitement")
        } else {
            hide(e);
        }
    }

    const goNext = (e) => {
        if (activeIndex !== 1) {
            setActiveIndex(1);
            onAcceptanceScreen(true);
            history.replace("/traitement/step2")
            return true;
        }
        return false;
    }

    const goNext2 = (e)=>{
        if (activeIndex !== 1) {
            setActiveIndex(1);
            onAcceptanceScreen(false);
            history.replace("/traitement/step3")
        }
    }

    const addChoice = ()=>{
        if(!selectedCoupleVehiculeChauffeur) return;
        let items = [...coupleVehiculeChauffeurs, ...[selectedCoupleVehiculeChauffeur]];
        setCoupleVehiculeChauffeurs(items);
        setSelectedCoupleVehiculeChauffeur(null);
    }

    const removeSelectedCoupleVehiculeChauffeur = (selectedCoupleVehiculeChauffeur)=> {
        let index = coupleVehiculeChauffeurs.indexOf(selectedCoupleVehiculeChauffeur);
        coupleVehiculeChauffeurs.splice(index, 1);
        setCoupleVehiculeChauffeurs([...coupleVehiculeChauffeurs]);
    }

    const submit = (e) => {
        if(goNext()) return;
        let payload;
        if(acceptanceScreen) {
            let tmpCoupleVehiculeChauffeurs = coupleVehiculeChauffeurs
                .map(item=> ({cvaId: item.chauffeur.id, vehiculeId: item.vehicule.id}));

            payload = {demandeVehiculeId: data.id, coupleVehiculeCva: tmpCoupleVehiculeChauffeurs};    
        }
        //console.log(JSON.stringify(payload, null, 2))
        setYesNo(
            {
                visible: true,
                message : "Confirmez-vous l'ajout ?",
                hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
                callback : ()=> {
                    setLoading(true);
                    let onResponse = (data, status)=> {
                            setLoading(false);
                            if(!status) return;
                            hide();
                            callback();
                    }
                    if(acceptanceScreen) ReponseService.save(payload, onResponse); 
                    else DemandeService.updateEtat(onResponse, {demandeId: data.id, nouvelEtat: "REJETEE", observation: observation})
                }
            }
        )
    }

    const step1Form = (
        <div className='p-fluid'>
            <div className="field" hidden>
                <label htmlFor="id">Identifiant</label>
                <InputText id="id" value={data?.id} />
            </div>
            <div className="field" >
                <label htmlFor="dateDemande">Date de demande</label>
                <Calendar id="dateDemande" value={data && new Date(data.dateDemande)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
            </div>
            <div className="field" >
                <label htmlFor="lieu">Lieu</label>
                <InputText id="lieu" value={data?.lieu?.libelle} readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreParticipant">Nombre de participants</label>
                <InputNumber id="nbreParticipant" value={data?.nbreParticipant} 
                    required readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreVehicule">Nombre de véhicules</label>
                <InputNumber id="nbreVehicule" value={data?.nbreVehicule} readOnly/>
            </div>
            <div className="field">
                <label htmlFor="dateDebutActivite">Date début de l'activité</label>
                <Calendar id="dateDebutActivite" value={data && new Date(data.dateDebutActivite)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
                    
            </div>
            <div className="field">
                <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                <Calendar id="dateFinActivite" value={data && new Date(data.dateFinActivite)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
            </div>
        </div>
    )

    const step2Form = (
        <div className='p-fluid'>
            {!readOnly 
            ? 
            <>
                <div className="field">
                    <label htmlFor="immatriculation">Véhicules</label>
                    <Dropdown id="vehicule" onChange={(e)=> {setSelectedCoupleVehiculeChauffeur({...selectedCoupleVehiculeChauffeur, vehicule: e.value})}}
                        placeholder="Aucune sélection"
                        options={vehicules}
                        value={selectedCoupleVehiculeChauffeur?.vehicule}
                        optionLabel="immatriculation" />
                </div>
                <div className="field">
                    <label htmlFor="chauffeur">Chauffeurs</label>
                    <Dropdown id="chauffeur" onChange={(e)=> {setSelectedCoupleVehiculeChauffeur({...selectedCoupleVehiculeChauffeur, chauffeur: e.value})}}
                        placeholder="Aucune sélection"
                        options={chauffeurs} 
                        value={selectedCoupleVehiculeChauffeur?.chauffeur}
                        optionLabel={(data)=> data.nom + " " + data.prenom} />
                </div>
                <div className="field">
                    <Button label="Ajouter" className="my-2" onClick={addChoice} />
                </div>
     
                <DataTable dataKey="id" value={coupleVehiculeChauffeurs} responsiveLayout="scroll" 
                    paginator rows={10}>
                    <Column field="vehicule.immatriculation" header="Immatriculation"></Column>
                    <Column field="vehicule.marque" header="Marque"></Column>
                    <Column field="vehicule.nbrePlace" header="Nombre de places"></Column>
                    <Column header="Chauffeur" body={(item)=> item.chauffeur.nom + " " + item.chauffeur.prenom}></Column>
                    <Column body={ (selectedItem)=>
                        <div className="flex justify-content-end">
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" 
                                onClick={()=> removeSelectedCoupleVehiculeChauffeur(selectedItem)} />
                        </div>
                    } />   
                </DataTable>
            </>
            :(
                data.etatDemande === 'REJETEE' 
                ?   <div className='p-fluid'>
                        <div className="field" >
                            <label htmlFor="observation">Observation</label>
                            <InputTextarea id="observation" value={observation} onChange={(e)=>setObservation(e.target.value)} 
                                readOnly autoResize autoFocus required />
                        </div>
                    </div>
                :
                   <DataTable dataKey="id" value={coupleVehiculeChauffeurs} responsiveLayout="scroll" 
                        paginator rows={10}>
                        <Column field="vehicule.immatriculation" header="Immatriculation"></Column>
                        <Column field="vehicule.marque" header="Marque"></Column>
                        <Column field="vehicule.nbrePlace" header="Nombre de places"></Column>
                        <Column header="Chauffeur" body={(item)=> item.chauffeur.nom + " " + item.chauffeur.prenom}></Column>   
                    </DataTable> 
            )
        }
        </div>
    )

    const step3Form = (
        <div className='p-fluid'>
            <div className="field" >
                <label htmlFor="observation">Observation</label>
                <InputTextarea id="observation" value={observation} onChange={(e)=>setObservation(e.target.value)} autoResize autoFocus required />
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
            onHide={hide} >

            <Steps className='mt-1'
                model={[
                    { label: 'Détails demande', command: () => history.push('/traitement') },
                    { 
                        label: `${location.pathname === "/traitement/step3" ? "Observation" : 'Ajout véhicules'}`, 
                        command: () => history.push('/traitement/step2') 
                    }
                ]}
                activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} 
                />
            
            <Route path={'/traitement'} exact render={() => <div className='mt-5'>{step1Form}</div>} />
            <Route path={'/traitement/step2'} render={() => <div className='mt-5'>{step2Form}</div>} />
            <Route path={'/traitement/step3'} render={() => <div className='mt-5'>{step3Form}</div>} />

        </Dialog>
    )
}


const ResponsableStructureForm = (props) => {
    const { visible, hide, data, setData, callback } = props.responsableStructureForm;
    const { setYesNo } = props;
    const history = useHistory();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    
    const [observation, setObservation] = useState();

    const [acceptanceScreen, onAcceptanceScreen] = useState(true);

    useEffect(() => {
        if (!visible) return;
        //
        setActiveIndex(0);
        history.replace("/traitement")
    }, [visible])

    const goBack = (e) => {
        if (activeIndex === 1) {
            setActiveIndex(0);
            history.replace("/traitement")
        } else {
            hide(e);
        }
    }

    const goNext2 = (e)=>{
        if (activeIndex !== 1) {
            setActiveIndex(1);
            onAcceptanceScreen(false);
            history.replace("/traitement/step2")
        }
    }

    const submit = (e) => {
        let payload;
        //console.log(JSON.stringify(payload, null, 2))
        setYesNo(
            {
                visible: true,
                message : "Confirmez-vous l'ajout ?",
                hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
                callback : ()=> {
                    setLoading(true);
                    let onResponse = (data, status)=> {
                            setLoading(false);
                            if(!status) return;
                            hide();
                            callback();
                    }
                    if(acceptanceScreen) ReponseService.save(payload, onResponse); 
                    else DemandeService.updateEtat(onResponse, {demandeId: data.id, nouvelEtat: "REJETEE", observation: observation})
                }
            }
        )
    }

    const step1Form = (
        <div className='p-fluid'>
            <div className="field" hidden>
                <label htmlFor="id">Identifiant</label>
                <InputText id="id" value={data?.id} />
            </div>
            <div className="field" >
                <label htmlFor="dateDemande">Date de demande</label>
                <Calendar id="dateDemande" value={data && new Date(data.dateDemande)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
            </div>
            <div className="field" >
                <label htmlFor="lieu">Lieu</label>
                <InputText id="lieu" value={data?.lieu?.libelle} readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreParticipant">Nombre de participants</label>
                <InputNumber id="nbreParticipant" value={data?.nbreParticipant} 
                    required readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreVehicule">Nombre de véhicules</label>
                <InputNumber id="nbreVehicule" value={data?.nbreVehicule} readOnly/>
            </div>
            <div className="field">
                <label htmlFor="dateDebutActivite">Date début de l'activité</label>
                <Calendar id="dateDebutActivite" value={data && new Date(data.dateDebutActivite)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
                    
            </div>
            <div className="field">
                <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                <Calendar id="dateFinActivite" value={data && new Date(data.dateFinActivite)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
            </div>
        </div>
    )

    const step2Form = (
        <div className='p-fluid'>
            <div className="field" >
                <label htmlFor="observation">Observation</label>
                <InputTextarea id="observation" value={observation} onChange={(e)=>setObservation(e.target.value)} autoResize autoFocus required />
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
                        label={activeIndex === 1 ? "Terminer" : "Approuver"}
                        icon="pi pi-check"
                        onClick={submit} />
                </>
            }
            onHide={hide} >

            <Steps className='mt-1'
                model={[
                    { label: 'Détails demande', command: () => history.push('/traitement') },
                    { 
                        label: "Observation", 
                        command: () => history.push('/traitement/step2') 
                    }
                ]}
                activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} 
                />
            
            <Route path={'/traitement'} exact render={() => <div className='mt-5'>{step1Form}</div>} />
            <Route path={'/traitement/step2'} render={() => <div className='mt-5'>{step2Form}</div>} />

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