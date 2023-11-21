import React from "react";
import { useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect } from "react";

export const action = () => {
  console.log("asdf");
  let data = "tests";
  console.log(data);
  return data;
};

export default function daftest() {
  const actionData = useActionData();
  console.log(actionData);
  useEffect(() => {
    if (actionData) {
      console.log("action", actionData);
    } else {
      console.log("no action");
    }
  }, [actionData]);
  return (
    <div>
      <form encType="multipart/form-data" method="post">
        <button type="submit">Testing</button>
      </form>
    </div>
  );
}
