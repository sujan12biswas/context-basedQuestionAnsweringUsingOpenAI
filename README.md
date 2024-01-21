# Getting Answers From Excel File Using LangChain

The Project is for getting responses from Excel Files using natural language query. 

Here we creaed a script that is creating embeddings of the documents and stored on a vector Store (Azure CosmosDB) and an API where we have to pass a query in request body and the API will give the response according to the query

## Steps for the Script which is creating and storing embeddings from the documents

- The script is there in **storingEmbeddings.js** 
- There firstly we are converting the excel file in CSV file because **in nodeJS langchain directly loading of excel file is not available.**
- Then load the **CSV** file.
- After that, We have to split the documents into chunks using **RecursiveCharacterTextSplitter** model
- Next convert the chuncks into embeddings using **openAI embeddings** model and then store the embeddings into **Azure CosmosDB**


## Steps for the API which will retrieve answers from the embeddings
- In **index.js** Server is created using Express framework and It's running on port 3005 locally
- In **excelDataRoute.js** file of **Routes** folder we are creating a route '/getResponse'
- In **checkingQuery.js** file of **Middlewares** folder, we are getting the user query provided by the user and validating those.
- In **gettingAnswers.js** file of **Controllers** folder firstly getting the request body then retreve the answers according the database and beautify the answers and sending that as response.


## How to run the code
- To run the code take a git pull of the code or download the zip file. 
- Then in terminal do **npm i** , it will install all the depandences those will required to run the project.
- Then in **.env** file, you have to give your OpenAI and CosmosDB credentials.
- Then do **node index.js** in terminal to run the code. 
- Now using API URL: http://localhost:3001/getResponse take a post request where in JSON body give { query : your_query  }
- In response you will get the Answers according to the excel file.
