import { authenticate } from "../shopify.server";
import db from "../db.server";

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
    case "FINISH_PRODUCT":
      console.log("FINISH_PRODUCT", payload);
      break;
    case "PRODUCTS_CREATE":
      console.log("PRODUCTS_CREATE", payload);
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
