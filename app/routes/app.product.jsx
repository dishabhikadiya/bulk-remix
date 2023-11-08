import { useActionData, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { LegacyCard } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { DataTable } from "@shopify/polaris";
import product from "../db.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  let data = await product.find();
  console.log(data);
  return data;
};

export default function Index() {
  const actionData = useActionData();
  const submit = useSubmit();
  const Loaderdata = useLoaderData();
  console.log(Loaderdata);
  const rows = Loaderdata.map((form) => [
    [<>{form._id}</>],
    [<>{form.title}</>],
    [<>{form.status}</>],
    [<>{form.vendor}</>],
  ]);
  return (
    <Page>
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "text", "numeric", "numeric"]}
          headings={["Product_id", "Title", "Status", "Vendor"]}
          rows={rows}
        />
      </LegacyCard>
    </Page>
  );
}
