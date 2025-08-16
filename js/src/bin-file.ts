/**
 * Minimal binary file reader backed by an ArrayBuffer.
 * Provides little-endian reads and simple seek operations.
 */
export class BinFile {
  private view: DataView;
  private offset = 0;

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
  }

  /** Current read position */
  get position(): number {
    return this.offset;
  }

  /**
   * Moves the current position to the given offset.
   * @param position byte offset relative to the start of the buffer
   */
  seek(position: number): void {
    this.offset = position;
  }

  /** Advances the current position by the given number of bytes */
  skip(bytes: number): void {
    this.offset += bytes;
  }

  /** Reads an unsigned byte */
  readUint8(): number {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  /** Reads a signed 16-bit integer */
  readInt16(): number {
    const value = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return value;
  }

  /** Reads a signed 32-bit integer */
  readInt32(): number {
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  /** Reads a string of the given byte length using UTF-8 */
  readString(length: number): string {
    const bytes = new Uint8Array(this.view.buffer, this.offset, length);
    this.offset += length;
    return new TextDecoder("utf-8").decode(bytes);
  }
}
