import { useActionData, useSubmit } from "@remix-run/react";
import { Button, Page } from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  LegacyCard,
  Pagination,
  TextField,
  ChoiceList,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { DataTable } from "@shopify/polaris";
import product from "../db.server";
import { useState, useCallback, useEffect } from "react";
import { DeleteProduct, UpdateProduct } from "~/api/api.server";
import { Frame, Modal, TextContainer } from "@shopify/polaris";
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  let data = await product.find();
  console.log("===========================", data);
  return data;
};

export const action = async ({ request }) => {
  const body = await request.formData();
  let id = body.get("id");
  if (request.method === "DELETE") {
    console.log(id);
    try {
      let ress = await DeleteProduct(id);
      console.log(ress);
      return json({ data: ress, status: true });
    } catch (error) {
      console.log(error);
      return json({ error: "Something went Wrong", status: false });
    }
  }
  if (request.method === "PUT") {
    try {
      let result = await UpdateProduct(id, product);
      return json({ data: result, status: true });
    } catch (error) {
      console.log("update error", error);
      return json({ data: error, status: false });
    }
  }
};

export default function Index() {
  const actionData = useActionData();
  const submit = useSubmit();
  const nav = useNavigate();
  const Loaderdata = useLoaderData();
  const [deleteid, setDeleteid] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  console.log(Loaderdata);
  useEffect(() => {
    console.log("object", actionData);
    if (actionData) {
      console.log("actionData", actionData);
      setActiv1(false);
    }
  }, [actionData]);
  const handleDelete = () => {
    submit({ id: deleteid }, { method: "DELETE" });
    console.log("deleteid", deleteid);
  };

  const startIndex = (currentPage - 1) * 3;
  const endIndex = startIndex + 3;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const [active1, setActiv1] = useState(false);

  const handleChange1 = useCallback(() => setActiv1(!active1), [active1]);
  const rows = Loaderdata.map((form) => [
    [<>{form._id}</>],
    [<>{form.title}</>],
    [<>{form.status}</>],
    [<>{form.vendor}</>],
    <div>
      <Button plain tone="critical" onClick={handleChange}>
        Update
      </Button>
      &nbsp;&nbsp;
      <Button
        plain
        destructive
        onClick={() => {
          handleChange1(), setDeleteid(form._id);
          console.log("id", form._id);
        }}
      >
        Remove
      </Button>
    </div>,
  ]);

  const paginatedData = rows.slice(startIndex, endIndex);

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
            columnContentTypes={[
              "text",
              "text",
              "numeric",
              "numeric",
              "numeric",
            ]}
            headings={["Product_id", "Title", "Status", "Vendor", "Action"]}
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
      <Frame>
        <Modal open={active} onClose={handleChange} title="Edit Product">
          <Modal.Section>
            <TextField
              label="Store name"
              value={"updateTitle"}
              onChange={"handleTextFieldChangevalue"}
              selectTextOnFocus
              autoComplete="off"
            />
            <br />
            <ChoiceList
              title="Status"
              choices={[
                { label: "Active", value: "active" },
                { label: "Archived", value: "archived" },
                { label: "Draft", value: "draft" },
              ]}
              selected={"value"}
              onChange={"handleChangeUpdate"}
            />
            <br />
            <Button primary>Submit</Button>
          </Modal.Section>
        </Modal>
      </Frame>

      <Frame>
        <Modal open={active1} onClose={handleChange1} title="Delete">
          <Modal.Section>
            <p>Are you sure you want to delete this product?</p>
            <br />
            <br />
            <Button primary onClick={handleDelete}>
              Remove
            </Button>
            &nbsp;
            <Button onClick={handleChange1}>Cancal</Button>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
