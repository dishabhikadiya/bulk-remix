import { Box, Button, Page } from "@shopify/polaris";
import { Step2, Step1, Step3, Step4, csvToJson } from "./api";
import { useActionData, useSubmit } from "@remix-run/react";
import React from "react";
import { json } from "@remix-run/node";
import fs from "fs";

export const action = async ({ request }) => {
  const body = await request.formData();
  console.log(body);

  if (request.method === "POST") {
    try {
      let filses = body.get("csvFile");
      const content = await filses.text();
      console.log(content);
      const jsonData1 = await csvToJson(content);
      const myObject = [];
      const jsonData = jsonData1.map((data) => {
        let obj = { input: data };
        myObject.push(obj);
      });
      let jsonLdata = myObject.map((obj) => JSON.stringify(obj)).join("\n");

      let jsonlFileName = "data.jsonl";
      fs.writeFileSync(jsonlFileName, jsonLdata, "utf-8");

      console.log("dgf", myObject);
      const fileblob = new Blob([jsonLdata], {
        type: "application/jsonl",
      });
      const jsFile = new File([fileblob], "myjsonn.jsonl", {
        type: "application/jsonl",
      });
      const dataCreate = await Step1();
      console.log(dataCreate);
      // Only requed data append (Step - 1)
      if (dataCreate) {
        const apical = new FormData();
        const dataAPI =
          dataCreate?.data?.stagedUploadsCreate?.stagedTargets[0]?.parameters;
        console.log(dataAPI);
        dataAPI.map((data) => {
          apical.append(data?.name, data?.value);
        });
        apical.append("file", jsFile);
        console.log(apical);
        console.log(filses);
        // Response convert xml to json (Step - 2)
        const step2 = await Step2(apical);
        console.log(step2);
        const parseString = require("xml2js").parseString;
        let jsonData;
        parseString(step2, (err, result) => {
          if (err) {
            console.error(err);
            throw err;
          }
          jsonData = result;
        });
        console.log(jsonData);
        // Bulk Created (Step - 3)
        if (jsonData) {
          let key = jsonData?.PostResponse?.Key;
          console.log(key);
          const step3 = await Step3(key);
          console.log(step3);
        }
        // webhookSubscription (Step - 4)
        const step4 = await Step4();
        console.log(step4);
      }
    } catch (error) {
      // console.log("error", error);
      return json({ error: "Error" }, { status: 500 });
    }
  }
  return null;
};

const bulk = () => {
  const actionData = useActionData();
  console.log(actionData);
  const submit = useSubmit();
  return (
    <div>
      <Box>
        <Page>
          <form encType="multipart/form-data" method="post">
            <input type="file" name="csvFile" />
            <Button primary submit>
              Submit
            </Button>
          </form>
        </Page>
      </Box>
    </div>
  );
};

export default bulk;
