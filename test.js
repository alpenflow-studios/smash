import { AgentKit } from "@coinbase/agentkit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log("Testing CDP connection...");
    
    const agentKit = await AgentKit.from({
      cdpApiKeyName: process.env.CDP_API_KEY_NAME,
      cdpApiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
    });

    console.log("Connection successful!");
    return true;
  } catch (error) {
    console.error("Connection failed:", error.message);
    return false;
  }
}

testConnection();
