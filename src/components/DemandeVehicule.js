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
import { Route, useHistory } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import { Steps } from 'primereact/steps';


const DemandeVehicule = () => {
    const [yesNo, setYesNo] = useState({});
    const [form, setForm] = useState({});
    const [readOnlyForm, setReadOnlyForm] = useState({});

    return (
        <div>
            <div className="card">
                <Table {...{setForm, setReadOnlyForm, setYesNo}} />
                <Form {...{form, setYesNo}} />
                <ReadOnlyForm {...{ readOnlyForm, setYesNo }} />  
                <Confirmation {...yesNo} />
            </div>
            
        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const {setForm, setReadOnlyForm, setYesNo} = props; 

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        DemandeService.get((data, status) => {
                setLoading(false);
                if(status) setItems(data);  
            },
            {size: itemPerPage}
        );
    }

    const openNew = () => {
        setForm({
            visible: true,
            hide: ()=> setForm((prev)=>({...prev, visible: false})),
            data: null,
            setData: (data)=> setForm((prev)=>({...prev, data})),
            callback: ()=> {
                setLoading(true);
                loadItems();
            }
        });
        console.log(items)
    }

    const editItem = (item) => {
        setForm({
            visible: true,
            hide: ()=> setForm((prev)=>({...prev, visible: false})),
            data: item,
            setData: (data)=> setForm((prev)=>({...prev, data})),
            callback: ()=> {
                setLoading(true);
                loadItems();
            }
        })
    }

    const deleteItem = (item) => {
        setYesNo({   
            visible: true,
            message : "Confirmez-vous la suppression ?",
            hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
            callback : ()=> {
                setLoading(true);
                DemandeService.delete(item.id, (data, status)=>{
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }
    
    const showReponse = (item) => {
        setReadOnlyForm({
            visible: true,
            hide: () => setReadOnlyForm((prev) => ({ ...prev, visible: false })),
            data: item,
            setData: (data) => setReadOnlyForm((prev) => ({ ...prev, data })),
            callback: () => {
                setLoading(true);
                loadItems();
            }
        })
    }

    return (
        <>
            <h5>Liste des demandes</h5>
            <Toolbar className="mb-4" 
                left={
                    <React.Fragment>
                        <div className="my-2">
                            <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2" 
                                onClick={openNew} />
                            <Button label="Actualiser" icon="pi pi-refresh" className="p-button-primry mr-2" 
                                onClick={()=>{setLoading(true); loadItems()}} />
                        </div>
                    </React.Fragment>
                }
                right={
                    <React.Fragment>
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" placeholder="Recherche..." onInput={(e) => setGlobalFilter(e.target.value)} />
                        </span>
                    </React.Fragment>
                } />
            <DataTable dataKey="id" value={items} 
                paginator rows={itemPerPage}  
                loading={loading} globalFilter={globalFilter} 
                responsiveLayout="scroll" emptyMessage="Aucune donnée disponible.">

                <Column field="id" header="Identifiant" sortable  hidden />
                <Column field="dateDemande" header="Date de demande" sortable 
                    body={(item)=> new Date(item.dateDemande).toLocaleDateString()}/>
                <Column field="utilisateur.nom" header="Demandeur" sortable body= { (selectedItem)=>
                    selectedItem.utilisateur && (selectedItem.utilisateur.nom + " " 
                    + selectedItem.utilisateur.prenom)
                } />
                <Column field="lieu.libelle" header="Lieu" sortable />
                <Column field="nbreParticipant" header="Nombre de participants" sortable body={item=>item.nbreParticipant.toLocaleString()} />
                <Column field="nbreVehicule" header="Nombre de véhicules" sortable style={{fontWeight: 'bold'}} body={item=>item.nbreVehicule.toLocaleString()} />
                <Column field="dateDebutActivite" header="Date début de l'activité" sortable 
                    body={(item)=> new Date(item.dateDebutActivite).toLocaleDateString()} />
                <Column field="dateFinActivite" header="Date fin de l'activité" sortable 
                    body={(item)=> new Date(item.dateFinActivite).toLocaleDateString()}/>

                <Column field="etatDemande" header="Etat de la demande" sortable body={ (item)=> 
                    <span className={`customer-badge status-${item.etatDemande === 'ACCEPTEE'
                            ? 'qualified' 
                            : (item.etatDemande === 'APPROUVEE' ? 'new' 
                            : item.etatDemande === 'REJETEE' ? 'unqualified' :  'proposal')}`}>
                        {item.etatDemande}
                    </span>
                } />
                <Column body={ (selectedItem)=>
                selectedItem.etatDemande === "INITIEE"
                ?   <div className="flex justify-content-end">
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editItem(selectedItem)}/>
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={()=> deleteItem(selectedItem)}/>
                    </div>
                :   <div className="flex justify-content-end">
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-primary mr-2" onClick={() => showReponse(selectedItem)} />
                    </div>    
                } />
            </DataTable>
        </>
    );
}

const Form = (props) => {
    const {visible, hide, data, setData, callback } = props.form;
    const {setYesNo} = props;
    const[loading, setLoading] = useState(false);

    const [lieux, setLieux] = useState([]);

    useEffect(()=> {
        if(!visible) return;
        LieuService.get((data)=> data && setLieux(data), {size: pageMaxSize})
    }, [visible])
    
    const bind = (e) => {
        if(e.target.value !== undefined) {
            let value = e.target.value;
            setData({...data, [e.target.id]: value});
        }
        else if(e.checked !== undefined) {
            setData({...data, [e.target.id]: e.target.checked});
        }else{
            alert("Binding fails.")
        }
    }
    
    const submit = () => {
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
                    if(data.id) DemandeService.update(request, onResponse); 
                    else DemandeService.add(request, onResponse);
                },
            }
        )
    
    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails de la demande" modal className="p-fluid" 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide}  />
                    <Button label="Valider" icon="pi pi-check" className="p-button-text" onClick={submit} loading={loading} />
                </>
            } 
            onHide={hide}
            >  
                <div className="field" hidden>
                    <label htmlFor="id">Identifiant</label>
                    <InputText id="id" value={data?.id} onChange={bind} />
                </div>
                <div className="field" >
                    <label htmlFor="lieu">Lieu</label>
                    <Dropdown id="lieu" options={lieux} value={data?.lieu} onChange={bind}
                        optionLabel="libelle" /*optionValue="id"*/  
                        placeholder="Aucune sélection"/>
                </div>
                <div className="field" hidden>
                    <label htmlFor="dateDemande">Date de demande</label>
                    <Calendar id="dateDemande" value={data && new Date(data.dateDemande)} 
                        onChange={bind}  mask="99/99/9999" required  />
                </div>
                <div className="field">
                    <label htmlFor="nbreParticipant">Nombre de participants</label>
                    <InputNumber id="nbreParticipant" value={data?.nbreParticipant} 
                        onValueChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="nbreVehicule">Nombre de véhicules</label>
                    <InputNumber id="nbreVehicule" value={data?.nbreVehicule} 
                        onValueChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="dateDebutActivite">Date début de l'activité</label>
                    <Calendar id="dateDebutActivite" value={data && new Date(data.dateDebutActivite)} 
                        onChange={bind} mask="99/99/9999" required />
                </div>
                <div className="field">
                    <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                    <Calendar id="dateFinActivite" value={data && new Date(data.dateFinActivite)} 
                        onChange={bind} mask="99/99/9999" required  />
                </div>
            </Dialog>
    )
}

