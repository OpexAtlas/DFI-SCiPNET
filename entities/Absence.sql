{
  "name": "Absence",
  "type": "object",
  "properties": {
    "pseudo": {
      "type": "string",
      "description": "Pseudo du demandeur"
    },
    "date_debut": {
      "type": "string",
      "format": "date"
    },
    "date_fin": {
      "type": "string",
      "format": "date"
    },
    "motif": {
      "type": "string"
    },
    "statut": {
      "type": "string",
      "enum": [
        "en_attente",
        "validee",
        "refusee"
      ],
      "default": "en_attente"
    }
  },
  "required": [
    "pseudo",
    "date_debut",
    "date_fin",
    "motif"
  ],
  "rls": {
    "create": {},
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