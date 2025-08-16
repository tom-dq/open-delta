# Java to JavaScript migration: repository and slot file architecture

This document summarizes the pieces of the existing Java codebase that a first-pass
JavaScript port needs in order to read existing DELTA `.dlt` datasets in the browser.

## Module overview

- **common** – shared utilities and I/O abstractions. Houses the low level binary
  reader [`BinFile`](../common/src/main/java/au/org/ala/delta/io/BinFile.java),
  its associated [`BinFileMode`](../common/src/main/java/au/org/ala/delta/io/BinFileMode.java)
  and [`BinFileEncoding`](../common/src/main/java/au/org/ala/delta/io/BinFileEncoding.java).
- **delta-editor** – core data access layer built around the "slot file" format. Key
  classes live under `editor/slotfile` and its `model` subpackage.
- **confor**, **delfor**, **intkey**, **key**, **dist** – applications built on top of
  the dataset API. These will be considered in later phases.

## Data flow for reading a `.dlt` file

1. [`DeltaFileReader`](../delta-editor/src/main/java/au/org/ala/delta/editor/DeltaFileReader.java)
   opens a [`DeltaVOP`](../delta-editor/src/main/java/au/org/ala/delta/editor/slotfile/DeltaVOP.java)
   for the selected file and constructs a [`SlotFileDataSet`](../delta-editor/src/main/java/au/org/ala/delta/editor/slotfile/model/SlotFileDataSet.java)
   via `SlotFileDataSetFactory`.
2. `SlotFileDataSet` exposes high-level methods such as `getItem`, `getCharacter`
   and `getAttributeAsString`, delegating to `DeltaVOP` to resolve item/character
   identifiers.
3. `DeltaVOP` manages the low-level slot file structures:
   - Keeps a `VODeltaMasterDesc` containing item and character lists.
   - Uses descriptor classes like `VOItemDesc`, `VOCharBaseDesc` and `VOImageDesc`
     to read and write the binary records backing each concept.
4. [`SlotFile`](../delta-editor/src/main/java/au/org/ala/delta/editor/slotfile/SlotFile.java)
   extends `BinFile` to handle the variable-sized "slots" used by `.dlt` files,
   including header management and free-space tracking.
5. `BinFile` wraps `RandomAccessFile` to provide little-endian reads/writes,
   seek operations and string encoding/decoding.

## Java concepts vs. JavaScript approach

| Java concept | Role in the Java code | JavaScript approach |
|--------------|-----------------------|--------------------|
| Binary file I/O (`BinFile`) | Little-endian access to the underlying slot file | Use the browser `File` API with `FileReader.readAsArrayBuffer` and wrap the result in `DataView`; no direct port of `BinFile` |
| `SlotFile` | Organizes variable-length slot records | Parse slot headers and records directly from the `ArrayBuffer` |
| `DeltaVOP` and descriptor classes | Map item and character identifiers to data | JS objects managing descriptor data and ID mapping |
| `SlotFileDataSet` | High-level dataset API | `DataSet` class exposing items, characters, and attributes |
| `DeltaFileReader` | Convenience loader | Function that accepts a `File` and returns a `DataSet` |

This architecture map will drive the TypeScript prototype that reads `.dlt`
files directly in the browser using native web APIs.

