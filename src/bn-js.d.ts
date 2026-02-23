declare module "bn.js" {
  class BN {
    constructor(
      value?:
        | number
        | string
        | number[]
        | Uint8Array
        | Buffer
        | BN,
      base?: number | "hex",
      endian?: "le" | "be"
    );
    toNumber(): number;
    toString(base?: number | "hex", length?: number): string;
  }
  export default BN;
}
