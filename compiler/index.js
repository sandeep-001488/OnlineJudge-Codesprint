const app = require("./app");
const { PORT } = require("./src/config/constants");

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error while starting the server:", error);
    process.exit(1);
  } else {
    console.log(`🚀 Compiler Server running at port ${PORT}`);
  }
});
