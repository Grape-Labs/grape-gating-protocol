import { PublicKey } from "@solana/web3.js";
import { GPASS_PROGRAM_ID, VINE_REPUTATION_PROGRAM_ID, GRAPE_VERIFICATION_PROGRAM_ID } from "../types";

// ─────────────────────────────────────────────────────────
// GPASS PDAs
// ─────────────────────────────────────────────────────────

/**
 * Derives the Gate PDA for a given gate_id.
 * seeds = ["gate", gate_id]
 */
export async function findGatePda(
  gateId: PublicKey,
  programId: PublicKey = GPASS_PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [Buffer.from("gate"), gateId.toBuffer()],
    programId
  );
}

/**
 * Derives the GateCheckRecord PDA for a gate + user.
 * seeds = ["check", gate, user]
 */
export async function findCheckRecordPda(
  gate: PublicKey,
  user: PublicKey,
  programId: PublicKey = GPASS_PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [Buffer.from("check"), gate.toBuffer(), user.toBuffer()],
    programId
  );
}

// ─────────────────────────────────────────────────────────
// VINE REPUTATION PDAs
// ─────────────────────────────────────────────────────────

/**
 * Derives the Vine ReputationConfig PDA.
 * seeds = ["config", dao_id]
 */
export async function findVineConfigPda(
  daoId: PublicKey,
  programId: PublicKey = VINE_REPUTATION_PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [Buffer.from("config"), daoId.toBuffer()],
    programId
  );
}

/**
 * Derives the Vine Reputation PDA for a user in a config+season.
 * seeds = ["reputation", config, user, season_le_bytes]
 */
export async function findVineReputationPda(
  config: PublicKey,
  user: PublicKey,
  season: number,
  programId: PublicKey = VINE_REPUTATION_PROGRAM_ID
): Promise<[PublicKey, number]> {
  const seasonBuf = Buffer.alloc(2);
  seasonBuf.writeUInt16LE(season, 0);
  return PublicKey.findProgramAddress(
    [Buffer.from("reputation"), config.toBuffer(), user.toBuffer(), seasonBuf],
    programId
  );
}

// ─────────────────────────────────────────────────────────
// GRAPE VERIFICATION PDAs
// ─────────────────────────────────────────────────────────

/**
 * Derives the Grape VerificationSpace PDA.
 * seeds = ["space", dao_id]
 */
export async function findGrapeSpacePda(
  daoId: PublicKey,
  programId: PublicKey = GRAPE_VERIFICATION_PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [Buffer.from("space"), daoId.toBuffer()],
    programId
  );
}

/**
 * Derives the Grape Identity PDA.
 * seeds = ["identity", space, platform_seed, id_hash]
 */
export async function findGrapeIdentityPda(
  space: PublicKey,
  platformSeed: number,
  idHash: Uint8Array,
  programId: PublicKey = GRAPE_VERIFICATION_PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from("identity"),
      space.toBuffer(),
      Buffer.from([platformSeed]),
      Buffer.from(idHash),
    ],
    programId
  );
}

/**
 * Derives the Grape Link PDA.
 * seeds = ["link", identity, wallet_hash]
 */
export async function findGrapeLinkPda(
  identity: PublicKey,
  walletHash: Uint8Array,
  programId: PublicKey = GRAPE_VERIFICATION_PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [Buffer.from("link"), identity.toBuffer(), Buffer.from(walletHash)],
    programId
  );
}
