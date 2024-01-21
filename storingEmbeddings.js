//Dotenv Configuration
const dotenv = require("dotenv/config");
//Import CSV Loder
const { CSVLoader } = require("langchain/document_loaders/fs/csv");

//Import Text Splitters
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

//Import Embedding Models
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

const { convertExcelToCSV } = require("./FileConverter/excelToCSV");

// Import Vector Stores Dependency
const {
  AzureCosmosDBVectorStore,
  AzureCosmosDBSimilarityType,
} = require("@langchain/community/vectorstores/azure_cosmosdb");

//Creating an instance of OpenAI Embrddings
const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_FOR_EMBEDDINGS,
});

//Creating an instance of Azure CosmosDB Vector Store
const store = new AzureCosmosDBVectorStore(embeddings,
    {
        connectionString: process.env.AZURE_COSMOSDB_CONNECTION_STRING,
        databaseName: process.env.AZURE_COSMOSDB_DATABASENAME,
        collectionName: process.env.AZURE_COSMOSDB_COLLECTIONNAME,
      }
);

//The function that will creating and storing embeddings
async function createAndStoreEmbeddings() {
  //Converting excel to CSV
  await convertExcelToCSV();
  // Load the CSV file
  const loader = new CSVLoader("./Files/DeliveryConnect.csv");
  const docs = await loader.load();

  //the loop will iterate documents
  for (let i = 0; i < docs.length; i++) {
    //This model helps to create chuncks from the docs
    const splitter = new RecursiveCharacterTextSplitter({
      // separator: " ",   // the chuncks will be saperated by spaces
      chunkSize: 500,   //The maximum size of each chuncks is 200 character for this, It can change
      chunkOverlap: 50, //20 characters will be overlap beteen the relative chanks
    });
    const data = await splitter.createDocuments([docs[i].pageContent]);
    console.log("chunked Optput: ", JSON.stringify(docs[i], null, 2));
    
    //Add creating embeddings of the chunck and store on Azure CosmosDB
    await store.addDocuments(data);

  }
  console.log("The embedding storing process is end")
}
createAndStoreEmbeddings();
