import { en } from './en';
import type { TranslationSchema } from './en';

export const fr: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Extracteur de Tags Booru',
    language: 'Langue',
    english: 'Anglais',
    indonesian: 'Indonésien',
    chinese: 'Chinois',
    languageSwitcher: {
      title: 'Langue de l\'interface',
      description: 'Enregistrée dans votre navigateur. La langue par défaut est l\'anglais.',
      instantNotice: 'Les modifications s\'appliquent instantanément sans rechargement.',
      searchPlaceholder: 'Rechercher des langues...',
      noResults: 'Aucune langue trouvée'
    },
    nav: {
      extractor: 'Tags',
      image: 'Image',
      booruList: 'Boorus',
      settings: 'Paramètres'
    },
    actions: {
      ...en.common.actions,
      add: 'Ajouter',
      apply: 'Appliquer',
      back: 'Retour',
      cancel: 'Annuler',
      clear: 'Effacer',
      close: 'Fermer',
      confirm: 'Confirmer',
      copy: 'Copier',
      copied: 'Copié !',
      delete: 'Supprimer',
      save: 'Enregistrer',
      search: 'Rechercher',
      all: 'Tout',
      none: 'Aucun'
    }
  },
  settings: {
    ...en.settings,
    title: 'Paramètres',
    themeOptions: {
      system: 'Système',
      light: 'Clair',
      dark: 'Sombre'
    }
  }
};
