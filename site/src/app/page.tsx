import HomePageClient from "~/components/home-page-client";
import fs from "fs";
import path from "path";

// Function to read the agent.yml file
async function getAgentConfig() {
  const agentFilePath = path.join(process.cwd(), "../agent.yml");
  try {
    const fileContent = fs.readFileSync(agentFilePath, "utf8");
    return fileContent;
  } catch (e) {
    console.error("Failed to read agent.yml", e);
    return "Error reading agent.yml";
  }
}

export default async function HomePage() {
  const agentConfig = await getAgentConfig();

  return <HomePageClient agentConfig={agentConfig} />;
}
