import { en } from './en';
import type { TranslationSchema } from './en';

export const hi: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru टैग निष्कर्षक',
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    indonesian: 'इंडोनेशियाई',
    chinese: 'चीनी',
    languageSwitcher: {
      title: 'इंटरफ़ेस भाषा',
      description: 'आपके ब्राउज़र में सहेजी गई। डिफ़ॉल्ट भाषा अंग्रेज़ी है।',
      instantNotice: 'परिवर्तन बिना पुनः लोड किए तुरंत लागू होते हैं।',
      searchPlaceholder: 'भाषाएं खोजें...',
      noResults: 'कोई भाषा नहीं मिली'
    },
    nav: {
      extractor: 'टैग',
      image: 'छवि',
      booruList: 'Booru',
      settings: 'सेटिंग्स'
    },
    actions: {
      ...en.common.actions,
      add: 'जोड़ें',
      apply: 'लागू करें',
      back: 'वापस',
      cancel: 'रद्द करें',
      clear: 'साफ़ करें',
      close: 'बंद करें',
      confirm: 'पुष्टि करें',
      copy: 'कॉपी',
      copied: 'कॉपी हो गया!',
      delete: 'हटाएं',
      save: 'सहेजें',
      search: 'खोजें',
      all: 'सभी',
      none: 'कोई नहीं'
    }
  },
  settings: {
    title: 'सेटिंग्स',
    sections: {
      appearance: 'उपस्थिति',
      colorTheme: 'रंग थीम',
      dataFetch: 'डेटा प्राप्ति विधि'
    },
    themeOptions: {
      system: 'सिस्टम',
      light: 'हल्का',
      dark: 'गहरा'
    },
    colorThemes: {
      blue: 'नीला',
      orange: 'नारंगी',
      teal: 'हरा-नीला',
      rose: 'गुलाबी',
      purple: 'बैंगनी',
      green: 'हरा',
      custom: 'कस्टम रंग'
    },
    customColor: {
      label: 'कस्टम रंग',
      pickerLabel: 'कस्टम रंग चयनकर्ता',
      inputLabel: 'कस्टम रंग हेक्स कोड',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'सर्वर प्रॉक्सी',
        description: 'डेटा प्राप्त करने के लिए इस एप्लिकेशन के सर्वर का उपयोग करता है। अनुशंसित, अधिक विश्वसनीय।'
      },
      clientProxy: {
        label: 'क्लाइंट-साइड प्रॉक्सी',
        description: 'आपके ब्राउज़र में सार्वजनिक CORS प्रॉक्सी का उपयोग करता है। कम विश्वसनीय या दर-सीमित हो सकता है।'
      }
    },
    clientProxy: {
      selectLabel: 'क्लाइंट प्रॉक्सी सेवा चुनें:',
      ariaLabel: 'क्लाइंट प्रॉक्सी सेवा चयनकर्ता',
      helper: 'प्रदर्शन और विश्वसनीयता प्रॉक्सी के बीच भिन्न होती है।'
    },
    toggles: {
      autoExtract: {
        label: 'स्वचालित निष्कर्षण',
        description: 'मान्य URL पेस्ट/टाइप करने के बाद स्वचालित रूप से टैग निकालें।',
        tooltip: 'मान्य URL पेस्ट/टाइप करने पर स्वचालित टैग निष्कर्षण सक्षम या अक्षम करें'
      },
      previews: {
        label: 'पूर्वावलोकन सक्षम करें',
        description: 'निष्कर्षण और इतिहास में छवि/वीडियो पूर्वावलोकन दिखाएं।',
        tooltip: 'बैंडविड्थ बचाने या संभावित समस्याओं से बचने के लिए छवि/वीडियो पूर्वावलोकन सक्षम या अक्षम करें',
        note: 'छवियां हमेशा सर्वर प्रॉक्सी के माध्यम से प्राप्त की जाती हैं।'
      },
      saveHistory: {
        label: 'इतिहास सहेजें',
        description: 'आपके ब्राउज़र में स्थानीय रूप से सफल निष्कर्षण संग्रहीत करें।',
        tooltip: 'आपके ब्राउज़र के स्थानीय संग्रहण में निष्कर्षण इतिहास सहेजना सक्षम या अक्षम करें'
      },
      unsupportedSites: {
        label: 'असमर्थित साइटों के लिए सक्षम करें',
        description: 'समान साइट पैटर्न का उपयोग करके असमर्थित साइटों से निकालने का प्रयास करें। सभी साइटों पर काम नहीं कर सकता।',
        tooltip: 'समान साइट पैटर्न का उपयोग करके असमर्थित वेबसाइटों के लिए निष्कर्षण सक्षम करें'
      },
      blacklist: {
        label: 'कीवर्ड ब्लैकलिस्ट सक्षम करें',
        description: 'ब्लॉक करने के लिए कीवर्ड दर्ज करें, अल्पविराम, अर्धविराम, या नई पंक्ति से अलग करें।',
        tooltip: 'विशिष्ट कीवर्ड फ़िल्टर करके अवांछित टैग ब्लॉक करें',
        placeholder: 'ब्लॉक करने के लिए कीवर्ड दर्ज करें…',
        ariaLabel: 'ब्लैकलिस्ट कीवर्ड',
        reset: 'डिफ़ॉल्ट पर रीसेट करें'
      }
    },
    historySize: {
      label: 'अधिकतम इतिहास आकार',
      description: 'निष्कर्षण और छवि इतिहास दोनों के लिए अधिकतम प्रविष्टियों की संख्या सेट करें।'
    },
    accessibility: {
      themeOption: 'थीम {{label}}',
      colorThemeOption: 'रंग थीम {{label}}',
      historySizeSelect: 'अधिकतम इतिहास आकार'
    },
    historySizeOptions: {
      '10': '10 प्रविष्टियां',
      '30': '30 प्रविष्टियां',
      '50': '50 प्रविष्टियां',
      '100': '100 प्रविष्टियां',
      unlimited: 'असीमित'
    },
    support: {
      title: 'समर्थन और प्रतिक्रिया',
      cta: 'GitHub पर समस्या रिपोर्ट करें',
      description: 'बग मिला या सुझाव है? हमें बताएं!'
    },
    modal: {
      close: 'सेटिंग्स बंद करें'
    }
  }
};
