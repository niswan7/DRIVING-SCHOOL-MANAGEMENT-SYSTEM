const { runGetStarted } = require('../db/mongoConnect');
const app = require('./app');
const config = require('./config/config');

const PORT = config.port;
runGetStarted().catch(console.dir);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});