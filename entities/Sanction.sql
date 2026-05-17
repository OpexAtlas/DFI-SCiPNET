{
  "name": "Sanction",
  "type": "object",
  "properties": {
    "pseudo_cible": {
      "type": "string",
      "description": "Pseudo du membre concern\u00e9"
    },
    "type": {
      "type": "string",
      "enum": [
        "avertissement",
        "suspension",
        "medaille",
        "citation"
      ],
      "description": "Type de sanction ou distinction"
    },
    "categorie": {
      "type": "string",
      "enum": [
        "sanction",
        "distinction"
      ],
      "description": "Cat\u00e9gorie"
    },
    "motif": {
      "type": "string",
      "description": "Motif ou description"
    },
    "auteur": {
      "type": "string",
      "description": "Auteur de la d\u00e9cision"
    }
  },
  "required": [
    "pseudo_cible",
    "type",
    "categorie"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {
      "user_condition": {
        "role": "admin"
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