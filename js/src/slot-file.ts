import { BinFile } from './bin-file';

/**
 * SlotFile wraps BinFile to work with DELTA's slot-based binary format.
 * For now it exposes a minimal API for reading slot headers.
 */
export interface SlotHeader {
  size: number;
  previous: number;
  next: number;
}

export class SlotFile extends BinFile {
  /**
   * Reads a slot header at the current position.
   * The format consists of three 32-bit integers: size, previous, next.
   */
  readHeader(): SlotHeader {
    const size = this.readInt32();
    const previous = this.readInt32();
    const next = this.readInt32();
    return { size, previous, next };
  }
}
