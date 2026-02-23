import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js';
import BN from 'bn.js';

type GrapeGatingProtocol = {
    version: "0.1.0";
    name: "grape_gating_protocol";
    instructions: [
        {
            name: "initializeGate";
            accounts: [
                {
                    name: "gate";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "payer";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "gateId";
                    type: "publicKey";
                },
                {
                    name: "criteria";
                    type: {
                        defined: "GateCriteria";
                    };
                },
                {
                    name: "gateType";
                    type: {
                        defined: "GateType";
                    };
                }
            ];
        },
        {
            name: "setGateAuthority";
            accounts: [
                {
                    name: "gate";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                }
            ];
            args: [
                {
                    name: "gateId";
                    type: "publicKey";
                },
                {
                    name: "newAuthority";
                    type: "publicKey";
                }
            ];
        },
        {
            name: "updateGateCriteria";
            accounts: [
                {
                    name: "gate";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                }
            ];
            args: [
                {
                    name: "gateId";
                    type: "publicKey";
                },
                {
                    name: "newCriteria";
                    type: {
                        defined: "GateCriteria";
                    };
                }
            ];
        },
        {
            name: "setGateActive";
            accounts: [
                {
                    name: "gate";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                }
            ];
            args: [
                {
                    name: "gateId";
                    type: "publicKey";
                },
                {
                    name: "isActive";
                    type: "bool";
                }
            ];
        },
        {
            name: "checkGate";
            accounts: [
                {
                    name: "gate";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "user";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "reputationAccount";
                    isMut: true;
                    isSigner: false;
                    isOptional: true;
                },
                {
                    name: "identityAccount";
                    isMut: false;
                    isSigner: false;
                    isOptional: true;
                },
                {
                    name: "linkAccount";
                    isMut: false;
                    isSigner: false;
                    isOptional: true;
                },
                {
                    name: "tokenAccount";
                    isMut: false;
                    isSigner: false;
                    isOptional: true;
                },
                {
                    name: "checkRecord";
                    isMut: true;
                    isSigner: false;
                    isOptional: true;
                },
                {
                    name: "payer";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [{
                name: "gateId";
                type: "publicKey";
            }];
        },
        {
            name: "createCheckRecord";
            accounts: [
                {
                    name: "gate";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "user";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "checkRecord";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "payer";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [{
                name: "gateId";
                type: "publicKey";
            }];
        },
        {
            name: "closeGate";
            accounts: [
                {
                    name: "gate";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "recipient";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [{
                name: "gateId";
                type: "publicKey";
            }];
        },
        {
            name: "closeCheckRecord";
            accounts: [
                {
                    name: "gate";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "user";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "checkRecord";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "recipient";
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [{
                name: "gateId";
                type: "publicKey";
            }];
        },
        {
            name: "adminCloseAny";
            accounts: [
                {
                    name: "authority";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "target";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "recipient";
                    isMut: true;
                    isSigner: false;
                }
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
                    {
                        name: "version";
                        type: "u8";
                    },
                    {
                        name: "gateId";
                        type: "publicKey";
                    },
                    {
                        name: "authority";
                        type: "publicKey";
                    },
                    {
                        name: "criteria";
                        type: {
                            defined: "GateCriteria";
                        };
                    },
                    {
                        name: "gateType";
                        type: {
                            defined: "GateType";
                        };
                    },
                    {
                        name: "isActive";
                        type: "bool";
                    },
                    {
                        name: "createdAt";
                        type: "i64";
                    },
                    {
                        name: "totalChecks";
                        type: "u64";
                    },
                    {
                        name: "successfulChecks";
                        type: "u64";
                    },
                    {
                        name: "bump";
                        type: "u8";
                    }
                ];
            };
        },
        {
            name: "GateCheckRecord";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "version";
                        type: "u8";
                    },
                    {
                        name: "gate";
                        type: "publicKey";
                    },
                    {
                        name: "user";
                        type: "publicKey";
                    },
                    {
                        name: "passed";
                        type: "bool";
                    },
                    {
                        name: "checkedAt";
                        type: "i64";
                    },
                    {
                        name: "bump";
                        type: "u8";
                    }
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
                    {
                        name: "SingleUse";
                    },
                    {
                        name: "Reusable";
                    },
                    {
                        name: "TimeLimited";
                        fields: [{
                            name: "durationSeconds";
                            type: "i64";
                        }];
                    },
                    {
                        name: "Subscription";
                        fields: [{
                            name: "intervalSeconds";
                            type: "i64";
                        }];
                    }
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
                            {
                                name: "vineConfig";
                                type: "publicKey";
                            },
                            {
                                name: "minPoints";
                                type: "u64";
                            },
                            {
                                name: "season";
                                type: "u16";
                            }
                        ];
                    },
                    {
                        name: "VerifiedIdentity";
                        fields: [
                            {
                                name: "grapeSpace";
                                type: "publicKey";
                            },
                            {
                                name: "platforms";
                                type: "bytes";
                            }
                        ];
                    },
                    {
                        name: "VerifiedWithWallet";
                        fields: [
                            {
                                name: "grapeSpace";
                                type: "publicKey";
                            },
                            {
                                name: "platforms";
                                type: "bytes";
                            }
                        ];
                    },
                    {
                        name: "Combined";
                        fields: [
                            {
                                name: "vineConfig";
                                type: "publicKey";
                            },
                            {
                                name: "minPoints";
                                type: "u64";
                            },
                            {
                                name: "season";
                                type: "u16";
                            },
                            {
                                name: "grapeSpace";
                                type: "publicKey";
                            },
                            {
                                name: "platforms";
                                type: "bytes";
                            },
                            {
                                name: "requireWalletLink";
                                type: "bool";
                            }
                        ];
                    },
                    {
                        name: "TimeLockedReputation";
                        fields: [
                            {
                                name: "vineConfig";
                                type: "publicKey";
                            },
                            {
                                name: "minPoints";
                                type: "u64";
                            },
                            {
                                name: "season";
                                type: "u16";
                            },
                            {
                                name: "minHoldDurationSeconds";
                                type: "u64";
                            }
                        ];
                    },
                    {
                        name: "MultiDao";
                        fields: [
                            {
                                name: "requiredGates";
                                type: {
                                    vec: "publicKey";
                                };
                            },
                            {
                                name: "requireAll";
                                type: "bool";
                            }
                        ];
                    },
                    {
                        name: "TokenHolding";
                        fields: [
                            {
                                name: "mint";
                                type: "publicKey";
                            },
                            {
                                name: "minAmount";
                                type: "u64";
                            },
                            {
                                name: "checkAta";
                                type: "bool";
                            }
                        ];
                    },
                    {
                        name: "NftCollection";
                        fields: [
                            {
                                name: "collectionMint";
                                type: "publicKey";
                            },
                            {
                                name: "minCount";
                                type: "u16";
                            }
                        ];
                    },
                    {
                        name: "CustomProgram";
                        fields: [
                            {
                                name: "programId";
                                type: "publicKey";
                            },
                            {
                                name: "instructionData";
                                type: "bytes";
                            }
                        ];
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: "Unauthorized";
            msg: "Unauthorized";
        },
        {
            code: 6001;
            name: "GateInactive";
            msg: "Gate is inactive";
        },
        {
            code: 6002;
            name: "GateCheckFailed";
            msg: "Gate check failed";
        },
        {
            code: 6003;
            name: "ReputationAccountRequired";
            msg: "Reputation account required";
        },
        {
            code: 6004;
            name: "IdentityAccountRequired";
            msg: "Identity account required";
        },
        {
            code: 6005;
            name: "LinkAccountRequired";
            msg: "Link account required";
        },
        {
            code: 6006;
            name: "TokenAccountRequired";
            msg: "Token account required";
        },
        {
            code: 6007;
            name: "InvalidReputationAccount";
            msg: "Invalid reputation account";
        },
        {
            code: 6008;
            name: "InvalidIdentityAccount";
            msg: "Invalid identity account";
        },
        {
            code: 6009;
            name: "InvalidLinkAccount";
            msg: "Invalid link account";
        },
        {
            code: 6010;
            name: "InvalidPda";
            msg: "Invalid PDA derivation";
        },
        {
            code: 6011;
            name: "WrongUser";
            msg: "Wrong user";
        },
        {
            code: 6012;
            name: "SeasonMismatch";
            msg: "Season mismatch";
        },
        {
            code: 6013;
            name: "WrongSpace";
            msg: "Wrong space";
        },
        {
            code: 6014;
            name: "WrongIdentity";
            msg: "Wrong identity";
        },
        {
            code: 6015;
            name: "IdentityNotVerified";
            msg: "Identity not verified";
        },
        {
            code: 6016;
            name: "IdentityExpired";
            msg: "Identity expired";
        },
        {
            code: 6017;
            name: "InsufficientGateChecks";
            msg: "Insufficient gate checks";
        },
        {
            code: 6018;
            name: "InvalidCheckRecord";
            msg: "Invalid check record";
        },
        {
            code: 6019;
            name: "CheckRecordExpired";
            msg: "Check record expired";
        },
        {
            code: 6020;
            name: "WrongMint";
            msg: "Wrong mint";
        },
        {
            code: 6021;
            name: "WrongTokenOwner";
            msg: "Wrong token owner";
        },
        {
            code: 6022;
            name: "InsufficientNfts";
            msg: "Insufficient NFTs";
        },
        {
            code: 6023;
            name: "CustomProgramAccountRequired";
            msg: "Custom program account required";
        },
        {
            code: 6024;
            name: "InvalidCustomProgram";
            msg: "Invalid custom program";
        },
        {
            code: 6025;
            name: "CustomValidationFailed";
            msg: "Custom validation failed";
        },
        {
            code: 6026;
            name: "TargetNotProgramOwned";
            msg: "Target not program owned";
        },
        {
            code: 6027;
            name: "Overflow";
            msg: "Overflow";
        }
    ];
};
declare const IDL: GrapeGatingProtocol;

declare const GPASS_PROGRAM_ID: PublicKey;
declare const VINE_REPUTATION_PROGRAM_ID: PublicKey;
declare const GRAPE_VERIFICATION_PROGRAM_ID: PublicKey;
declare enum VerificationPlatform {
    Discord = 0,
    Telegram = 1,
    Twitter = 2,
    Email = 3
}
type GateType = {
    singleUse: Record<string, never>;
} | {
    reusable: Record<string, never>;
} | {
    timeLimited: {
        durationSeconds: BN;
    };
} | {
    subscription: {
        intervalSeconds: BN;
    };
};
declare const GateTypeFactory: {
    singleUse: () => GateType;
    reusable: () => GateType;
    timeLimited: (durationSeconds: number) => GateType;
    subscription: (intervalSeconds: number) => GateType;
};
type GateCriteria = {
    minReputation: {
        vineConfig: PublicKey;
        minPoints: BN;
        season: number;
    };
} | {
    verifiedIdentity: {
        grapeSpace: PublicKey;
        platforms: Buffer;
    };
} | {
    verifiedWithWallet: {
        grapeSpace: PublicKey;
        platforms: Buffer;
    };
} | {
    combined: {
        vineConfig: PublicKey;
        minPoints: BN;
        season: number;
        grapeSpace: PublicKey;
        platforms: Buffer;
        requireWalletLink: boolean;
    };
} | {
    timeLockedReputation: {
        vineConfig: PublicKey;
        minPoints: BN;
        season: number;
        minHoldDurationSeconds: BN;
    };
} | {
    multiDao: {
        requiredGates: PublicKey[];
        requireAll: boolean;
    };
} | {
    tokenHolding: {
        mint: PublicKey;
        minAmount: BN;
        checkAta: boolean;
    };
} | {
    nftCollection: {
        collectionMint: PublicKey;
        minCount: number;
    };
} | {
    customProgram: {
        programId: PublicKey;
        instructionData: Buffer;
    };
};
declare const GateCriteriaFactory: {
    minReputation: (params: {
        vineConfig: PublicKey;
        minPoints: number | BN;
        season: number;
    }) => GateCriteria;
    verifiedIdentity: (params: {
        grapeSpace: PublicKey;
        platforms: VerificationPlatform[];
    }) => GateCriteria;
    verifiedWithWallet: (params: {
        grapeSpace: PublicKey;
        platforms: VerificationPlatform[];
    }) => GateCriteria;
    combined: (params: {
        vineConfig: PublicKey;
        minPoints: number | BN;
        season: number;
        grapeSpace: PublicKey;
        platforms: VerificationPlatform[];
        requireWalletLink?: boolean;
    }) => GateCriteria;
    timeLockedReputation: (params: {
        vineConfig: PublicKey;
        minPoints: number | BN;
        season: number;
        minHoldDurationSeconds: number | BN;
    }) => GateCriteria;
    multiDao: (params: {
        requiredGates: PublicKey[];
        requireAll?: boolean;
    }) => GateCriteria;
    tokenHolding: (params: {
        mint: PublicKey;
        minAmount: number | BN;
        checkAta?: boolean;
    }) => GateCriteria;
    nftCollection: (params: {
        collectionMint: PublicKey;
        minCount?: number;
    }) => GateCriteria;
    customProgram: (params: {
        programId: PublicKey;
        instructionData?: Buffer;
    }) => GateCriteria;
};
interface Gate {
    version: number;
    gateId: PublicKey;
    authority: PublicKey;
    criteria: GateCriteria;
    gateType: GateType;
    isActive: boolean;
    createdAt: BN;
    totalChecks: BN;
    successfulChecks: BN;
    bump: number;
}
interface GateCheckRecord {
    version: number;
    gate: PublicKey;
    user: PublicKey;
    passed: boolean;
    checkedAt: BN;
    bump: number;
}
interface InitializeGateParams {
    /** Unique identifier for this gate (use a fresh Keypair.publicKey) */
    gateId: PublicKey;
    criteria: GateCriteria;
    gateType: GateType;
    /** Defaults to the provider wallet */
    authority?: PublicKey;
}
interface CheckGateParams {
    gateId: PublicKey;
    user: PublicKey;
    /** Vine reputation PDA — required for reputation-based criteria */
    reputationAccount?: PublicKey;
    /** Grape identity PDA — required for verification-based criteria */
    identityAccount?: PublicKey;
    /** Grape link PDA — required for VerifiedWithWallet / Combined */
    linkAccount?: PublicKey;
    /** SPL token account — required for TokenHolding criteria */
    tokenAccount?: PublicKey;
    /** If true, creates/updates a GateCheckRecord PDA on-chain */
    storeRecord?: boolean;
}
interface UpdateGateCriteriaParams {
    gateId: PublicKey;
    newCriteria: GateCriteria;
}
interface SetGateActiveParams {
    gateId: PublicKey;
    isActive: boolean;
}
interface CloseGateParams {
    gateId: PublicKey;
    /** SOL recipient — defaults to provider wallet */
    recipient?: PublicKey;
}

declare class GpassClient {
    readonly program: Program<GrapeGatingProtocol>;
    readonly provider: AnchorProvider;
    constructor(provider: AnchorProvider, programId?: PublicKey);
    /**
     * Create a new gate with the given criteria.
     *
     * @example
     * const { tx, gate } = await client.initializeGate({
     *   gateId: Keypair.generate().publicKey,
     *   criteria: GateCriteriaFactory.combined({
     *     vineConfig,
     *     minPoints: 500,
     *     season: 1,
     *     grapeSpace,
     *     platforms: [VerificationPlatform.Discord],
     *     requireWalletLink: true,
     *   }),
     *   gateType: GateTypeFactory.reusable(),
     * });
     */
    initializeGate(params: InitializeGateParams): Promise<{
        tx: string;
        gate: PublicKey;
    }>;
    /**
     * Check whether a user passes a gate's criteria.
     * Throws GateCheckFailed (6002) if the user does not pass.
     *
     * @example
     * await client.checkGate({
     *   gateId,
     *   user: walletPublicKey,
     *   reputationAccount: vineRepPda,
     *   identityAccount: grapeIdentityPda,
     *   storeRecord: true,
     * });
     */
    checkGate(params: CheckGateParams): Promise<string>;
    /**
     * Simulate a gate check without submitting a transaction.
     * Returns true if the user would pass, false otherwise.
     * Does NOT throw — use this for UI gating.
     */
    simulateCheckGate(params: CheckGateParams): Promise<boolean>;
    /**
     * Update the criteria for an existing gate.
     */
    updateGateCriteria(params: UpdateGateCriteriaParams): Promise<string>;
    /**
     * Enable or disable a gate.
     */
    setGateActive(params: SetGateActiveParams): Promise<string>;
    /**
     * Transfer gate authority to a new public key.
     */
    setGateAuthority(params: {
        gateId: PublicKey;
        newAuthority: PublicKey;
    }): Promise<string>;
    /**
     * Close a gate and reclaim rent.
     */
    closeGate(params: CloseGateParams): Promise<string>;
    /**
     * Close a check record and reclaim rent.
     */
    closeCheckRecord(params: {
        gateId: PublicKey;
        user: PublicKey;
        recipient?: PublicKey;
    }): Promise<string>;
    /**
     * Fetch a Gate account.
     */
    fetchGate(gateId: PublicKey): Promise<Gate | null>;
    /**
     * Fetch a GateCheckRecord for a user.
     */
    fetchCheckRecord(gateId: PublicKey, user: PublicKey): Promise<GateCheckRecord | null>;
    /**
     * Fetch all gates owned by a specific authority.
     */
    fetchGatesByAuthority(authority: PublicKey): Promise<{
        publicKey: PublicKey;
        account: Gate;
    }[]>;
    /**
     * Returns the raw instruction for checkGate — useful for
     * bundling into a larger transaction (e.g., CPI-style on client side).
     */
    buildCheckGateInstruction(params: CheckGateParams): Promise<TransactionInstruction>;
    /**
     * Build a full transaction that checks a gate and then executes
     * additional instructions (e.g., mint, vote, transfer).
     */
    buildGatedTransaction(checkParams: CheckGateParams, ...additionalInstructions: TransactionInstruction[]): Promise<Transaction>;
}

/**
 * Derives the Gate PDA for a given gate_id.
 * seeds = ["gate", gate_id]
 */
declare function findGatePda(gateId: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
/**
 * Derives the GateCheckRecord PDA for a gate + user.
 * seeds = ["check", gate, user]
 */
declare function findCheckRecordPda(gate: PublicKey, user: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
/**
 * Derives the Vine ReputationConfig PDA.
 * seeds = ["config", dao_id]
 */
declare function findVineConfigPda(daoId: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
/**
 * Derives the Vine Reputation PDA for a user in a config+season.
 * seeds = ["reputation", config, user, season_le_bytes]
 */
declare function findVineReputationPda(config: PublicKey, user: PublicKey, season: number, programId?: PublicKey): Promise<[PublicKey, number]>;
/**
 * Derives the Grape VerificationSpace PDA.
 * seeds = ["space", dao_id]
 */
declare function findGrapeSpacePda(daoId: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
/**
 * Derives the Grape Identity PDA.
 * seeds = ["identity", space, platform_seed, id_hash]
 */
declare function findGrapeIdentityPda(space: PublicKey, platformSeed: number, idHash: Uint8Array, programId?: PublicKey): Promise<[PublicKey, number]>;
/**
 * Derives the Grape Link PDA.
 * seeds = ["link", identity, wallet_hash]
 */
declare function findGrapeLinkPda(identity: PublicKey, walletHash: Uint8Array, programId?: PublicKey): Promise<[PublicKey, number]>;

export { type CheckGateParams, type CloseGateParams, GPASS_PROGRAM_ID, GRAPE_VERIFICATION_PROGRAM_ID, type Gate, type GateCheckRecord, type GateCriteria, GateCriteriaFactory, type GateType, GateTypeFactory, GpassClient, type GrapeGatingProtocol, IDL, type InitializeGateParams, type SetGateActiveParams, type UpdateGateCriteriaParams, VINE_REPUTATION_PROGRAM_ID, VerificationPlatform, findCheckRecordPda, findGatePda, findGrapeIdentityPda, findGrapeLinkPda, findGrapeSpacePda, findVineConfigPda, findVineReputationPda };
