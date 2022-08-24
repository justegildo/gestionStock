// import { CommonService } from '../util/CommonService';
// const commonService = new CommonService();

export class CommonService {

    log(data) {
        console.log(JSON.stringify(data, null, 2));
    }

    log2(data) {
        console.table(JSON.stringify(data));
    }
    
    show(data) {
        alert(data);
    }

    dateToString(value) {
        if(typeof value == "string") {
            value = new Date(value);
        }
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })  
    }
    
    currencyToStringUS(value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    currencyToString(value) {
        return value.toLocaleString('fr', { style: 'currency', currency: 'XOF' });
    }

    safeArray(data) {
        return [...data || []];
    }

    testSafeArray(data) {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
    }
}