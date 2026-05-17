{
  "name": "Operation",
  "type": "object",
  "properties": {
    "date_operation": {
      "type": "string",
      "format": "date",
      "description": "Date de l'op\u00e9ration"
    },
    "division": {
      "type": "string",
      "enum": [
        "FIMU",
        "Nu-7",
        "Epsilon-11",
        "Beta-7",
        "BSF",
        "Toutes"
      ],
      "description": "Division engag\u00e9e"
    },
    "type_intervention": {
      "type": "string",
      "enum": [
        "Br\u00e8che de confinement",
        "Menace arm\u00e9e",
        "\u00c9vacuation",
        "Inspection",
        "Contamination",
        "Autre"
      ],
      "description": "Type d'intervention"
    },
    "resultat": {
      "type": "string",
      "enum": [
        "Succ\u00e8s",
        "Succ\u00e8s partiel",
        "\u00c9chec",
        "En cours"
      ],
      "default": "En cours"
    },
    "chef_escouade": {
      "type": "string",
      "description": "Chef d'escouade"
    },
    "rapport": {
      "type": "string",
      "description": "Rapport de mission"
    },
    "localisation": {
      "type": "string",
      "description": "Zone d'intervention"
    }
  },
  "required": [
    "date_operation",
    "division",
    "type_intervention"
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