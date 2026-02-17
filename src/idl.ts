export type GrapeGatingProtocol = {
  version: "0.1.0";
  name: "grape_gating_protocol";
  instructions: [
    {
      name: "initializeGate";
      accounts: [
        { name: "gate"; isMut: true; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true },
        { name: "payer"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "gateId"; type: "publicKey" },
        { name: "criteria"; type: { defined: "GateCriteria" } },
        { name: "gateType"; type: { defined: "GateType" } }
      ];
    },
    {
      name: "setGateAuthority";
      accounts: [
        { name: "gate"; isMut: true; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true }
      ];
      args: [
        { name: "gateId"; type: "publicKey" },
        { name: "newAuthority"; type: "publicKey" }
      ];
    },
    {
      name: "updateGateCriteria";
      accounts: [
        { name: "gate"; isMut: true; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true }
      ];
      args: [
        { name: "gateId"; type: "publicKey" },
        { name: "newCriteria"; type: { defined: "GateCriteria" } }
      ];
    },
    {
      name: "setGateActive";
      accounts: [
        { name: "gate"; isMut: true; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true }
      ];
      args: [
        { name: "gateId"; type: "publicKey" },
        { name: "isActive"; type: "bool" }
      ];
    },
    {
      name: "checkGate";
      accounts: [
        { name: "gate"; isMut: true; isSigner: false },
        { name: "user"; isMut: false; isSigner: false },
        { name: "reputationAccount"; isMut: true; isSigner: false; isOptional: true },
        { name: "identityAccount"; isMut: false; isSigner: false; isOptional: true },
        { name: "linkAccount"; isMut: false; isSigner: false; isOptional: true },
        { name: "tokenAccount"; isMut: false; isSigner: false; isOptional: true },
        { name: "checkRecord"; isMut: true; isSigner: false; isOptional: true },
        { name: "payer"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "gateId"; type: "publicKey" }];
    },
    {
      name: "createCheckRecord";
      accounts: [
        { name: "gate"; isMut: false; isSigner: false },
        { name: "user"; isMut: false; isSigner: false },
        { name: "checkRecord"; isMut: true; isSigner: false },
        { name: "payer"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "gateId"; type: "publicKey" }];
    },
    {
      name: "closeGate";
      accounts: [
        { name: "gate"; isMut: true; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true },
        { name: "recipient"; isMut: true; isSigner: false }
      ];
      args: [{ name: "gateId"; type: "publicKey" }];
    },
    {
      name: "closeCheckRecord";
      accounts: [
        { name: "gate"; isMut: false; isSigner: false },
        { name: "user"; isMut: false; isSigner: false },
        { name: "checkRecord"; isMut: true; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true },
        { name: "recipient"; isMut: true; isSigner: false }
      ];
      args: [{ name: "gateId"; type: "publicKey" }];
    },
    {
      name: "adminCloseAny";
      accounts: [
        { name: "authority"; isMut: false; isSigner: true },
        { name: "target"; isMut: true; isSigner: false },
        { name: "recipient"; isMut: true; isSigner: false }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "Gate";
      type: {
        kind: "struct";
        fields: [
          { name: "version"; type: "u8" },
          { name: "gateId"; type: "publicKey" },
          { name: "authority"; type: "publicKey" },
          { name: "criteria"; type: { defined: "GateCriteria" } },
          { name: "gateType"; type: { defined: "GateType" } },
          { name: "isActive"; type: "bool" },
          { name: "createdAt"; type: "i64" },
          { name: "totalChecks"; type: "u64" },
          { name: "successfulChecks"; type: "u64" },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "GateCheckRecord";
      type: {
        kind: "struct";
        fields: [
          { name: "version"; type: "u8" },
          { name: "gate"; type: "publicKey" },
          { name: "user"; type: "publicKey" },
          { name: "passed"; type: "bool" },
          { name: "checkedAt"; type: "i64" },
          { name: "bump"; type: "u8" }
        ];
      };
    }
  ];
  types: [
    {
      name: "GateType";
      type: {
        kind: "enum";
        variants: [
          { name: "SingleUse" },
          { name: "Reusable" },
          { name: "TimeLimited"; fields: [{ name: "durationSeconds"; type: "i64" }] },
          { name: "Subscription"; fields: [{ name: "intervalSeconds"; type: "i64" }] }
        ];
      };
    },
    {
      name: "GateCriteria";
      type: {
        kind: "enum";
        variants: [
          {
            name: "MinReputation";
            fields: [
              { name: "vineConfig"; type: "publicKey" },
              { name: "minPoints"; type: "u64" },
              { name: "season"; type: "u16" }
            ];
          },
          {
            name: "VerifiedIdentity";
            fields: [
              { name: "grapeSpace"; type: "publicKey" },
              { name: "platforms"; type: "bytes" }
            ];
          },
          {
            name: "VerifiedWithWallet";
            fields: [
              { name: "grapeSpace"; type: "publicKey" },
              { name: "platforms"; type: "bytes" }
            ];
          },
          {
            name: "Combined";
            fields: [
              { name: "vineConfig"; type: "publicKey" },
              { name: "minPoints"; type: "u64" },
              { name: "season"; type: "u16" },
              { name: "grapeSpace"; type: "publicKey" },
              { name: "platforms"; type: "bytes" },
              { name: "requireWalletLink"; type: "bool" }
            ];
          },
          {
            name: "TimeLockedReputation";
            fields: [
              { name: "vineConfig"; type: "publicKey" },
              { name: "minPoints"; type: "u64" },
              { name: "season"; type: "u16" },
              { name: "minHoldDurationSeconds"; type: "u64" }
            ];
          },
          {
            name: "MultiDao";
            fields: [
              { name: "requiredGates"; type: { vec: "publicKey" } },
              { name: "requireAll"; type: "bool" }
            ];
          },
          {
            name: "TokenHolding";
            fields: [
              { name: "mint"; type: "publicKey" },
              { name: "minAmount"; type: "u64" },
              { name: "checkAta"; type: "bool" }
            ];
          },
          {
            name: "NftCollection";
            fields: [
              { name: "collectionMint"; type: "publicKey" },
              { name: "minCount"; type: "u16" }
            ];
          },
          {
            name: "CustomProgram";
            fields: [
              { name: "programId"; type: "publicKey" },
              { name: "instructionData"; type: "bytes" }
            ];
          }
        ];
      };
    }
  ];
  errors: [
    { code: 6000; name: "Unauthorized"; msg: "Unauthorized" },
    { code: 6001; name: "GateInactive"; msg: "Gate is inactive" },
    { code: 6002; name: "GateCheckFailed"; msg: "Gate check failed" },
    { code: 6003; name: "ReputationAccountRequired"; msg: "Reputation account required" },
    { code: 6004; name: "IdentityAccountRequired"; msg: "Identity account required" },
    { code: 6005; name: "LinkAccountRequired"; msg: "Link account required" },
    { code: 6006; name: "TokenAccountRequired"; msg: "Token account required" },
    { code: 6007; name: "InvalidReputationAccount"; msg: "Invalid reputation account" },
    { code: 6008; name: "InvalidIdentityAccount"; msg: "Invalid identity account" },
    { code: 6009; name: "InvalidLinkAccount"; msg: "Invalid link account" },
    { code: 6010; name: "InvalidPda"; msg: "Invalid PDA derivation" },
    { code: 6011; name: "WrongUser"; msg: "Wrong user" },
    { code: 6012; name: "SeasonMismatch"; msg: "Season mismatch" },
    { code: 6013; name: "WrongSpace"; msg: "Wrong space" },
    { code: 6014; name: "WrongIdentity"; msg: "Wrong identity" },
    { code: 6015; name: "IdentityNotVerified"; msg: "Identity not verified" },
    { code: 6016; name: "IdentityExpired"; msg: "Identity expired" },
    { code: 6017; name: "InsufficientGateChecks"; msg: "Insufficient gate checks" },
    { code: 6018; name: "InvalidCheckRecord"; msg: "Invalid check record" },
    { code: 6019; name: "CheckRecordExpired"; msg: "Check record expired" },
    { code: 6020; name: "WrongMint"; msg: "Wrong mint" },
    { code: 6021; name: "WrongTokenOwner"; msg: "Wrong token owner" },
    { code: 6022; name: "InsufficientNfts"; msg: "Insufficient NFTs" },
    { code: 6023; name: "CustomProgramAccountRequired"; msg: "Custom program account required" },
    { code: 6024; name: "InvalidCustomProgram"; msg: "Invalid custom program" },
    { code: 6025; name: "CustomValidationFailed"; msg: "Custom validation failed" },
    { code: 6026; name: "TargetNotProgramOwned"; msg: "Target not program owned" },
    { code: 6027; name: "Overflow"; msg: "Overflow" }
  ];
};

export const IDL: GrapeGatingProtocol = {
  version: "0.1.0",
  name: "grape_gating_protocol",
  instructions: [
    {
      name: "initializeGate",
      accounts: [
        { name: "gate", isMut: true, isSigner: false },
        { name: "authority", isMut: false, isSigner: true },
        { name: "payer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "gateId", type: "publicKey" },
        { name: "criteria", type: { defined: "GateCriteria" } },
        { name: "gateType", type: { defined: "GateType" } },
      ],
    },
    {
      name: "setGateAuthority",
      accounts: [
        { name: "gate", isMut: true, isSigner: false },
        { name: "authority", isMut: false, isSigner: true },
      ],
      args: [
        { name: "gateId", type: "publicKey" },
        { name: "newAuthority", type: "publicKey" },
      ],
    },
    {
      name: "updateGateCriteria",
      accounts: [
        { name: "gate", isMut: true, isSigner: false },
        { name: "authority", isMut: false, isSigner: true },
      ],
      args: [
        { name: "gateId", type: "publicKey" },
        { name: "newCriteria", type: { defined: "GateCriteria" } },
      ],
    },
    {
      name: "setGateActive",
      accounts: [
        { name: "gate", isMut: true, isSigner: false },
        { name: "authority", isMut: false, isSigner: true },
      ],
      args: [
        { name: "gateId", type: "publicKey" },
        { name: "isActive", type: "bool" },
      ],
    },
    {
      name: "checkGate",
      accounts: [
        { name: "gate", isMut: true, isSigner: false },
        { name: "user", isMut: false, isSigner: false },
        { name: "reputationAccount", isMut: true, isSigner: false, isOptional: true },
        { name: "identityAccount", isMut: false, isSigner: false, isOptional: true },
        { name: "linkAccount", isMut: false, isSigner: false, isOptional: true },
        { name: "tokenAccount", isMut: false, isSigner: false, isOptional: true },
        { name: "checkRecord", isMut: true, isSigner: false, isOptional: true },
        { name: "payer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "gateId", type: "publicKey" }],
    },
    {
      name: "createCheckRecord",
      accounts: [
        { name: "gate", isMut: false, isSigner: false },
        { name: "user", isMut: false, isSigner: false },
        { name: "checkRecord", isMut: true, isSigner: false },
        { name: "payer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "gateId", type: "publicKey" }],
    },
    {
      name: "closeGate",
      accounts: [
        { name: "gate", isMut: true, isSigner: false },
        { name: "authority", isMut: false, isSigner: true },
        { name: "recipient", isMut: true, isSigner: false },
      ],
      args: [{ name: "gateId", type: "publicKey" }],
    },
    {
      name: "closeCheckRecord",
      accounts: [
        { name: "gate", isMut: false, isSigner: false },
        { name: "user", isMut: false, isSigner: false },
        { name: "checkRecord", isMut: true, isSigner: false },
        { name: "authority", isMut: false, isSigner: true },
        { name: "recipient", isMut: true, isSigner: false },
      ],
      args: [{ name: "gateId", type: "publicKey" }],
    },
    {
      name: "adminCloseAny",
      accounts: [
        { name: "authority", isMut: false, isSigner: true },
        { name: "target", isMut: true, isSigner: false },
        { name: "recipient", isMut: true, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Gate",
      type: {
        kind: "struct",
        fields: [
          { name: "version", type: "u8" },
          { name: "gateId", type: "publicKey" },
          { name: "authority", type: "publicKey" },
          { name: "criteria", type: { defined: "GateCriteria" } },
          { name: "gateType", type: { defined: "GateType" } },
          { name: "isActive", type: "bool" },
          { name: "createdAt", type: "i64" },
          { name: "totalChecks", type: "u64" },
          { name: "successfulChecks", type: "u64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "GateCheckRecord",
      type: {
        kind: "struct",
        fields: [
          { name: "version", type: "u8" },
          { name: "gate", type: "publicKey" },
          { name: "user", type: "publicKey" },
          { name: "passed", type: "bool" },
          { name: "checkedAt", type: "i64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
  types: [
    {
      name: "GateType",
      type: {
        kind: "enum",
        variants: [
          { name: "SingleUse" },
          { name: "Reusable" },
          { name: "TimeLimited", fields: [{ name: "durationSeconds", type: "i64" }] },
          { name: "Subscription", fields: [{ name: "intervalSeconds", type: "i64" }] },
        ],
      },
    },
    {
      name: "GateCriteria",
      type: {
        kind: "enum",
        variants: [
          {
            name: "MinReputation",
            fields: [
              { name: "vineConfig", type: "publicKey" },
              { name: "minPoints", type: "u64" },
              { name: "season", type: "u16" },
            ],
          },
          {
            name: "VerifiedIdentity",
            fields: [
              { name: "grapeSpace", type: "publicKey" },
              { name: "platforms", type: "bytes" },
            ],
          },
          {
            name: "VerifiedWithWallet",
            fields: [
              { name: "grapeSpace", type: "publicKey" },
              { name: "platforms", type: "bytes" },
            ],
          },
          {
            name: "Combined",
            fields: [
              { name: "vineConfig", type: "publicKey" },
              { name: "minPoints", type: "u64" },
              { name: "season", type: "u16" },
              { name: "grapeSpace", type: "publicKey" },
              { name: "platforms", type: "bytes" },
              { name: "requireWalletLink", type: "bool" },
            ],
          },
          {
            name: "TimeLockedReputation",
            fields: [
              { name: "vineConfig", type: "publicKey" },
              { name: "minPoints", type: "u64" },
              { name: "season", type: "u16" },
              { name: "minHoldDurationSeconds", type: "u64" },
            ],
          },
          {
            name: "MultiDao",
            fields: [
              { name: "requiredGates", type: { vec: "publicKey" } },
              { name: "requireAll", type: "bool" },
            ],
          },
          {
            name: "TokenHolding",
            fields: [
              { name: "mint", type: "publicKey" },
              { name: "minAmount", type: "u64" },
              { name: "checkAta", type: "bool" },
            ],
          },
          {
            name: "NftCollection",
            fields: [
              { name: "collectionMint", type: "publicKey" },
              { name: "minCount", type: "u16" },
            ],
          },
          {
            name: "CustomProgram",
            fields: [
              { name: "programId", type: "publicKey" },
              { name: "instructionData", type: "bytes" },
            ],
          },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: "Unauthorized", msg: "Unauthorized" },
    { code: 6001, name: "GateInactive", msg: "Gate is inactive" },
    { code: 6002, name: "GateCheckFailed", msg: "Gate check failed" },
    { code: 6003, name: "ReputationAccountRequired", msg: "Reputation account required" },
    { code: 6004, name: "IdentityAccountRequired", msg: "Identity account required" },
    { code: 6005, name: "LinkAccountRequired", msg: "Link account required" },
    { code: 6006, name: "TokenAccountRequired", msg: "Token account required" },
    { code: 6007, name: "InvalidReputationAccount", msg: "Invalid reputation account" },
    { code: 6008, name: "InvalidIdentityAccount", msg: "Invalid identity account" },
    { code: 6009, name: "InvalidLinkAccount", msg: "Invalid link account" },
    { code: 6010, name: "InvalidPda", msg: "Invalid PDA derivation" },
    { code: 6011, name: "WrongUser", msg: "Wrong user" },
    { code: 6012, name: "SeasonMismatch", msg: "Season mismatch" },
    { code: 6013, name: "WrongSpace", msg: "Wrong space" },
    { code: 6014, name: "WrongIdentity", msg: "Wrong identity" },
    { code: 6015, name: "IdentityNotVerified", msg: "Identity not verified" },
    { code: 6016, name: "IdentityExpired", msg: "Identity expired" },
    { code: 6017, name: "InsufficientGateChecks", msg: "Insufficient gate checks" },
    { code: 6018, name: "InvalidCheckRecord", msg: "Invalid check record" },
    { code: 6019, name: "CheckRecordExpired", msg: "Check record expired" },
    { code: 6020, name: "WrongMint", msg: "Wrong mint" },
    { code: 6021, name: "WrongTokenOwner", msg: "Wrong token owner" },
    { code: 6022, name: "InsufficientNfts", msg: "Insufficient NFTs" },
    { code: 6023, name: "CustomProgramAccountRequired", msg: "Custom program account required" },
    { code: 6024, name: "InvalidCustomProgram", msg: "Invalid custom program" },
    { code: 6025, name: "CustomValidationFailed", msg: "Custom validation failed" },
    { code: 6026, name: "TargetNotProgramOwned", msg: "Target not program owned" },
    { code: 6027, name: "Overflow", msg: "Overflow" },
  ],
};
