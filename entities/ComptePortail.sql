{
  "name": "ComptePortail",
  "type": "object",
  "properties": {
    "pseudo": {
      "type": "string",
      "description": "Pseudo Roblox / identifiant de connexion"
    },
    "mot_de_passe": {
      "type": "string",
      "description": "Mot de passe (hach\u00e9 simplement, d\u00e9fini par l'admin)"
    },
    "type_compte": {
      "type": "string",
      "enum": [
        "operateur_dfi",
        "externe"
      ],
      "default": "operateur_dfi",
      "description": "Type de compte"
    },
    "grade": {
      "type": "string",
      "description": "Grade DFI (si op\u00e9rateur)"
    },
    "division": {
      "type": "string",
      "enum": [
        "FIMU",
        "Nu-7",
        "Epsilon-11",
        "Beta-7",
        "BSF"
      ],
      "description": "Division (si op\u00e9rateur)"
    },
    "role_personnalise": {
      "type": "string",
      "description": "R\u00f4le libre (si externe, ex: Directeur d'Installation)"
    },
    "niveau_permission": {
      "type": "number",
      "enum": [
        1,
        2,
        3,
        4,
        5
      ],
      "default": 1,
      "description": "Niveau de permission (1=Appel uniquement, 2=Externe perso, 3=Sous-Mod, 4=Mod\u00e9rateur, 5=Super Admin)"
    },
    "permissions_sections": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Sections autoris\u00e9es pour niveau 2 (annonces, effectifs, appel_fim, historique_alertes)"
    },
    "photo_url": {
      "type": "string",
      "description": "URL photo de profil"
    },
    "statut": {
      "type": "string",
      "enum": [
        "actif",
        "suspendu"
      ],
      "default": "actif"
    }
  },
  "required": [
    "pseudo",
    "mot_de_passe",
    "niveau_permission"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {},
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}