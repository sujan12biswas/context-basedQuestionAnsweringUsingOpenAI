require("dotenv").config();
// Import the model for  Vector Stores Dependency
const {
  AzureCosmosDBVectorStore,
} = require("@langchain/community/vectorstores/azure_cosmosdb");
//Import the openAI model
const { OpenAI } = require("langchain/llms/openai");
//Import the model for embddings
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
//Import the model for data retreving
const { ConversationalRetrievalQAChain } = require("langchain/chains");

//creating instance of openAI embeddings
const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiDeploymentName:
    process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_FOR_EMBEDDINGS,
});

// Creating instance of CosmosDB vector store
const store = new AzureCosmosDBVectorStore(embeddings, {
  connectionString: process.env.AZURE_COSMOSDB_CONNECTION_STRING,
  databaseName: process.env.AZURE_COSMOSDB_DATABASENAME,
  collectionName: process.env.AZURE_COSMOSDB_COLLECTIONNAME,
});

//Configure OpenAI model
const model = new OpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  temperature: 0,
});

async function gettingAnswer(req, res) {
  try {
    //Getting the paload
    const { query } = req.body;

    //Coviguring ConversationalRetrievalQAChain
    const usingRetrievalQAChain = ConversationalRetrievalQAChain.fromLLM(
      model,
      store.asRetriever() //It is for retriving the data from embeddings
    );

    // Getting answers after retreving
    const usingRetrievalQAChainResult = await usingRetrievalQAChain.call({
      question: query,
      chat_history: [],
    });
    console.log(usingRetrievalQAChainResult);

    //Beautify the response
    const response = JSON.stringify(usingRetrievalQAChainResult);
    const substringToRemove1 = '{"text":"';
    const substringToRemove2 = '"}';

    // Use the replace method to remove the substring
    const modifiedResponse = response.replace(substringToRemove1, "");
    const finalModifiedResponse = modifiedResponse.replace(
      substringToRemove2,
      ""
    );

    // Check if the string contains "\nMetadata"
    if (finalModifiedResponse.includes("\nMetadata")) {
      // Split the string based on "\nMetadata"
      const [answers, metadata] = finalModifiedResponse.split("\nMetadata");

      return res.status(200).send({ Response: answers, Metadata: metadata });
    } else {
      return res.status(200).send({ Response: finalModifiedResponse });
    }
  } catch (error) {
    console.log(error);
    res.send("Error occures on the backend : ", error?.message);
  }
}

module.exports.gettingAnswer = gettingAnswer;
