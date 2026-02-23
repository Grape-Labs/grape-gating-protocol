// ─────────────────────────────────────────────────────────────────────────────
// @grapenpm/grape-access-sdk
// Grape Gating Protocol SDK
// Program: GPASSzQQF1H8cdj5pUwFkeYEE4VdMQtCrYtUaMXvPz48
// ─────────────────────────────────────────────────────────────────────────────

// Client
export { GpassClient } from "./client";

// IDL
export { IDL, GrapeGatingProtocol } from "./idl";

// PDA helpers
export {
  findGatePda,
  findCheckRecordPda,
  findVineConfigPda,
  findVineReputationPda,
  findGrapeSpacePda,
  findGrapeIdentityPda,
  findGrapeLinkPda,
} from "./pda";

// Types & constants
export {
  GPASS_PROGRAM_ID,
  VINE_REPUTATION_PROGRAM_ID,
  GRAPE_VERIFICATION_PROGRAM_ID,
  VerificationPlatform,
  GateTypeFactory,
  GateCriteriaFactory,
} from "./types";

export type {
  Gate,
  GateCheckRecord,
  GateCriteria,
  GateType,
  InitializeGateParams,
  CheckGateParams,
  UpdateGateCriteriaParams,
  SetGateActiveParams,
  CloseGateParams,
} from "./types";
