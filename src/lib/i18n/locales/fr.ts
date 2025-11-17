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
    title: 'Paramètres',
    sections: {
      appearance: 'Apparence',
      colorTheme: 'Thème de Couleur',
      dataFetch: 'Méthode de Récupération des Données'
    },
    themeOptions: {
      system: 'Système',
      light: 'Clair',
      dark: 'Sombre'
    },
    colorThemes: {
      blue: 'Bleu',
      orange: 'Orange',
      teal: 'Sarcelle',
      rose: 'Rose',
      purple: 'Violet',
      green: 'Vert',
      custom: 'Couleur Personnalisée'
    },
    customColor: {
      label: 'Couleur Personnalisée',
      pickerLabel: 'Sélecteur de couleur personnalisée',
      inputLabel: 'Code hexadécimal de couleur personnalisée',
      placeholder: '#rrggbb'
    },
    fetchModes: {
      server: {
        label: 'Proxy Serveur',
        description: 'Utilise le serveur de cette application pour récupérer les données. Recommandé, plus fiable.'
      },
      clientProxy: {
        label: 'Proxy Côté Client',
        description: 'Utilise un proxy CORS public dans votre navigateur. Peut être moins fiable ou limité.'
      }
    },
    clientProxy: {
      selectLabel: 'Sélectionner le service de proxy client :',
      ariaLabel: 'Sélecteur de service de proxy client',
      helper: 'Les performances et la fiabilité varient selon les proxies.'
    },
    toggles: {
      autoExtract: {
        label: 'Extraction Automatique',
        description: 'Extraire les tags automatiquement après avoir collé/saisi une URL valide.',
        tooltip: 'Activer ou désactiver l\'extraction automatique des tags lors du collage/saisie d\'une URL valide'
      },
      previews: {
        label: 'Activer les Aperçus',
        description: 'Afficher les aperçus d\'image/vidéo pendant l\'extraction et dans l\'historique.',
        tooltip: 'Activer ou désactiver les aperçus d\'image/vidéo pour économiser la bande passante ou éviter des problèmes potentiels',
        note: 'Les images sont toujours récupérées via le Proxy Serveur.'
      },
      saveHistory: {
        label: 'Enregistrer l\'Historique',
        description: 'Stocker les extractions réussies localement dans votre navigateur.',
        tooltip: 'Activer ou désactiver la sauvegarde de l\'historique d\'extraction dans le stockage local du navigateur'
      },
      unsupportedSites: {
        label: 'Activer pour les Sites Non Supportés',
        description: 'Essayer d\'extraire depuis des sites non supportés en utilisant des modèles de sites similaires. Peut ne pas fonctionner pour tous les sites.',
        tooltip: 'Activer l\'extraction pour les sites web non supportés en utilisant des modèles de sites similaires'
      },
      blacklist: {
        label: 'Activer la Liste Noire de Mots-Clés',
        description: 'Entrez les mots-clés à bloquer, séparés par des virgules, des points-virgules ou des sauts de ligne.',
        tooltip: 'Bloquer les tags indésirables en filtrant des mots-clés spécifiques',
        placeholder: 'Entrez les mots-clés à bloquer…',
        ariaLabel: 'Mots-clés de la liste noire',
        reset: 'Réinitialiser par Défaut'
      }
    },
    historySize: {
      label: 'Taille Maximale de l\'Historique',
      description: 'Définir le nombre maximum d\'entrées pour l\'historique d\'extraction et d\'image.'
    },
    accessibility: {
      themeOption: 'Thème {{label}}',
      colorThemeOption: 'Thème de couleur {{label}}',
      historySizeSelect: 'Taille maximale de l\'historique'
    },
    historySizeOptions: {
      '10': '10 Entrées',
      '30': '30 Entrées',
      '50': '50 Entrées',
      '100': '100 Entrées',
      unlimited: 'Illimité'
    },
    support: {
      title: 'Support et Commentaires',
      cta: 'Signaler un Problème sur GitHub',
      description: 'Vous avez trouvé un bug ou avez une suggestion ? Faites-le nous savoir !'
    },
    modal: {
      close: 'Fermer les Paramètres'
    }
  }
};
