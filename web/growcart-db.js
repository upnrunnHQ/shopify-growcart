import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "growcart.sqlite");

export const GrowCartDB = {
    cartSettingsTableName: "cart_settings",
    db: null,
    ready: null,

    create: async function ({
        shopDomain,
        minimumRequiremenType,
        discounts,
    }) {
        await this.ready;
        const query = `
      INSERT INTO ${this.cartSettingsTableName}
      (shopDomain, minimumRequiremenType, discountId, discounts)
      VALUES (?, ?, ?, ?)
      RETURNING id;
    `;

        const rawResults = await this.__query(query, [
            shopDomain,
            minimumRequiremenType,
            [""],
            discounts,
        ]);

        return rawResults[0].id;
    },

    update: async function (
        id,
        {
            minimumRequiremenType,
            discountId,
            discounts,
        }
    ) {
        await this.ready;

        const query = `
      UPDATE ${this.cartSettingsTableName}
      SET
        minimumRequiremenType = ?,
        discountId = ?,
        discounts = ?
      WHERE
        id = ?;
    `;

        await this.__query(query, [
            minimumRequiremenType,
            discountId,
            discounts,
            id,
        ]);
        return true;
    },

    list: async function (shopDomain) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.cartSettingsTableName}
      WHERE shopDomain = ?;
    `;

        return await this.__query(query, [shopDomain]);
    },

    read: async function (shopDomain) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.cartSettingsTableName}
      WHERE shopDomain = ?;
    `;

        const rows = await this.__query(query, [shopDomain]);
        if (!Array.isArray(rows) || rows?.length !== 1) {
            const settings = {
                shopDomain,
                minimumRequiremenType: ['SUBTOTAL'],
                discountId: [""],
                discounts: [],
            }
            this.create(settings);

            return settings
        };

        return rows[0];
    },

    readById: async function (id) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.cartSettingsTableName}
      WHERE id = ?;
    `;

        const rows = await this.__query(query, [id]);
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;

        return rows[0];
    },

    delete: async function (id) {
        await this.ready;
        const query = `
      DELETE FROM ${this.cartSettingsTableName}
      WHERE id = ?;
    `;
        await this.__query(query, [id]);
        return true;
    },

    /* Private */

    /*
      Used to check whether to create the database.
      Also used to make sure the database and table are set up before the server starts.
    */
    __hasSettingsTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.cartSettingsTableName]);
        return rows.length === 1;
    },

    updateTable: async function () {
        // this.__query(`ALTER TABLE ${this.cartSettingsTableName} DROP COLUMN discountType`);
        // this.__query(`ALTER TABLE ${this.cartSettingsTableName} ADD discountId VARCHAR(255)`);
    },

    /* Initializes the connection with the app's sqlite3 database */
    init: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasSettingsTable = await this.__hasSettingsTable();

        if (hasSettingsTable) {
            this.ready = Promise.resolve();
            /* Create the QR code table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.cartSettingsTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shopDomain VARCHAR(511) NOT NULL,
          minimumRequiremenType VARCHAR(255) NOT NULL,
          discountId VARCHAR(255) NOT NULL,
          discounts TEXT NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;

            /* Tell the various CRUD methods that they can execute */
            this.ready = this.__query(query);
        }
    },

    /* Perform a query on the database. Used by the various CRUD methods. */
    __query: function (sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    },
};
