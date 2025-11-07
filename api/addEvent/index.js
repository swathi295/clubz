const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  const blobConnection = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = "clubdata";
  const blobName = "events.json";
  const newEvent = req.body;

  try {
    const blobService = BlobServiceClient.fromConnectionString(blobConnection);
    const container = blobService.getContainerClient(containerName);
    const blob = container.getBlockBlobClient(blobName);

    // read existing data
    let data = { clubs: [] };
    try {
      const dl = await blob.downloadToBuffer();
      data = JSON.parse(dl.toString());
    } catch (e) {
      context.log("Creating new events.json file...");
    }

    data.clubs.push(newEvent);

    await blob.upload(JSON.stringify(data, null, 2), Buffer.byteLength(JSON.stringify(data)), { overwrite: true });

    context.res = {
      status: 200,
      body: { message: "✅ Event successfully added!" },
    };
  } catch (err) {
    context.log("Error:", err.message);
    context.res = {
      status: 500,
      body: { error: err.message },
    };
  }
};
