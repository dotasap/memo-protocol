import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { parseMemoFromTx, decodeMemoMessage, parseMemo } from '.';
import { describe, it, expect } from '@jest/globals';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });
const txDigest = "3sGid6Rc6RAgvarS2NkPDmPTsZhJAid45UJApZYc8RyN";


describe("Memo Protocol SDK (Live Test)", () => {
  it("parses memo from real transaction", async () => {
    const tx = await client.getTransactionBlock({
      digest: txDigest,
      options: { showEvents: true },
    });
  
    const memos = parseMemoFromTx(tx);
    expect(memos.length).toBeGreaterThan(0);
  
    const decoded = decodeMemoMessage(memos[0]);
    console.log("Decoded memo:", decoded);
  
    expect(decoded).toBe("Hi there");
  });

  
  it("parses memo from real tx event", async () => {
    const tx = await client.getTransactionBlock({
      digest: txDigest,
      options: { showEvents: true },
    });
  
    const memo = parseMemo(tx.events?.[0]);
  
    const decoded = decodeMemoMessage(memo);
    console.log("Decoded memo via tx event:", decoded);
  
    expect(decoded).toBe("Hi there");
  });
});

  
