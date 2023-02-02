const axios = require("axios");
const cheerio = require("cheerio");

// Initialize the OpenAI API
//openai.promise = require("bluebird");
// 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

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// async function fetchData() {
//     // const completion = await openai.createCompletion({
//     //   model: "text-davinci-002",
//     //   prompt: "What's the meaning of life",
//     // });

//     const completion = await openai.createCompletion({
//       model: "code-davinci-002",
//       prompt:
//         "You: How do I succeed in life?",
//       temperature: 0,
//       max_tokens: 60,
//       top_p: 1.0,
//       frequency_penalty: 0.5,
//       presence_penalty: 0.0,
//       stop: ["You:"],
//     });

//     console.log(completion.data);
// }

// fetchData();


// Define the function to extract the content of an RSS feed
async function getFeedContent(feedUrl) {
  const { data } = await axios.get(feedUrl);
  const $ = cheerio.load(data, { xmlMode: true });
  const items = [];
  $("item").each(function () {
    items.push($(this).text());
  });
  return items;
}

// Define the function to generate a response using ChatGPT
async function generateResponse(prompt) {

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Brainstorm some ideas combining VR and fitness:",
    temperature: 0.6,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  
  return response.choices[0].text;
}

// Define the RSS feed URL
const feedUrl = "http://feeds.bbci.co.uk/news/rss.xml";

// Extract the content of the feed
getFeedContent(feedUrl)
  .then((feedContent) => {
    // Loop over the items in the feed
    feedContent.forEach(async (item) => {
      // Use the item as the prompt for ChatGPT
      const prompt = item;
      const response = await generateResponse(prompt);
      console.log(`Prompt: ${prompt}\nResponse: ${response}\n\n`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
