import { writeReg } from "../shared/storage.js";
export default async function (context, req) {
  if (req.method !== 'POST') { context.res = { status:405, body:{message:'Method not allowed'} }; return; }
  const { eventId, name, email, dept } = req.body || {};
  if (!eventId || !name || !email) { context.res = { status:400, body:{message:'Missing fields'} }; return; }
  await writeReg({ eventId, name, email, dept, createdAt: new Date().toISOString() });
  context.res = { status:200, body:{message:'Registration submitted'} };
}
