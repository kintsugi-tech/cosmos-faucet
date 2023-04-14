import { createServer } from "./server";
import { log } from "logger";
import * as dotenv from 'dotenv' 
dotenv.config()

const port = process.env.PORT || 3001;
const server = createServer();

server.listen(port, () => {
  log(`api running on ${port}`);
});
