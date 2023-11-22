import {
  Box,
  Button,
  Card,
  ChoiceList,
  Text,
  Page,
  Spinner,
} from "@shopify/polaris";
import { Step2, Step1, Step3, csvToJson } from "../api/api.server";
import { useActionData, useSubmit, useNavigate, Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { parseStringPromise } from "xml2js";
import fs from "fs";

export const action = async ({ request }) => {
  const body = await request.formData();
  console.log(body);
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
    const jsFile = new File([fileblob], "myjson.jsonl", {
      type: "application/jsonl",
    });
    const dataCreate = await Step1();
    console.log(dataCreate);

    // (Step - 1)
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
      // (Step - 2)
      const step2 = await Step2(apical);
      console.log(step2);

      let resp = await parseStringPromise(step2);
      console.log("res", resp);
      let key = resp?.PostResponse?.Key[0];
      console.log("key", key);
      // (Step - 3)

      if (key) {
        console.log(key);
        const step3 = await Step3(key);
        console.log(step3);
        return json({ data: step3 });
      } else {
        return json({ error: "Error" }, { status: 500 });
      }
      // (Step - 4)
      // const step4 = await Step4();
      // console.log(step4);
      // return step4;
    } else {
      return json({ error: "Error" }, { status: 500 });
    }
  } catch (error) {
    console.log("error", error);
    return json({ error: "Error" }, { status: 500 });
  }
};

const bulk = () => {
  const actionData = useActionData();
  console.log(actionData);
  const nav = useNavigate();
  const submit = useSubmit();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    console.log("object", actionData);
    if (actionData) {
      console.log("actionData", actionData);
      setLoader(false);
    }
  }, [actionData]);
  return (
    <div>
      <Page>
        <Text variant="headingLg" as="h5">
          Bulk Upload
        </Text>
        <br />
        <Card>
          <Form encType="multipart/form-data" method="POST">
            <input type="file" name="csvFile" />
            <Button primary submit onClick={() => setLoader(true)}>
              {loader ? <Spinner size="small" /> : "Submit"}
            </Button>
          </Form>
          <br></br>
          <Button
            onClick={() => {
              nav("/app");
            }}
          >
            View Uploaded Data Status
          </Button>
        </Card>
      </Page>
    </div>
  );
};

export default bulk;
