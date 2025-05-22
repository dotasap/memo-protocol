# Memo Protocol SDK

A TypeScript SDK for interacting with the Memo Protocol on Sui blockchain.

## Installation

```bash
npm install memo-protocol-sdk
```

## Usage

### Basic Usage

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { attachMemo, parseMemo, parseMemoFromTx, decodeMemoMessage } from "memo-protocol-sdk";

// Attach a memo to a transaction
const tx = new Transaction();
attachMemo(tx, "Hello World");

// Optionally specify a custom contract address if you've deployed your own
attachMemo(tx, "Hello World", { moduleAddress: "0x..." });

// Parse memos from a transaction response
const memos = parseMemoFromTx(txResponse);
const decodedMessages = memos.map(decodeMemoMessage);

// Parse a single memo event
const memo = parseMemo(event);
const message = decodeMemoMessage(memo);
```

### API Reference

#### `attachMemo(tx: Transaction, message: string)`
Attaches a memo message to a transaction. The message must be non-empty and less than 1024 bytes.

#### `parseMemo(event: SuiEvent): MemoEvent`
Parses a memo event from a Sui event object.

#### `parseMemoFromTx(tx: SuiTransactionBlockResponse): MemoEvent[]`
Parses all memo events from a transaction response.

#### `decodeMemoMessage(memo: MemoEvent): string`
Decodes the message bytes from a memo event into a string.

#### Note that memos are emitted as events so the option
`showEvents: true` is necessary.

## Project Structure

```
memo-protocol-sdk/
├── src/
│   ├── index.ts           # Main SDK implementation
│   ├── index.test.ts      # Unit tests
│   ├── live.test.ts       # Live network tests
│   └── test.script.ts     # Example usage script
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Running Example Script

```bash
npx ts-node src/test.script.ts
```

## License

MIT 