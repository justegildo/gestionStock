import React, { useEffect, useRef, useState } from 'react';

import {
    locale,
    addLocale,
    updateLocaleOption,
    updateLocaleOptions,
    localeOption,
    localeOptions
  } from "primereact/api";

  import * as locales from "./primelocale/fr.json";

// https://codesandbox.io/s/primereact-locale-demo-wbnm5?file=/src/demo/LocaleDemo.js:1862-1893
export const LocaleComponent = () => {

    useEffect(() => {
        /*
        * PrimeReact has the options of 'en' locale.
        * Please see these options; https://www.primefaces.org/primefaces/showcase/#/locale
        */
        locale("fr"); // default locale.

        // Added new locale with its options
        addLocale("fr", locales["fr"]);

    }, []);
    
   
    return null;
};
