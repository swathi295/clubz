const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  const blobConnection = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = "clubdata";
  const blobName = "events.json";

  try {
    const blobService = BlobServiceClient.fromConnectionString(blobConnection);
    const container = blobService.getContainerClient(containerName);
    const blob = container.getBlockBlobClient(blobName);

    const dl = await blob.downloadToBuffer();
    const data = JSON.parse(dl.toString());

    context.res = {
      status: 200,
      body: data,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: "Failed to fetch events." },
    };
  }
};
