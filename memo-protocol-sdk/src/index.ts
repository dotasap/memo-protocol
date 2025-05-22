import { SuiTransactionBlockResponse, SuiEvent } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export interface MemoOptions {
  moduleAddress?: string;
}

export interface MemoEvent {
  sender: string;
  message: Uint8Array;
}

const DEFAULT_MODULE_ADDRESS = "0x21eba4a9ac6005260f45e776afebf02de42eada48438deceac0b76b9886e37d8";

/**
 * Attaches a memo to a Sui transaction block
 * @param tx The transaction block to attach the memo to
 * @param memo The memo message to attach
 * @param options Configuration options - the module address if
 */
export const attachMemo = (
  tx: Transaction,
  memo: string,
  options: MemoOptions = {}
): void => {
  
  // Max - 1024 bytes
  if (memo.length > 1024) {
    throw new Error("Memo message too long. Maximum length is 1024 bytes.");
  }
  
  if (memo.length === 0) {
    throw new Error("Memo message cannot be empty.");
  }

  const moduleAddress = options.moduleAddress || DEFAULT_MODULE_ADDRESS;

  tx.moveCall({
    target: `${moduleAddress}::memo_protocol::emit_memo`,
    arguments: [tx.pure.string(memo)],
  });
};




/**
 * Parses a memo event from the transaction effects
 * @param event The raw event data from the transaction effects
 * @returns The parsed memo event
 */
export const parseMemo = (event: any): MemoEvent => {
  if (!event || !event.parsedJson) {
    throw new Error("Invalid memo event data");
  }

  const { sender, message } = event.parsedJson;
  
  if (!sender || !message) {
    throw new Error("Invalid memo event format");
  }

  return {
    sender,
    message: new Uint8Array(message as number[]),
  };
};



/**
 * Parses memo events directly from a Sui transaction response
 * @param txResponse The Sui transaction response
 * @returns Array of parsed memo events
 */
export const parseMemoFromTx = (txResponse: SuiTransactionBlockResponse): MemoEvent[] => {
  if (!txResponse.events) {
    return [];
  }

  const memoEvents = txResponse.events.filter((event: SuiEvent) => 
    event.type.includes("memo_protocol::MemoEvent")
  );

  return memoEvents.map((event: SuiEvent) => parseMemo(event));
};




/**
 * Helper function to decode memo message from bytes to string
 * @param memoEvent The memo event to decode
 * @returns The decoded memo message as a string
 */
export const decodeMemoMessage = (memoEvent: MemoEvent): string => {
  return new TextDecoder().decode(memoEvent.message);
}; 