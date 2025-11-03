const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://dsms:dsms@dsms.tsjqnfe.mongodb.net/?appName=DSMS";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function runGetStarted() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected successfully to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  } finally {
    // Don't close the client if your app needs persistent connection
    // await client.close();
  }
}

module.exports = { runGetStarted };
