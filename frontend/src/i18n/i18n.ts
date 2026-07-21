import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome to TOKIYO STORE",
      shop_now: "Shop Now",
      new_arrivals: "New Arrivals",
      premium_fashion: "Premium Men's Fashion",
      home: "Home",
      shop: "Shop",
      search: "Search",
      wishlist: "Wishlist",
      account: "Account"
    }
  },
  ar: {
    translation: {
      welcome: "مرحباً بكم في متجر طوكيو",
      shop_now: "تسوق الآن",
      new_arrivals: "وصل حديثاً",
      premium_fashion: "أزياء رجالية فاخرة",
      home: "الرئيسية",
      shop: "المتجر",
      search: "بحث",
      wishlist: "المفضلة",
      account: "حسابي"
    }
  },
  so: {
    translation: {
      welcome: "Ku soo dhawaaw TOKIYO STORE",
      shop_now: "Hadda Iibso",
      new_arrivals: "Alaabta Cusub",
      premium_fashion: "Dharka Casriga ah ee Ragga",
      home: "Hoy",
      shop: "Iibso",
      search: "Raadi",
      wishlist: "Hamiga",
      account: "Koontada"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
