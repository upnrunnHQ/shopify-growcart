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
      automaticAppDiscount {
        discountId
      }
      userErrors {
        code
        message
        field
      }
    }
  }
`;

const GET_DISCOUNT_QUERY = `
  query GetDiscount($id: ID!) {
    discountNode(id: $id) {
      id
      configurationField: metafield(
        namespace: "discounts-plus",
        key: "volume-config",
      ) {
        id
        value
      }
      discount {
        __typename
        ... on DiscountAutomaticApp {
          title
          discountClass
          combinesWith {
            orderDiscounts
            productDiscounts
            shippingDiscounts
          }
          startsAt
          endsAt
        }
        ... on DiscountCodeApp {
          title
          discountClass
          combinesWith {
            orderDiscounts
            productDiscounts
            shippingDiscounts
          }
          startsAt
          endsAt
          usageLimit
          appliesOncePerCustomer
          codes(first: 1) {
            nodes {
              code
            }
          }
        }
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

        const session = await Shopify.Utils.loadCurrentSession(
          req,
          res,
          app.get("use-online-tokens")
        );

        if (!settings.discountId || ("" === settings.discountId)) {
          const mutation = await runDiscountMutation({
            discount: {
              functionId: "01GETZ4P8B7GWRMVSA64RM4MHZ",
              title: "Test",
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
            }
          },
            CREATE_AUTOMATIC_MUTATION,
            session
          );
          // console.log(mutation.data.discountCreate.automaticAppDiscount.discountId);
          // console.log(mutation.data.discountCreate.userErrors);
        } else {
          const discountItem = await runDiscountMutation(
            {
              id: "gid://shopify/DiscountAutomaticNode/1231790506218"
            },
            GET_DISCOUNT_QUERY,
            session
          );

          try {
            const client = new Shopify.Clients.Graphql(session?.shop, session?.accessToken);
            const data = await client.query({
              data: {
                query: UPDATE_AUTOMATIC_MUTATION,
                variables: {
                  "id": "gid://shopify/DiscountAutomaticNode/1231790506218",
                  "discount": {
                    metafields: [
                      {
                        id: discountItem.data.discountNode.configurationField.id,
                        namespace: "discounts-plus",
                        key: "volume-config",
                        type: "json",
                        value: JSON.stringify({
                          discountRequirementType: discountRequirementType[0],
                          rules: preparedDiscountRules
                        }),
                      },
                    ],
                  },
                }
              },
            });

            // console.log(discountItem.data.discountNode);
            // console.log(data);
          } catch (error) {
            console.log(error.response.errors[0].message);
          }
        }

        // await GrowCartDB.update(req.params.id, {
        //   ...parsedSettingsBody,
        //   discountId: "gid://shopify/DiscountAutomaticNode/1231761146090",
        //   // discountId: mutation.data.discountCreate.automaticAppDiscount.discountId,
        // });
        // const response = await formatSettingsResponse(req, res, [
        //   await GrowCartDB.readById(req.params.id),
        // ]);

        res.status(200).send([]);
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
