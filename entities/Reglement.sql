{
  "name": "Reglement",
  "type": "object",
  "properties": {
    "titre": {
      "type": "string"
    },
    "contenu": {
      "type": "string"
    },
    "categorie": {
      "type": "string",
      "enum": [
        "regle_interne",
        "protocole_intervention",
        "code_conduite"
      ],
      "default": "regle_interne"
    },
    "ordre": {
      "type": "number",
      "default": 0
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