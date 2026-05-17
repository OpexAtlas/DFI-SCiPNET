{
  "name": "LockdownConfig",
  "type": "object",
  "properties": {
    "actif": {
      "type": "boolean",
      "default": false
    },
    "active_par": {
      "type": "string"
    },
    "message": {
      "type": "string",
      "default": "CONFINEMENT G\u00c9N\u00c9RAL \u2014 TOUTES LES DIVISIONS EN ALERTE MAXIMALE"
    }
  },
  "required": [
    "actif"
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