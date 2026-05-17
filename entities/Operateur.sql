{
  "name": "Operateur",
  "type": "object",
  "properties": {
    "pseudo_roblox": {
      "type": "string",
      "description": "Pseudo Roblox de l'op\u00e9rateur"
    },
    "grade": {
      "type": "string",
      "enum": [
        "G\u00e9n\u00e9ral(e) des Forces d'Intervention",
        "Colonel des Forces d'Intervention",
        "Secr\u00e9taire G\u00e9n\u00e9ral(e) \u00e0 la D\u00e9fense",
        "Sous-Secr\u00e9taire G\u00e9n\u00e9ral(e) \u00e0 la D\u00e9fense",
        "Lieutenant(e)-Colonel",
        "Commandant(e)",
        "Capitaine",
        "Lieutenant(e)",
        "Major",
        "Adjudant-Chef/fe",
        "Adjudant(e)",
        "Brigadier-Chef/fe",
        "Brigadier",
        "1\u00e8re Classe"
      ],
      "description": "Grade de l'op\u00e9rateur"
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
      "description": "Division d'affectation"
    },
    "statut": {
      "type": "string",
      "enum": [
        "actif",
        "en_mission",
        "inactif",
        "suspendu"
      ],
      "default": "actif",
      "description": "Statut op\u00e9rationnel"
    },
    "corps": {
      "type": "string",
      "enum": [
        "etat_major",
        "officiers",
        "sous_officiers",
        "hommes_du_rang"
      ],
      "description": "Corps d'appartenance"
    },
    "date_entree": {
      "type": "string",
      "format": "date",
      "description": "Date d'entr\u00e9e dans le DFI"
    },
    "photo_url": {
      "type": "string",
      "description": "URL de la photo de profil"
    },
    "notes_internes": {
      "type": "string",
      "description": "Notes internes (\u00c9tat-Major uniquement)"
    },
    "role_dfi": {
      "type": "string",
      "enum": [
        "operateur",
        "etat_major"
      ],
      "default": "operateur",
      "description": "R\u00f4le dans le DFI"
    },
    "user_email": {
      "type": "string",
      "description": "Email du compte li\u00e9 (si connect\u00e9)"
    }
  },
  "required": [
    "pseudo_roblox",
    "grade",
    "division"
  ]
}