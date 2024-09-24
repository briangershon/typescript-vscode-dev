import "dotenv/config";

import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { END, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

export async function run() {
  const myVar = process.env.EXAMPLE_VAR;
  if (!myVar) {
    throw new Error("EXAMPLE_VAR is not defined");
  }

  const openAIApiKey = process.env.OPENAI_API_KEY;
  if (!openAIApiKey) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  const world: string = "world";

  console.log(`${myVar}, ${world}!`);

  const model = new ChatOpenAI({
    openAIApiKey,
    temperature: 0,
  });

  // Define input and output types
  interface GraphInput {
    input: string;
  }

  interface GraphOutput {
    output: string;
  }

  // Create a simple workflow
  const graph = new StateGraph<GraphInput, GraphOutput>({
    channels: {
      input: {},
      output: {},
    },
  });

  // Add a single node to the graph
  graph.addNode("generate", async (input: GraphInput): Promise<GraphOutput> => {
    const response: BaseMessage = await model.invoke([
      new HumanMessage(input.input),
    ]);
    return { output: response.content };
  });

  // Set up the workflow
  graph.setEntryPoint("generate");
  graph.addEdge("generate", END);

  // Run the workflow
  async function main(): Promise<void> {
    const executor = await graph.compile();
    const result: GraphOutput = await executor.invoke({
      input: "Hello, how are you?",
    });
    console.log(result.output);
  }

  main().catch((error: Error) => console.error(error));
}
