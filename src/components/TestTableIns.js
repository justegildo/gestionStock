import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function TestTableIns() {
    const [APIData, setAPIData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const axios = require('axios');
        axios.get('https://ms-parc.herokuapp.com/api/crud/institution/get?', {
            params: {
                size: 3
              }
        })
            .then(function (response) {
                console.log(JSON.stringify(response.data, null, 2));
                setAPIData(response.data); 
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            })

    }, []);
    
    //<!-- className="p-datatable-gridlines" showGridlines --> 
    return (
        <div className="col-12">
            <div className="card">
                <h5>Recent Sales</h5>
                <DataTable value={APIData} rows={10} paginator responsiveLayout="scroll"  
                    loading={loading} >
                    <Column field="id" header="Matricule" sortable style={{width: '10%', textAlign: 'center'}} />
                    <Column field="libelle" header="Libellé" sortable style={{width: '50%', fontWeight: 'bold'}} />
                    <Column field="nomResponsable" header="Responsable" sortable style={{width: '20%'}}/>
                    <Column  body={() => (
                        <>
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-1"/>
                            <Button icon="pi pi-trash" className="p-button-danger" type="button"/>
                        </>
                    )}/>
                </DataTable>
            </div>
        </div>
    )
}

