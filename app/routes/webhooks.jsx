import { authenticate } from "../shopify.server";
import db from "../db.server";
import { AddProduct } from "~/api/api.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      // if (session) {
      //   await db.session.deleteMany({ where: { shop } });
      // }
      console.log("-----------");
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    // case "FINISH_PRODUCT":
    //   console.log("FINISH_PRODUCT", payload);
    //   break;
    case "PRODUCTS_CREATE":
      console.log("PRODUCTS_CREATE", payload);
      const { admin_graphql_api_id, title, vendor } = payload;
      let product_data = {
        title: title,
        productId: admin_graphql_api_id,
        vendor: vendor,
        price: payload.variants[0].price,
      };
      try {
        let response = await AddProduct(product_data);
        response = await response.json();
        console.log("db response", response);
      } catch (error) {
        console.log("db response ", error);
      }
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
