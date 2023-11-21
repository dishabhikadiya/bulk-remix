import {
  useActionData,
  useNavigate,
  useSubmit,
  useLoaderData,
  Form,
} from "@remix-run/react";
import { Page, Card, Tag, Text, Button } from "@shopify/polaris";
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
export default function Index() {
  const nav = useNavigate();
  const actionData = useActionData();
  const submit = useSubmit();
  const loaderData = useLoaderData();
  const row = loaderData?.data?.currentBulkOperation;
  return (
    <Page title="Dashboard">
      <Card>
        <Text variant="headingLg" as="h5">
          Bulk operations Status ...
        </Text>
        <br></br>
        <div>
          Id : {row.id}&nbsp;&nbsp;&nbsp;
          <Tag>{row.status}</Tag>
        </div>
        <Form method="post" encType="multipart/form-data">
          <br></br>
          <Button
            primary
            onClick={() => {
              nav("/app/product");
            }}
          >
            View Product
          </Button>
        </Form>
      </Card>
    </Page>
  );
}
