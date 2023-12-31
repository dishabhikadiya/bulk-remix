import axios from "axios";
const token = "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";
const csv = require("csvtojson");
import { json } from "@remix-run/node";
import product from "../db.server";
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

// Product query

export const DeleteProduct = async (id) => {
  try {
    let result = await product.deleteOne({ _id: id });
    console.log("result", result);
    return json({ data: result, status: true });
  } catch (error) {
    console.log("result", error);
    return json({ error: "Something went Wrong", status: false });
  }
};

export const UpdateProduct = async (id, products) => {
  try {
    let result = await product.updateOne({ _id: id }, { $set: products });

    console.log("res", result);
    return json({ data: result, status: true });
  } catch (error) {
    console.log("update error", error);
    return json({ data: error, status: false });
  }
};

// searching

export const Searching = async (filter, key) => {
  switch (filter) {
    case "Search":
      try {
        let result = await product.find({
          $or: [{ title: { $regex: key, $options: "i" } }],
        });
        console.log("result", result);
        return { data: result, status: true, flage: true };
      } catch (error) {
        console.log("result", error);
        return { error: "Wrong", status: false };
      }
    default:
      return { error: "Wrong", status: false };
  }
};

// Data Save

export const AddProduct = async (Product) => {
  try {
    const data = new product(Product);
    let res = await data.save();
    return json({ data: res, status: true });
  } catch (error) {
    console.log("result", error);
    return json({ error: "Something went Wrong", status: false });
  }
};
