/**
 * Inline script for <head>: a visitor who chose another language last time
 * gets the language set at once and the page held invisible until the
 * translation is in (LanguageContext removes the class). The CSS releases
 * it after 2.5 s regardless, so a failed fetch never leaves a blank page.
 */
export const I18N_BOOT = `(function(){try{var l=localStorage.getItem('sos_lang');if(l==='en'){var d=document.documentElement;d.lang=l;d.classList.add('i18n-wait')}else if(l){localStorage.removeItem('sos_lang')}}catch(e){}})();`;
