import {
  AnchorProvider,
  Program,
  BN,
} from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  SendTransactionError,
} from "@solana/web3.js";
import { IDL, GrapeGatingProtocol } from "./idl";
import {
  GPASS_PROGRAM_ID,
  Gate,
  GateCheckRecord,
  GateCriteria,
  GateType,
  GateTypeFactory,
  InitializeGateParams,
  CheckGateParams,
  UpdateGateCriteriaParams,
  SetGateActiveParams,
  CloseGateParams,
} from "./types";
import {
  findGatePda,
  findCheckRecordPda,
} from "./pda";

export class GpassClient {
  public readonly program: Program<GrapeGatingProtocol>;
  public readonly provider: AnchorProvider;

  constructor(provider: AnchorProvider, programId: PublicKey = GPASS_PROGRAM_ID) {
    this.provider = provider;
    this.program = new Program<GrapeGatingProtocol>(IDL, programId, provider);
  }

  // ─────────────────────────────────────────────────────
  // INITIALIZE GATE
  // ─────────────────────────────────────────────────────

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
  async initializeGate(params: InitializeGateParams): Promise<{
    tx: string;
    gate: PublicKey;
  }> {
    const authority = params.authority ?? this.provider.wallet.publicKey;
    const [gatePda] = await findGatePda(params.gateId);

    const tx = await this.program.methods
      .initializeGate(params.gateId, params.criteria as any, params.gateType as any)
      .accounts({
        gate: gatePda,
        authority,
        payer: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { tx, gate: gatePda };
  }

  // ─────────────────────────────────────────────────────
  // CHECK GATE
  // ─────────────────────────────────────────────────────

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
  async checkGate(params: CheckGateParams): Promise<string> {
    const [gatePda] = await findGatePda(params.gateId);
    const [checkRecordPda] = params.storeRecord
      ? await findCheckRecordPda(gatePda, params.user)
      : [null];

    const tx = await this.program.methods
      .checkGate(params.gateId)
      .accounts({
        gate: gatePda,
        user: params.user,
        reputationAccount: params.reputationAccount ?? null,
        identityAccount: params.identityAccount ?? null,
        linkAccount: params.linkAccount ?? null,
        tokenAccount: params.tokenAccount ?? null,
        checkRecord: checkRecordPda ?? null,
        payer: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  /**
   * Simulate a gate check without submitting a transaction.
   * Returns true if the user would pass, false otherwise.
   * Does NOT throw — use this for UI gating.
   */
  async simulateCheckGate(params: CheckGateParams): Promise<boolean> {
    try {
      const [gatePda] = await findGatePda(params.gateId);
      const [checkRecordPda] = params.storeRecord
        ? await findCheckRecordPda(gatePda, params.user)
        : [null];

      await this.program.methods
        .checkGate(params.gateId)
        .accounts({
          gate: gatePda,
          user: params.user,
          reputationAccount: params.reputationAccount ?? null,
          identityAccount: params.identityAccount ?? null,
          linkAccount: params.linkAccount ?? null,
          tokenAccount: params.tokenAccount ?? null,
          checkRecord: checkRecordPda ?? null,
          payer: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .simulate();

      return true;
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────────────
  // UPDATE GATE
  // ─────────────────────────────────────────────────────

  /**
   * Update the criteria for an existing gate.
   */
  async updateGateCriteria(params: UpdateGateCriteriaParams): Promise<string> {
    const [gatePda] = await findGatePda(params.gateId);

    return this.program.methods
      .updateGateCriteria(params.gateId, params.newCriteria as any)
      .accounts({
        gate: gatePda,
        authority: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  /**
   * Enable or disable a gate.
   */
  async setGateActive(params: SetGateActiveParams): Promise<string> {
    const [gatePda] = await findGatePda(params.gateId);

    return this.program.methods
      .setGateActive(params.gateId, params.isActive)
      .accounts({
        gate: gatePda,
        authority: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  /**
   * Transfer gate authority to a new public key.
   */
  async setGateAuthority(params: {
    gateId: PublicKey;
    newAuthority: PublicKey;
  }): Promise<string> {
    const [gatePda] = await findGatePda(params.gateId);

    return this.program.methods
      .setGateAuthority(params.gateId, params.newAuthority)
      .accounts({
        gate: gatePda,
        authority: this.provider.wallet.publicKey,
      })
      .rpc();
  }

  // ─────────────────────────────────────────────────────
  // CLOSE
  // ─────────────────────────────────────────────────────

  /**
   * Close a gate and reclaim rent.
   */
  async closeGate(params: CloseGateParams): Promise<string> {
    const [gatePda] = await findGatePda(params.gateId);
    const recipient = params.recipient ?? this.provider.wallet.publicKey;

    return this.program.methods
      .closeGate(params.gateId)
      .accounts({
        gate: gatePda,
        authority: this.provider.wallet.publicKey,
        recipient,
      })
      .rpc();
  }

  /**
   * Close a check record and reclaim rent.
   */
  async closeCheckRecord(params: {
    gateId: PublicKey;
    user: PublicKey;
    recipient?: PublicKey;
  }): Promise<string> {
    const [gatePda] = await findGatePda(params.gateId);
    const [checkRecordPda] = await findCheckRecordPda(gatePda, params.user);
    const recipient = params.recipient ?? this.provider.wallet.publicKey;

    return this.program.methods
      .closeCheckRecord(params.gateId)
      .accounts({
        gate: gatePda,
        user: params.user,
        checkRecord: checkRecordPda,
        authority: this.provider.wallet.publicKey,
        recipient,
      })
      .rpc();
  }

  // ─────────────────────────────────────────────────────
  // FETCH ACCOUNTS
  // ─────────────────────────────────────────────────────

  /**
   * Fetch a Gate account.
   */
  async fetchGate(gateId: PublicKey): Promise<Gate | null> {
    const [gatePda] = await findGatePda(gateId);
    try {
      return (await this.program.account.gate.fetch(gatePda)) as unknown as Gate;
    } catch {
      return null;
    }
  }

  /**
   * Fetch a GateCheckRecord for a user.
   */
  async fetchCheckRecord(
    gateId: PublicKey,
    user: PublicKey
  ): Promise<GateCheckRecord | null> {
    const [gatePda] = await findGatePda(gateId);
    const [checkRecordPda] = await findCheckRecordPda(gatePda, user);
    try {
      return (await this.program.account.gateCheckRecord.fetch(
        checkRecordPda
      )) as unknown as GateCheckRecord;
    } catch {
      return null;
    }
  }

  /**
   * Fetch all gates owned by a specific authority.
   */
  async fetchGatesByAuthority(authority: PublicKey): Promise<
    { publicKey: PublicKey; account: Gate }[]
  > {
    const accounts = await this.program.account.gate.all([
      {
        memcmp: {
          offset: 8 + 1 + 32, // discriminator + version + gateId
          bytes: authority.toBase58(),
        },
      },
    ]);
    return accounts as unknown as { publicKey: PublicKey; account: Gate }[];
  }

  // ─────────────────────────────────────────────────────
  // INSTRUCTION BUILDERS (for composing with other txns)
  // ─────────────────────────────────────────────────────

  /**
   * Returns the raw instruction for checkGate — useful for
   * bundling into a larger transaction (e.g., CPI-style on client side).
   */
  async buildCheckGateInstruction(
    params: CheckGateParams
  ): Promise<TransactionInstruction> {
    const [gatePda] = await findGatePda(params.gateId);
    const [checkRecordPda] = params.storeRecord
      ? await findCheckRecordPda(gatePda, params.user)
      : [null];

    return this.program.methods
      .checkGate(params.gateId)
      .accounts({
        gate: gatePda,
        user: params.user,
        reputationAccount: params.reputationAccount ?? null,
        identityAccount: params.identityAccount ?? null,
        linkAccount: params.linkAccount ?? null,
        tokenAccount: params.tokenAccount ?? null,
        checkRecord: checkRecordPda ?? null,
        payer: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
  }

  /**
   * Build a full transaction that checks a gate and then executes
   * additional instructions (e.g., mint, vote, transfer).
   */
  async buildGatedTransaction(
    checkParams: CheckGateParams,
    ...additionalInstructions: TransactionInstruction[]
  ): Promise<Transaction> {
    const checkIx = await this.buildCheckGateInstruction(checkParams);
    const tx = new Transaction();
    tx.add(checkIx, ...additionalInstructions);
    return tx;
  }
}
