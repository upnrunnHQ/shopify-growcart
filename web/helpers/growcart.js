import { Shopify } from "@shopify/shopify-api";
import { GrowCartDB } from "../growcart-db.js";

export async function getSettingsOr404(req, res, checkDomain = true) {
    try {
        const response = await GrowCartDB.readById(req.params.id);
        if (
            response === undefined ||
            (checkDomain &&
                (await getShopUrlFromSession(req, res)) !== response.shopDomain)
        ) {
            res.status(404).send();
        } else {
            return response;
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

    return undefined;
}

export async function getShopUrlFromSession(req, res) {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    return `https://${session.shop}`;
}

export async function parseSettingsBody(req) {
    return {
        minimumRequiremenType: req.body.minimumRequiremenType,
        discounts: JSON.stringify(req.body.discounts),
    };
}

export async function formatSettingsResponse(req, res, rawCodeData) {
    return rawCodeData;
}

export function prepareDiscountRules(discountRequirementType, rulesList) {
    return rulesList.map(item => {
        const discount = discountRequirementType.includes("SUBTOTAL") ? {
            title: item.title,
            value: String(item.value),
            subtotal: String(item.amountOrQuantity),
            quantity: "0"
        } : {
            title: item.title,
            value: String(item.value),
            subtotal: "0",
            quantity: String(item.amountOrQuantity)
        };

        if (item.type.includes("percentage")) {
            return {
                value: {
                    percentage: discount
                }
            };
        } else {
            return {
                value: {
                    fixedAmount: discount
                }
            };
        }

        return item;
    });
}

export async function runDiscountMutation(variables, mutation, session) {
    const client = new Shopify.Clients.Graphql(
        session?.shop,
        session?.accessToken
    );

    const data = await client.query({
        data: {
            query: mutation,
            variables,
        },
    });

    return data.body;
};