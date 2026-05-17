{
  "name": "ConfigRecrutement",
  "type": "object",
  "properties": {
    "statut": {
      "type": "string",
      "enum": [
        "ouvert",
        "suspendu",
        "ferme"
      ],
      "default": "ouvert",
      "description": "Statut actuel du recrutement"
    }
  },
  "required": [
    "statut"
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