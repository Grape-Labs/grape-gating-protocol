# @grapenpm/grape-access-sdk

TypeScript SDK for the **Grape Access/Gating Protocol** — composable access control for Solana DAOs.

**Program ID:** `GPASSzQQF1H8cdj5pUwFkeYEE4VdMQtCrYtUaMXvPz48`

---

## Install

```bash
npm install @grapenpm/grape-access-sdk
# peer deps
npm install @coral-xyz/anchor @solana/web3.js
```

---

## Quick Start

```typescript
import { GpassClient, GateCriteriaFactory, GateTypeFactory, VerificationPlatform } from "@grapenpm/grape-access-sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";

const provider = AnchorProvider.env();
const client = new GpassClient(provider);

// 1. Create a gate — require 500 Vine reputation + Discord verified
const gateId = Keypair.generate().publicKey;

const { tx, gate } = await client.initializeGate({
  gateId,
  criteria: GateCriteriaFactory.combined({
    vineConfig:        myVineConfigPda,
    minPoints:         500,
    season:            1,
    grapeSpace:        myGrapeSpacePda,
    platforms:         [VerificationPlatform.Discord],
    requireWalletLink: true,
  }),
  gateType: GateTypeFactory.reusable(),
});

// 2. Check if a user passes
await client.checkGate({
  gateId,
  user:              userWallet,
  reputationAccount: vineRepPda,
  identityAccount:   grapeIdentityPda,
  linkAccount:       grapeLinkPda,
  storeRecord:       true,
});

// 3. Simulate without submitting (great for UI)
const passes = await client.simulateCheckGate({
  gateId,
  user:              userWallet,
  reputationAccount: vineRepPda,
  identityAccount:   grapeIdentityPda,
});
console.log("User passes gate:", passes);
```

---

## Gate Criteria

### `MinReputation`
Require a minimum Vine reputation score for a season.
```typescript
GateCriteriaFactory.minReputation({
  vineConfig: vineConfigPda,
  minPoints:  1000,
  season:     2,
})
```

### `VerifiedIdentity`
Require a verified Grape identity on one or more platforms.
```typescript
GateCriteriaFactory.verifiedIdentity({
  grapeSpace: grapeSpacePda,
  platforms:  [VerificationPlatform.Discord, VerificationPlatform.Twitter],
})
```

### `VerifiedWithWallet`
Require a verified identity AND a wallet link.
```typescript
GateCriteriaFactory.verifiedWithWallet({
  grapeSpace: grapeSpacePda,
  platforms:  [VerificationPlatform.Discord],
})
```

### `Combined` ⭐ Most powerful
Require reputation + verification together.
```typescript
GateCriteriaFactory.combined({
  vineConfig:        vineConfigPda,
  minPoints:         500,
  season:            1,
  grapeSpace:        grapeSpacePda,
  platforms:         [VerificationPlatform.Discord],
  requireWalletLink: true,
})
```

### `TimeLockedReputation`
Require the user to have held reputation for a minimum duration.
```typescript
GateCriteriaFactory.timeLockedReputation({
  vineConfig:               vineConfigPda,
  minPoints:                100,
  season:                   1,
  minHoldDurationSeconds:   30 * 24 * 60 * 60, // 30 days
})
```

### `MultiDao`
Require passing gates from multiple DAOs (AND / OR logic).
```typescript
GateCriteriaFactory.multiDao({
  requiredGates: [daoAGate, daoBGate, daoCGate],
  requireAll:    true, // AND — user must pass all gates
})
```

### `TokenHolding`
Require holding a minimum amount of a specific token.
```typescript
GateCriteriaFactory.tokenHolding({
  mint:      tokenMint,
  minAmount: 100_000_000, // 100 tokens (with 6 decimals)
  checkAta:  true,
})
```

### `NftCollection`
Require owning NFTs from a collection.
```typescript
GateCriteriaFactory.nftCollection({
  collectionMint: collectionMint,
  minCount:       1,
})
```

---

## Gate Types

| Type | Description |
|------|-------------|
| `GateTypeFactory.singleUse()` | One-time access check |
| `GateTypeFactory.reusable()` | Unlimited checks |
| `GateTypeFactory.timeLimited(86400)` | Valid 24h after check |
| `GateTypeFactory.subscription(604800)` | Must re-check weekly |

---

## PDA Helpers

```typescript
import {
  findGatePda,
  findCheckRecordPda,
  findVineReputationPda,
  findGrapeIdentityPda,
  findGrapeLinkPda,
} from "@grapenpm/grape-access-sdk";

// Gate PDA
const [gatePda] = await findGatePda(gateId);

// Check record PDA
const [checkRecordPda] = await findCheckRecordPda(gatePda, userWallet);

// Vine reputation PDA
const [repPda] = await findVineReputationPda(vineConfigPda, userWallet, season);

// Grape identity PDA
const [identityPda] = await findGrapeIdentityPda(
  grapeSpacePda,
  VerificationPlatform.Discord,  // platformSeed
  idHash                          // Uint8Array[32]
);
```

---

## Composing with Other Instructions

Gate checks can be bundled with your own instructions in a single atomic transaction:

```typescript
// Build a gated mint transaction
const mintIx = await myNftProgram.methods.mint().accounts({...}).instruction();

const tx = await client.buildGatedTransaction(
  {
    gateId,
    user:             userWallet,
    reputationAccount: repPda,
    identityAccount:   identityPda,
  },
  mintIx  // only executes if gate check passes
);

await provider.sendAndConfirm(tx);
```

---

## Fetching Accounts

```typescript
// Fetch a gate
const gate = await client.fetchGate(gateId);
console.log("Pass rate:", gate.successfulChecks / gate.totalChecks);

// Fetch a user's check record
const record = await client.fetchCheckRecord(gateId, userWallet);
console.log("Last checked:", new Date(record.checkedAt.toNumber() * 1000));

// Fetch all gates owned by an authority
const myGates = await client.fetchGatesByAuthority(myWallet);
```

---

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 6000 | Unauthorized | Wrong authority |
| 6001 | GateInactive | Gate has been disabled |
| 6002 | GateCheckFailed | User did not pass criteria |
| 6003 | ReputationAccountRequired | Missing Vine account |
| 6004 | IdentityAccountRequired | Missing Grape identity |
| 6005 | LinkAccountRequired | Missing wallet link |
| 6006 | TokenAccountRequired | Missing token account |
| 6015 | IdentityNotVerified | Identity exists but unverified |
| 6016 | IdentityExpired | Verification has expired |
| 6012 | SeasonMismatch | Wrong reputation season |

---

## License

MIT — Grape Protocol
