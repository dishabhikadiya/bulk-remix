import {
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
} from "@remix-run/react";
import { Page, Card, Tag, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
const token = "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";
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  try {
    let productData = JSON.stringify({
      query: `query {
        currentBulkOperation(type: MUTATION) {
           id
           status
        }
       }`,
      variables: {},
    });
    let data = await fetch(
      "https://appmixo-disha.myshopify.com/admin/api/2023-10/graphql.json",
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: productData,
      }
    );
    data = await data.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const loaderData = useLoaderData();
  console.log(loaderData);
  const generateProduct = () => submit({}, { replace: true, method: "POST" });
  const row = loaderData?.data?.currentBulkOperation;
  console.log(row);
  
  return (
    <Page>
      <Card>
        <Text variant="headingLg" as="h5">
          Bulk operations Status ...
        </Text>
        <br></br>
        <div>
          Id : {row.id}&nbsp;&nbsp;&nbsp;
          <Tag>{row.status}</Tag>
        </div>
      </Card>
    </Page>
  );
}
