{
  "name": "Alerte",
  "type": "object",
  "properties": {
    "demandeur_nom": {
      "type": "string",
      "description": "Nom du demandeur"
    },
    "demandeur_grade": {
      "type": "string",
      "description": "Grade du demandeur"
    },
    "division_ciblee": {
      "type": "string",
      "enum": [
        "FIMU",
        "Nu-7",
        "Epsilon-11",
        "Beta-7",
        "BSF",
        "Toutes les divisions"
      ],
      "description": "Division FIM sollicit\u00e9e"
    },
    "nature": {
      "type": "string",
      "enum": [
        "Br\u00e8che de confinement",
        "Menace arm\u00e9e",
        "\u00c9vacuation",
        "Inspection",
        "Autre"
      ],
      "description": "Nature de l'intervention"
    },
    "localisation": {
      "type": "string",
      "description": "Zone / secteur / num\u00e9ro de salle"
    },
    "niveau_menace": {
      "type": "string",
      "enum": [
        "bas",
        "modere",
        "eleve",
        "critique"
      ],
      "description": "Niveau de menace"
    },
    "description": {
      "type": "string",
      "description": "Description libre de la situation"
    },
    "statut": {
      "type": "string",
      "enum": [
        "en_cours",
        "resolue",
        "annulee"
      ],
      "default": "en_cours",
      "description": "Statut de l'alerte"
    }
  },
  "required": [
    "demandeur_nom",
    "division_ciblee",
    "nature",
    "localisation",
    "niveau_menace"
  ],
  "rls": {
    "create": {},
    "read": {},
    "update": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}