const ReadOnlyForm = (props) => {
    const { visible, hide, data, setData, readOnly, callback } = props.readOnlyForm;
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepCount, setStepCount] = useState(0);
    
    const [coupleVehiculeChauffeurs, setCoupleVehiculeChauffeurs] = useState([]);
    const [observation, setObservation] = useState();

    useEffect(() => {
        if (!visible) return;
        setCoupleVehiculeChauffeurs([]);
        //
        computeStepCount();
        setActiveIndex(0);
        history.replace("/demande")
        //
        setCoupleVehiculeChauffeurs(data.reponses.map(couple=>({vehicule: couple.vehicule, chauffeur: couple.cva})))
        setObservation(data.observation)
    }, [visible])

    const goBack = (e) => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex -1);
            history.replace("/demande")
        } else {
            hide(e);
        }
    }

    const goNext = (e) => {
        if (activeIndex !== (stepCount -1)) {
            setActiveIndex(1);
            history.replace("/demande/step2")
        }else{
            hide(e);
        }
    }

    const computeStepCount = () => {
        if(!data) return;
        if(data.etatDemande === 'INITIEE' || data.etatDemande === 'APPROUVEE')
            setStepCount(1);
        else
            setStepCount(2);
    }

    const step1Form = data && (
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

    const step2Form = data && (
        <div className='p-fluid'>
            {data.etatDemande === 'ACCEPTEE' &&
                <DataTable dataKey="id" value={coupleVehiculeChauffeurs} responsiveLayout="scroll" 
                    paginator rows={10}>
                    <Column field="vehicule.immatriculation" header="Immatriculation"></Column>
                    <Column field="vehicule.marque" header="Marque"></Column>
                    <Column field="vehicule.nbrePlace" header="Nombre de places"></Column>
                    <Column header="Chauffeur" body={(item)=> item.chauffeur.nom + " " + item.chauffeur.prenom}></Column>   
                </DataTable> 
            }
            {data.etatDemande === 'REJETEE' &&
               <div className='p-fluid'>
                    <div className="field" >
                        <label htmlFor="observation">Observation</label>
                        <InputTextarea id="observation" value={observation} onChange={(e)=>setObservation(e.target.value)} 
                            readOnly autoResize autoFocus required />
                    </div>
                </div>
            }
        </div>
    )
    
    return ( !data ? null :
        <Dialog visible={visible} style={{ width: '800px' }} modal className="p-fluid"
            header={
                <div className='flex flex-row align-items-center'>
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text mr-2"
                        onClick={goBack} />
                    <h5 className='m-0'>Réponse à la demande</h5>
                </div>
            }
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide} />
                    <Button className="p-button-text" loading={loading}
                        label={activeIndex === (stepCount-1) ? "Terminer" : "Continuer"}
                        icon={`pi pi-${activeIndex === (stepCount-1) ? "check" : "angle-right"}`}
                        iconPos={`${activeIndex === (stepCount-1) ? "left" : "right"}`}
                        onClick={goNext} />
                </>
            }
            onHide={hide} >

            <Steps className='mt-1'
                model={[
                    { label: 'Détails demande', command: () => history.push('/demande') },
                    { ...(stepCount > 1) && 
                        {
                            label: `${data.etatDemande === 'REJETEE' ? "Observation" : 'Véhicules'}`, 
                            command: () => history.push('/demande/step2') 
                        }
                    }
                ]}
                activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} 
                />
            
            <Route path={'/demande'} exact render={() => <div className='mt-5'>{step1Form}</div>} />
            <Route path={'/demande/step2'} render={() => <div className='mt-5'>{step2Form}</div>} />
            
        </Dialog>
    )
}

const Confirmation = (props) => {
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

export default DemandeVehicule;