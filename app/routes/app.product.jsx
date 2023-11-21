import { useActionData, useSubmit } from "@remix-run/react";
import { Button, Page } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LegacyCard, Pagination } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { DataTable } from "@shopify/polaris";
import product from "../db.server";
import { useState } from "react";
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  let data = await product.find();
  console.log("===========================", data);
  return data;
};

export default function Index() {
  const actionData = useActionData();
  const submit = useSubmit();
  const nav = useNavigate();
  const Loaderdata = useLoaderData();
  const [currentPage, setCurrentPage] = useState(1);
  console.log(Loaderdata);
  const rows = Loaderdata.map((form) => [
    [<>{form._id}</>],
    [<>{form.title}</>],
    [<>{form.status}</>],
    [<>{form.vendor}</>],
  ]);
  const startIndex = (currentPage - 1) * 3;
  const endIndex = startIndex + 3;
  const paginatedData = rows.slice(startIndex, endIndex);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div>
      <Page>
        <Button
          primary
          onClick={() => {
            nav("/app/bulk");
          }}
        >
          Create Product
        </Button>
        <br></br>
        <br></br>
        <LegacyCard>
          <DataTable
            columnContentTypes={["text", "text", "numeric", "numeric"]}
            headings={["Product_id", "Title", "Status", "Vendor"]}
            rows={paginatedData}
          />
        </LegacyCard>
        <br></br>
        <div style={{ height: "100px" }}>
          <Pagination
            hasNext={currentPage * 3 < rows.length}
            hasPrevious={currentPage > 1}
            onPrevious={() => handlePageChange(currentPage - 1)}
            onNext={() => handlePageChange(currentPage + 1)}
            type="table"
            label={`Page ${currentPage} of ${Math.ceil(rows.length / 3)} `}
          />
        </div>
      </Page>
    </div>
  );
}
