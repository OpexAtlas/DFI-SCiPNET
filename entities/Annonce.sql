{
  "name": "Annonce",
  "type": "object",
  "properties": {
    "titre": {
      "type": "string",
      "description": "Titre de l'annonce"
    },
    "contenu": {
      "type": "string",
      "description": "Contenu de l'annonce"
    },
    "type": {
      "type": "string",
      "enum": [
        "ordre_du_jour",
        "promotion",
        "operation",
        "annonce_generale"
      ],
      "default": "annonce_generale",
      "description": "Type d'annonce"
    },
    "auteur": {
      "type": "string",
      "description": "Auteur de l'annonce"
    },
    "priorite": {
      "type": "boolean",
      "default": false,
      "description": "Annonce prioritaire (tampon dor\u00e9)"
    }
  },
  "required": [
    "titre",
    "contenu"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {
      "user_condition": {
        "$ne": null
      }
    },
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