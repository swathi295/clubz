import { BlobServiceClient } from "@azure/storage-blob";
const conn = process.env.BLOB_CONNECTION_STRING || process.env.AzureWebJobsStorage;
if(!conn) throw new Error("Missing BLOB_CONNECTION_STRING / AzureWebJobsStorage");

const service = BlobServiceClient.fromConnectionString(conn);
const EVENTS = "events";
const REGS   = "registrations";

async function ensure() {
  for (const c of [EVENTS, REGS]) {
    const cl = service.getContainerClient(c);
    if (!(await cl.exists())) await cl.create({ access: "private" });
  }
}
export async function writeEvent(e) {
  await ensure();
  const cc = service.getContainerClient(EVENTS);
  const blob = cc.getBlockBlobClient(`${e.id}.json`);
  const buf = Buffer.from(JSON.stringify(e));
  await blob.upload(buf, buf.length);
}
export async function listEvents() {
  await ensure();
  const cc = service.getContainerClient(EVENTS);
  const out = [];
  for await (const b of cc.listBlobsFlat()) {
    const dl = await cc.getBlobClient(b.name).download();
    const text = await streamToString(dl.readableStreamBody);
    out.push(JSON.parse(text));
  }
  return out;
}
export async function writeReg(r) {
  await ensure();
  const cc = service.getContainerClient(REGS);
  const key = `${r.eventId}/${Date.now()}-${(r.name||'anon').replace(/\s+/g,'_')}.json`;
  const buf = Buffer.from(JSON.stringify(r));
  await cc.getBlockBlobClient(key).upload(buf, buf.length);
}
function streamToString(readable) {
  return new Promise((resolve,reject)=>{
    const chunks=[]; readable.on('data',d=>chunks.push(d.toString()));
    readable.on('end',()=>resolve(chunks.join(''))); readable.on('error',reject);
  });
}
