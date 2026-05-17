{
  "name": "Membre",
  "type": "object",
  "properties": {
    "pseudo_roblox": {
      "type": "string",
      "description": "Pseudo Roblox du membre"
    },
    "grade": {
      "type": "string",
      "description": "Grade actuel du membre"
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
    "statut": {
      "type": "string",
      "enum": [
        "actif",
        "en_mission",
        "inactif",
        "suspendu"
      ],
      "default": "actif",
      "description": "Statut du membre"
    }
  },
  "required": [
    "pseudo_roblox",
    "grade",
    "division"
  ]
}