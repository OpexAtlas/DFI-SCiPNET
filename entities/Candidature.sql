{
  "name": "Candidature",
  "type": "object",
  "properties": {
    "pseudo_roblox": {
      "type": "string",
      "description": "Pseudo Roblox du candidat"
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
      "description": "Division vis\u00e9e"
    },
    "grade_actuel": {
      "type": "string",
      "description": "Grade actuel dans le jeu"
    },
    "experience": {
      "type": "string",
      "description": "Exp\u00e9rience SCP du candidat"
    },
    "motivation": {
      "type": "string",
      "description": "Motivation du candidat"
    },
    "disponibilite": {
      "type": "string",
      "description": "Disponibilit\u00e9 hebdomadaire"
    },
    "statut": {
      "type": "string",
      "enum": [
        "en_attente",
        "accepte",
        "refuse"
      ],
      "default": "en_attente",
      "description": "Statut de la candidature"
    }
  },
  "required": [
    "pseudo_roblox",
    "division",
    "motivation"
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