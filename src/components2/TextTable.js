import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../service2/ProductService';

export default function TextTable() {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsSmall().then(data => {
            setProducts(data); 
            setLoading(false);
        });
    }, []);
    
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="col-12">
            <div className="card">
                <h5>Recent Sales</h5>
                <DataTable value={products} rows={10} paginator responsiveLayout="scroll"  
                className="p-datatable-gridlines" showGridlines
                loading={loading} >
                    <Column header="Image" body={(data) => <img className="shadow-2" src={`assets/demo/images/product/${data.image}`} alt={data.image} width="50"/>}/>
                    <Column field="name" header="Name" sortable style={{width: '35%'}}/>
                    <Column field="price" header="Price" sortable style={{width: '35%'}} body={(data) => formatCurrency(data.price)}/>
                    <Column header="View" style={{width:'15%'}} body={() => (
                        <>
                            <Button icon="pi pi-search" type="button" className="p-button-text"/>
                        </>
                    )}/>
                </DataTable>
            </div>
        </div>
    )
}
