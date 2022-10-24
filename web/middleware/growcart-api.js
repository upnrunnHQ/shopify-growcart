import { Shopify } from "@shopify/shopify-api";
import { GrowCartDB } from "../growcart-db.js";
import {
  getSettingsOr404,
  getShopUrlFromSession,
  parseSettingsBody,
  prepareDiscountRules,
  formatSettingsResponse,
  runDiscountMutation
} from "../helpers/growcart.js";

const CREATE_AUTOMATIC_MUTATION = `
  mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
    discountCreate: discountAutomaticAppCreate(
      automaticAppDiscount: $discount
    ) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

const UPDATE_AUTOMATIC_MUTATION = `
  mutation UpdateDiscount($id: ID!, $discount: DiscountAutomaticAppInput!) {
    discountUpdate: discountAutomaticAppUpdate(
      id: $id
      automaticAppDiscount: $discount
    ) {
      userErrors {
        code
        message
        field
      }
    }
  }
`;

export default function applyGrowCartApiEndpoints(app) {
  app.get("/api/settings", async (req, res) => {
    try {
      const rawCodeData = await GrowCartDB.read(
        await getShopUrlFromSession(req, res)
      );

      const response = await formatSettingsResponse(req, res, rawCodeData);

      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const id = await GrowCartDB.create({
        ...(await parseSettingsBody(req)),
        shopDomain: await getShopUrlFromSession(req, res),
      });
      const response = await formatSettingsResponse(req, res, [
        await GrowCartDB.readById(id),
      ]);
      res.status(201).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get("/api/settings/:id", async (req, res) => {
    const settings = await getSettingsOr404(req, res);

    if (settings) {
      const formattedSettings = await formatSettingsResponse(req, res, [settings]);
      res.status(200).send(formattedSettings[0]);
    }
  });

  app.post("/api/settings/:id", async (req, res) => {
    const settings = await getSettingsOr404(req, res);

    if (settings) {
      try {
        const parsedSettingsBody = await parseSettingsBody(req);
        const discountRequirementType = parsedSettingsBody.minimumRequiremenType;
        const discounts = JSON.parse(parsedSettingsBody.discounts);
        const preparedDiscountRules = prepareDiscountRules(discountRequirementType, discounts);
        const discount = {
          functionId: "01GETZ4P8B7GWRMVSA64RM4MHZ",
          startsAt: new Date(),
          metafields: [
            {
              namespace: "discounts-plus",
              key: "volume-config",
              type: "json",
              value: JSON.stringify({
                discountRequirementType: discountRequirementType[0],
                rules: preparedDiscountRules
              }),
            },
          ],
        };

        const session = await Shopify.Utils.loadCurrentSession(
          req,
          res,
          app.get("use-online-tokens")
        );

        // const data = await runDiscountMutation({ discount: { ...discount, title: "Test" } }, CREATE_AUTOMATIC_MUTATION, session);
        // console.log(data);

        await GrowCartDB.update(req.params.id, {
          ...parsedSettingsBody,
          discountId: [""],
        });
        const response = await formatSettingsResponse(req, res, [
          await GrowCartDB.readById(req.params.id),
        ]);

        res.status(200).send(response);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  });

  app.delete("/api/settings/:id", async (req, res) => {
    const settings = await getSettingsOr404(req, res);

    if (settings) {
      await GrowCartDB.delete(req.params.id);
      res.status(200).send();
    }
  });
}
