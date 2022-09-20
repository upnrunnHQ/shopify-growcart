import { GrowCartDB } from "../growcart-db.js";
import {
    getSettingsOr404,
    getShopUrlFromSession,
    parseSettingsBody,
    formatSettingsResponse,
} from "../helpers/growcart.js";

export default function applyGrowCartApiEndpoints(app) {
    app.get("/api/settings", async (req, res) => {
        try {
            const rawCodeData = await GrowCartDB.read(
                await getShopUrlFromSession(req, res)
            );

            const response = await formatSettingsResponse(req, res, rawCodeData);

            res.status(200).send(response);
        } catch (error) {
            console.error(error);
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
                await GrowCartDB.update(req.params.id, await parseSettingsBody(req));
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
