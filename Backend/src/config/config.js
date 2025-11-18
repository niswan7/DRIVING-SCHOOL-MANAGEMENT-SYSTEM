/**
 * Configuration class for application settings
 * Centralized configuration management using environment variables
 */
class Config {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.nodeEnv = process.env.NODE_ENV || 'development';
        this.mongodbUri = process.env.MONGODB_URI;
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpire = process.env.JWT_EXPIRE || '7d';
    }

    /**
     * Validate required configuration
     */
    validate() {
        const required = ['mongodbUri', 'jwtSecret'];
        const missing = required.filter(key => !this[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required configuration: ${missing.join(', ')}`);
        }
    }

    /**
     * Get configuration object
     */
    getConfig() {
        return {
            port: this.port,
            nodeEnv: this.nodeEnv,
            mongodbUri: this.mongodbUri,
            jwtSecret: this.jwtSecret,
            jwtExpire: this.jwtExpire
        };
    }
}

module.exports = new Config();