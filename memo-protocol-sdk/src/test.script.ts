import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { parseMemoFromTx, decodeMemoMessage, parseMemo } from '.';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

  
async function fetchTx(txDigest: string) {
  const tx = await client.getTransactionBlock({ digest: txDigest, options: { showEvents: true } });
  return tx;
}

async function main() {
  const tx = await fetchTx("3sGid6Rc6RAgvarS2NkPDmPTsZhJAid45UJApZYc8RyN");
  const memos = parseMemo(tx.events?.[0]);
  //const memos = parseMemoFromTx(tx);
  console.log(memos);
  console.log(decodeMemoMessage(memos));
}

main().catch(console.error);


