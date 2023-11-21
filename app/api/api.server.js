import axios from "axios";
const token = "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";
// const ngrok = require("ngrok");
const csv = require("csvtojson");
const url =
  "https://appmixo-disha.myshopify.com/admin/api/2023-10/graphql.json";
// STEP - 1 => Create Key and Value

export const Step1 = async () => {
  try {
    return new Promise((resolve, reject) => {
      let bulk = JSON.stringify({
        query: `mutation {
          stagedUploadsCreate(input:{
            resource: BULK_MUTATION_VARIABLES,
            filename: "bulk_op_vars",
            mimeType: "text/jsonl",
            httpMethod: POST
          }){
            userErrors{
              field,
              message
            },
            stagedTargets{
              url,
              resourceUrl,
              parameters {
                name,
                value
              }
            }
          }
        }`,
        variables: {},
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: url,
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        data: bulk,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          console.log(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// STEP - 2 => Fill Value,key and Upload File

export const Step2 = async (data) => {
  console.log(data);
  try {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://shopify-staged-uploads.storage.googleapis.com",
      headers: {
        "X-Shopify-Access-Token": token,
      },
      data: data,
    };

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// STEP - 3 => input key and bulk operation Created

export const Step3 = async (temp) => {
  console.log(temp);
  try {
    let data = JSON.stringify({
      query: `mutation {
        bulkOperationRunMutation(
          mutation: "mutation call($input: ProductInput!) { productCreate(input: $input) { product {id title variants(first: 10) {edges {node {id title inventoryQuantity }}}} userErrors { message field } } }",
          stagedUploadPath: "${temp}") {
          bulkOperation {
            id
            url
            status
          }
          userErrors {
            message
            field
          }
        }
      }
      `,
    });
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: data,
    });
    console.log(response);
    response = await response.json();
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// STEP - 4 => WebhookSubscriptionCreate
// export const Step4 = async () => {
//   try {
//     let url_nc = await ngrok.connect(3000);
//     console.log(url_nc);
//     let data = JSON.stringify({
//       query: `mutation {
//       webhookSubscriptionCreate(
//         topic: BULK_OPERATIONS_FINISH
//         webhookSubscription: {
//           format: JSON,
//           callbackUrl: "${url_nc}/callbackUrl"}
//       ) {
//         userErrors {
//           field
//           message
//         }
//         webhookSubscription {
//           id
//         }
//       }
//     }`,
//       variables: {},
//     });
//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: url,
//       headers: {
//         "X-Shopify-Access-Token": token,
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };
//     console.log(data);
//     const response = await axios.request(config);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// CSV convert to json
export const csvToJson = async (csvFile) => {
  console.log("csvFile:", csvFile);
  return await csv().fromString(csvFile);
};
