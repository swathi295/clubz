import { v4 as uuid } from "uuid";
import { writeEvent } from "../shared/storage.js";

export default async function (context, req) {
  if (req.method !== "POST") {
    context.res = { status: 405, body: { message: "Method not allowed" } };
    return;
  }

  const { token, title, club, date, location, description } = req.body || {};

  if (!token || token !== process.env.ADMIN_TOKEN) {
    context.res = { status: 401, body: { message: "Unauthorized" } };
    return;
  }

  if (!title || !club || !date || !location || !description) {
    context.res = { status: 400, body: { message: "Missing fields" } };
    return;
  }

  const event = {
    id: uuid(),
    title,
    club,
    date,
    location,
    description,
    createdAt: new Date().toISOString(),
  };

  await writeEvent(event);

  context.res = {
    status: 200,
    body: { message: "✅ Event created successfully!", id: event.id },
  };
}
