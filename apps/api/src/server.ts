import { json, urlencoded } from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { authenticate, createVestingAccount } from "./libs";

export const createServer = () => {
  const app = express();
  
  // Configuration
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
  
  // Routes
  app.get("/faucet/:address", async (req, res) => {
  
    // Check if IP is allowed
    if (!authenticate(req.socket.remoteAddress ?? "127.0.0.1")) {
      return res.status(401).json({success: false, message: "Unauthorized"})
    }

    // Check if address is valid
    if (req.params.address === undefined || !req.params.address.startsWith(process.env.BECH32_PREFIX ?? "juno")) {
      return res.status(422).json({success: false, message: "Address not valid"})
    }

    try {
      const tx_result = await createVestingAccount(req.params.address);
      return res.json({success: true, message: "Token inviati!", tx_hash: tx_result.transactionHash})
    } catch (error) {
      return res.status(500).json({success:false, message: error })
    }
  })

  app.get("/healthz", (req, res) => {
    return res.json({ ok: true });
  });

  return app;
};
