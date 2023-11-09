import {
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
} from "@remix-run/react";
import { Page, Card, Tag, Text } from "@shopify/polaris";

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const loaderData = useLoaderData();
  console.log(loaderData);
  const generateProduct = () => submit({}, { replace: true, method: "POST" });
  const row = loaderData?.data?.currentBulkOperation;
  console.log(row);
  if (row) {
    <Spinner />;
  }
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
