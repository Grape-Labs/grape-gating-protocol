import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

// ─────────────────────────────────────────────────────────
// PROGRAM CONSTANTS
// ─────────────────────────────────────────────────────────

export const GPASS_PROGRAM_ID = new PublicKey(
  "GPASSzQQF1H8cdj5pUwFkeYEE4VdMQtCrYtUaMXvPz48"
);

export const VINE_REPUTATION_PROGRAM_ID = new PublicKey(
  "V1NE6WCWJPRiVFq5DtaN8p87M9DmmUd2zQuVbvLgQwX"
);

export const GRAPE_VERIFICATION_PROGRAM_ID = new PublicKey(
  "VrFyyRxPoyWxpABpBXU4YUCCF9p8giDSJUv2oXfDr5q"
);

// Platform discriminants matching the on-chain enum
export enum VerificationPlatform {
  Discord = 0,
  Telegram = 1,
  Twitter = 2,
  Email = 3,
}

// ─────────────────────────────────────────────────────────
// GATE TYPE
// ─────────────────────────────────────────────────────────

export type GateType =
  | { singleUse: Record<string, never> }
  | { reusable: Record<string, never> }
  | { timeLimited: { durationSeconds: BN } }
  | { subscription: { intervalSeconds: BN } };

export const GateTypeFactory = {
  singleUse: (): GateType => ({ singleUse: {} }),
  reusable: (): GateType => ({ reusable: {} }),
  timeLimited: (durationSeconds: number): GateType => ({
    timeLimited: { durationSeconds: new BN(durationSeconds) },
  }),
  subscription: (intervalSeconds: number): GateType => ({
    subscription: { intervalSeconds: new BN(intervalSeconds) },
  }),
};

// ─────────────────────────────────────────────────────────
// GATE CRITERIA
// ─────────────────────────────────────────────────────────

export type GateCriteria =
  | {
      minReputation: {
        vineConfig: PublicKey;
        minPoints: BN;
        season: number;
      };
    }
  | {
      verifiedIdentity: {
        grapeSpace: PublicKey;
        platforms: Buffer;
      };
    }
  | {
      verifiedWithWallet: {
        grapeSpace: PublicKey;
        platforms: Buffer;
      };
    }
  | {
      combined: {
        vineConfig: PublicKey;
        minPoints: BN;
        season: number;
        grapeSpace: PublicKey;
        platforms: Buffer;
        requireWalletLink: boolean;
      };
    }
  | {
      timeLockedReputation: {
        vineConfig: PublicKey;
        minPoints: BN;
        season: number;
        minHoldDurationSeconds: BN;
      };
    }
  | {
      multiDao: {
        requiredGates: PublicKey[];
        requireAll: boolean;
      };
    }
  | {
      tokenHolding: {
        mint: PublicKey;
        minAmount: BN;
        checkAta: boolean;
      };
    }
  | {
      nftCollection: {
        collectionMint: PublicKey;
        minCount: number;
      };
    }
  | {
      customProgram: {
        programId: PublicKey;
        instructionData: Buffer;
      };
    };

// Fluent factory for building criteria
export const GateCriteriaFactory = {
  minReputation: (params: {
    vineConfig: PublicKey;
    minPoints: number | BN;
    season: number;
  }): GateCriteria => ({
    minReputation: {
      vineConfig: params.vineConfig,
      minPoints: new BN(params.minPoints),
      season: params.season,
    },
  }),

  verifiedIdentity: (params: {
    grapeSpace: PublicKey;
    platforms: VerificationPlatform[];
  }): GateCriteria => ({
    verifiedIdentity: {
      grapeSpace: params.grapeSpace,
      platforms: Buffer.from(params.platforms),
    },
  }),

  verifiedWithWallet: (params: {
    grapeSpace: PublicKey;
    platforms: VerificationPlatform[];
  }): GateCriteria => ({
    verifiedWithWallet: {
      grapeSpace: params.grapeSpace,
      platforms: Buffer.from(params.platforms),
    },
  }),

  combined: (params: {
    vineConfig: PublicKey;
    minPoints: number | BN;
    season: number;
    grapeSpace: PublicKey;
    platforms: VerificationPlatform[];
    requireWalletLink?: boolean;
  }): GateCriteria => ({
    combined: {
      vineConfig: params.vineConfig,
      minPoints: new BN(params.minPoints),
      season: params.season,
      grapeSpace: params.grapeSpace,
      platforms: Buffer.from(params.platforms),
      requireWalletLink: params.requireWalletLink ?? false,
    },
  }),

  timeLockedReputation: (params: {
    vineConfig: PublicKey;
    minPoints: number | BN;
    season: number;
    minHoldDurationSeconds: number | BN;
  }): GateCriteria => ({
    timeLockedReputation: {
      vineConfig: params.vineConfig,
      minPoints: new BN(params.minPoints),
      season: params.season,
      minHoldDurationSeconds: new BN(params.minHoldDurationSeconds),
    },
  }),

  multiDao: (params: {
    requiredGates: PublicKey[];
    requireAll?: boolean;
  }): GateCriteria => ({
    multiDao: {
      requiredGates: params.requiredGates,
      requireAll: params.requireAll ?? true,
    },
  }),

  tokenHolding: (params: {
    mint: PublicKey;
    minAmount: number | BN;
    checkAta?: boolean;
  }): GateCriteria => ({
    tokenHolding: {
      mint: params.mint,
      minAmount: new BN(params.minAmount),
      checkAta: params.checkAta ?? true,
    },
  }),

  nftCollection: (params: {
    collectionMint: PublicKey;
    minCount?: number;
  }): GateCriteria => ({
    nftCollection: {
      collectionMint: params.collectionMint,
      minCount: params.minCount ?? 1,
    },
  }),

  customProgram: (params: {
    programId: PublicKey;
    instructionData?: Buffer;
  }): GateCriteria => ({
    customProgram: {
      programId: params.programId,
      instructionData: params.instructionData ?? Buffer.alloc(0),
    },
  }),
};

// ─────────────────────────────────────────────────────────
// ACCOUNT TYPES
// ─────────────────────────────────────────────────────────

export interface Gate {
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

export interface GateCheckRecord {
  version: number;
  gate: PublicKey;
  user: PublicKey;
  passed: boolean;
  checkedAt: BN;
  bump: number;
}

// ─────────────────────────────────────────────────────────
// SDK OPTIONS / PARAMS
// ─────────────────────────────────────────────────────────

export interface InitializeGateParams {
  /** Unique identifier for this gate (use a fresh Keypair.publicKey) */
  gateId: PublicKey;
  criteria: GateCriteria;
  gateType: GateType;
  /** Defaults to the provider wallet */
  authority?: PublicKey;
}

export interface CheckGateParams {
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

export interface UpdateGateCriteriaParams {
  gateId: PublicKey;
  newCriteria: GateCriteria;
}

export interface SetGateActiveParams {
  gateId: PublicKey;
  isActive: boolean;
}

export interface CloseGateParams {
  gateId: PublicKey;
  /** SOL recipient — defaults to provider wallet */
  recipient?: PublicKey;
}
