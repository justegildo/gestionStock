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
        if (typeof value == "string") {
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

    objectProperties(obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        console.log(keys)
    }

    objectOwnedAttributes(obj) {
        var keys1 = Object.keys(obj);
        var keys2 = Object.getOwnPropertyNames(obj);
    }

    showArguments(callback) {
        var original = callback;
        callback = function () {
            // Do something with arguments:
            console.log(arguments);
            alert(JSON.stringify(arguments, null, 2));
            return original.apply(this, arguments);
        };
        callback("pierre", "jean", "jacques")
    }
    /*
    showArguments(callback) {
        let argCount = callback;
        alert(JSON.stringify(argCount, null, 2));
    }
    */

    dynamicExport1() {
        let fs = require('fs');
        fs.readdir('./someDir', (err, files) => {
            files.forEach(file => {
             const module = import('./' + file).then(m => {
                //m.callSomeMethod();
             });
             // or const module = await import('file')
             });
           });

    }

    dynamicExport2() {
        // require all modules on the path and with the pattern defined
        const req = require.context('./', true, /.js$/);

        const modules = req.keys().map(req);

        // export all modules
        module.exports = modules;
    }
}