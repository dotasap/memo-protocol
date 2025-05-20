import { Transaction } from "@mysten/sui/transactions";
import { SuiTransactionBlockResponse, SuiEvent } from "@mysten/sui/client";
import { attachMemo, parseMemo, parseMemoFromTx, decodeMemoMessage } from "./index";
import { describe, it, expect } from '@jest/globals';

describe("Memo Protocol SDK", () => {
  describe("attachMemo", () => {
    it("should attach memo to transaction", () => {
      const tx = new Transaction();
      const memo = "Test memo";
      
      attachMemo(tx, memo);
      
      // Verify the transaction has the correct move call
      const moveCall = tx.blockData.transactions[0] as { kind: "MoveCall"; target: string; arguments: any[] };
      expect(moveCall).toMatchObject({
        kind: "MoveCall",
        target: expect.stringContaining("memo_protocol::emit_memo"),
      });

      expect(moveCall.arguments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            kind: "Input",
            value: expect.objectContaining({
              Pure: expect.any(Array),
            }),
          }),
        ])
      );
    });

    it("should throw error for empty memo", () => {
      const tx = new Transaction();
      expect(() => attachMemo(tx, "")).toThrow("Memo message cannot be empty");
    });

    it("should throw error for memo too long", () => {
      const tx = new Transaction();
      const aVeryVeryLongMemo = "a".repeat(1025);
      expect(() => attachMemo(tx, aVeryVeryLongMemo)).toThrow("Memo message too long");
    });
  });

  describe("parseMemo and parseMemoFromTx", () => {
    const mockEvent: SuiEvent = {
      id: { txDigest: "0x123", eventSeq: "0" },
      packageId: "0x456",
      transactionModule: "memo_protocol",
      sender: "0x789",
      type: "memo_protocol::MemoEvent",
      parsedJson: {
        sender: "0x789",
        message: [72, 101, 108, 108, 111] // i passed in "Hello" in bytes
      },
      bcs: "",
      bcsEncoding: "base58",
      timestampMs: "1234567890"
    };

    it("should parse memo event", () => {
      const parsed = parseMemo(mockEvent);
      expect(parsed.sender).toBe("0x789");
      expect(decodeMemoMessage(parsed)).toBe("Hello");
    });

    it("should parse memo from transaction response", () => {
      const mockTxResponse: SuiTransactionBlockResponse = {
        digest: "0x123",
        transaction: {
          data: {
            sender: "0x123",
            gasData: { payment: [], budget: "0", owner: "0x123", price: "0" },
            messageVersion: "v1",
            transaction: { 
              kind: "ProgrammableTransaction",
              inputs: [],
              transactions: []
            }
          },
          txSignatures: []
        },
        effects: {
          transactionDigest: "0x123",
          executedEpoch: "0",
          gasObject: { 
            reference: { objectId: "0x123", version: "0", digest: "0x123" },
            owner: { AddressOwner: "0x123" }
          },
          gasUsed: { 
            computationCost: "0", 
            storageCost: "0", 
            storageRebate: "0",
            nonRefundableStorageFee: "0"
          },
          messageVersion: "v1",
          status: { status: "success" },
          created: []
        },
        events: [mockEvent],
        timestampMs: "1234567890",
        confirmedLocalExecution: true
      };

      const memos = parseMemoFromTx(mockTxResponse);
      expect(memos).toHaveLength(1);
      expect(decodeMemoMessage(memos[0])).toBe("Hello");
    });

    it("should throw on invalid memo event format", () => {
        expect(() =>
          parseMemo({
            ...mockEvent,
            parsedJson: { sender: "0x789" } // missing message
          })
        ).toThrow("Invalid memo event format");
    });
  });
}); 