const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require('../src/config/config');

/**
 * MongoDB Connection Manager
 * Handles database connection lifecycle using singleton pattern
 */
class MongoDBConnection {
    constructor() {
        this.client = null;
        this.db = null;
        // Use the MongoDB URI from config, or fallback to the hardcoded one
        this.uri = config.mongodbUri || "mongodb+srv://dsms:dsms@dsms.tsjqnfe.mongodb.net/?appName=DSMS";
    }

    /**
     * Connect to MongoDB
     * @returns {Promise<Db>} Database instance
     */
    async connect() {
        try {
            if (this.db) {
                return this.db;
            }

            this.client = new MongoClient(this.uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });

            await this.client.connect();
            await this.client.db("admin").command({ ping: 1 });
            this.db = this.client.db('driving_school');
            
            console.log('✅ Successfully connected to MongoDB');
            return this.db;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    /**
     * Get database instance
     * @returns {Db} Database instance
     */
    getDb() {
        if (!this.db) {
            throw new Error('Database not initialized. Call connect() first.');
        }
        return this.db;
    }

    /**
     * Close database connection
     */
    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            console.log('MongoDB connection closed');
        }
    }
}

module.exports = new MongoDBConnection();
