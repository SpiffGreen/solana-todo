export type Todo = {
  "version": "0.1.0",
  "name": "todo",
  "constants": [
    {
      "name": "USER_TAG",
      "type": "bytes",
      "value": "[85, 83, 69, 82, 95, 83, 84, 65, 84, 69]"
    },
    {
      "name": "TODO_TAG",
      "type": "bytes",
      "value": "[84, 79, 68, 79, 95, 83, 84, 65, 84, 69]"
    }
  ],
  "instructions": [
    {
      "name": "initializeUser",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addTodo",
      "accounts": [
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "todoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "markTodo",
      "accounts": [
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "todoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "todoIdx",
          "type": "u8"
        }
      ]
    },
    {
      "name": "removeTodo",
      "accounts": [
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "todoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "todoIdx",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "lastTodo",
            "type": "u8"
          },
          {
            "name": "todoCount",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "todoAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "idx",
            "type": "u8"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "marked",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "NotAllowed",
      "msg": "Not allowed."
    },
    {
      "code": 6002,
      "name": "MathOverflow",
      "msg": "Math operation overflow."
    },
    {
      "code": 6003,
      "name": "AlreadyMarked",
      "msg": "Already marked."
    }
  ]
};

export const IDL: Todo = {
  "version": "0.1.0",
  "name": "todo",
  "constants": [
    {
      "name": "USER_TAG",
      "type": "bytes",
      "value": "[85, 83, 69, 82, 95, 83, 84, 65, 84, 69]"
    },
    {
      "name": "TODO_TAG",
      "type": "bytes",
      "value": "[84, 79, 68, 79, 95, 83, 84, 65, 84, 69]"
    }
  ],
  "instructions": [
    {
      "name": "initializeUser",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addTodo",
      "accounts": [
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "todoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "markTodo",
      "accounts": [
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "todoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "todoIdx",
          "type": "u8"
        }
      ]
    },
    {
      "name": "removeTodo",
      "accounts": [
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "todoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "todoIdx",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "lastTodo",
            "type": "u8"
          },
          {
            "name": "todoCount",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "todoAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "idx",
            "type": "u8"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "marked",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "NotAllowed",
      "msg": "Not allowed."
    },
    {
      "code": 6002,
      "name": "MathOverflow",
      "msg": "Math operation overflow."
    },
    {
      "code": 6003,
      "name": "AlreadyMarked",
      "msg": "Already marked."
    }
  ]
};
