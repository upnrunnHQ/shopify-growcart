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
        discountType: req.body.discountType,
        discounts: JSON.stringify(req.body.discounts),
    };
}

export async function formatSettingsResponse(req, res, rawCodeData) {
    return rawCodeData;
}