import { qs } from "./614a054d67c54ec6077ce6a0f5bf0ef2d7465233.js";
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function (...args) {
    window.dataLayer.push(args);
};
class ConsentConfig {
    ad_user_data;
    ad_personalization;
    ad_storage;
    analytics_storage;
    personalization;
    constructor(ad_user_data, ad_personalization, ad_storage, analytics_storage, personalization) {
        this.ad_user_data = ad_user_data;
        this.ad_personalization = ad_personalization;
        this.ad_storage = ad_storage;
        this.analytics_storage = analytics_storage;
        this.personalization = personalization;
    }
}
const CONSENT_STORAGE_KEY = 'consentSet';
function setupConsent(consentConfig) {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentConfig));
    window.gtag('consent', 'update', {
        ad_user_data: consentConfig.ad_user_data || 'denied',
        ad_personalization: consentConfig.ad_personalization || 'denied',
        ad_storage: consentConfig.ad_storage || 'denied',
        analytics_storage: consentConfig.analytics_storage || 'denied'
    });
    qs('#cookies-consent-analytics-checkbox').checked = consentConfig.analytics_storage === 'granted';
    qs('#cookies-consent-marketing-checkbox').checked = consentConfig.ad_storage === 'granted';
    qs('#cookies-consent-marketing-user-data-checkbox').checked = consentConfig.ad_user_data === 'granted';
    qs('#cookies-consent-marketing-personalization-checkbox').checked = consentConfig.ad_personalization === 'granted';
    qs('#cookies-consent-personalization-checkbox').checked = consentConfig.personalization === 'granted';
}
const consentConfigString = localStorage.getItem(CONSENT_STORAGE_KEY);
const consentPopupClassList = qs('#gtag-cookies-consent-offcanvas')?.classList;
if (consentConfigString) {
    setupConsent(JSON.parse(consentConfigString));
}
else {
    consentPopupClassList?.add('show');
}
qs('#accept-all-cookies-button')?.addEventListener('click', () => {
    const consentConfigGranted = new ConsentConfig('granted', 'granted', 'granted', 'granted', 'granted');
    setupConsent(consentConfigGranted);
});
qs('#deny-all-cookies-button')?.addEventListener('click', () => {
    const consentConfigDenied = new ConsentConfig('denied', 'denied', 'denied', 'denied', 'denied');
    setupConsent(consentConfigDenied);
});
qs('#configure-cookies-button')?.addEventListener('click', () => {
    const container = qs('#offcanvas-body-container');
    if (!container) {
        return;
    }
    for (const child of Array.from(container.children)) {
        child.classList.remove('visually-hidden');
    }
});
qs('#save-user-preferences')?.addEventListener('click', () => {
    const personalization = qs('#cookies-consent-personalization-checkbox').checked;
    const analytics = qs('#cookies-consent-analytics-checkbox').checked;
    const marketing = qs('#cookies-consent-marketing-checkbox').checked;
    const marketingUserData = qs('#cookies-consent-marketing-user-data-checkbox').checked;
    const marketingPersonalization = qs('#cookies-consent-marketing-personalization-checkbox').checked;
    const consentConfigUser = new ConsentConfig(marketingUserData ? 'granted' : 'denied', marketingPersonalization ? 'granted' : 'denied', marketing ? 'granted' : 'denied', analytics ? 'granted' : 'denied', personalization ? 'granted' : 'denied');
    setupConsent(consentConfigUser);
});
