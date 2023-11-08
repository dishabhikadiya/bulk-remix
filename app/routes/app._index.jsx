import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({
    displayname: authenticate.displayname,
  });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();

  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  return <Page>hello</Page>;
}
