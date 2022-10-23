#![allow(dead_code)]

pub type Boolean = bool;
pub type Decimal = f64;
pub type Int = i32;
pub type ID = String;
pub type CurrencyCode = String;

pub mod input {
    use super::*;
    use serde::Deserialize;

    #[serde_as]
    #[derive(Clone, Debug, Deserialize, PartialEq)]
    #[serde(rename_all(deserialize = "camelCase"))]
    pub struct Input {
        pub discount_node: DiscountNode,
        #[serde_as(as = "DisplayFromStr")]
        pub presentment_currency_rate: Decimal,
        pub cart: Cart,
    }

    #[derive(Clone, Debug, Deserialize, PartialEq)]
    pub struct DiscountNode {
        pub metafield: Option<Metafield>,
    }

    #[derive(Clone, Debug, Deserialize, PartialEq)]
    pub struct Metafield {
        pub value: String,
    }

    #[derive(Clone, Debug, Deserialize, PartialEq)]
    pub struct Cart {
        pub cost: Amount,
        pub lines: Vec<CartLine>,
    }

    #[derive(Clone, Debug, Deserialize, PartialEq)]
    #[serde(rename_all(deserialize = "camelCase"))]
    pub struct Amount {
        pub subtotal_amount: Cost,
    }

    #[derive(Clone, Debug, Deserialize, PartialEq)]
    #[serde(rename_all(deserialize = "camelCase"))]
    pub struct Cost {
        pub amount: Int,
        pub currency_code : CurrencyCode,
    }

    #[derive(Clone, Debug, Deserialize, PartialEq)]
    pub struct CartLine {
        pub quantity: Int,
        pub merchandise: Merchandise,
    }

    #[derive(Clone, Debug, Deserialize, PartialEq)]
    pub struct Merchandise {
        pub id: Option<ID>,
    }
}

use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none, DisplayFromStr};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Configuration {
    pub value: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscountConfiguration {
    pub discount_requirement_type: DiscountRequirementType,
    pub rules: Vec<Rule>,
}

impl DiscountConfiguration {
    fn from_str(value: &str) -> Self {
        serde_json::from_str(value).expect("Unable to parse configuration value from metafield")
    }
}

impl Default for DiscountConfiguration {
    fn default() -> Self {
        DiscountConfiguration {
            discount_requirement_type: DiscountRequirementType::Subtotal,
            rules: vec![Rule {
                value: RuleValue::FixedAmount { value: 10.00, amount_or_quantity: 50 },
            }],
        }
    }
}

impl input::Input {
    pub fn configuration(&self) -> DiscountConfiguration {
        match &self.discount_node.metafield {
            Some(input::Metafield { value }) => DiscountConfiguration::from_str(value),
            None => DiscountConfiguration::default(),
        }
    }
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct FunctionResult {
    pub discount_application_strategy: DiscountApplicationStrategy,
    pub discounts: Vec<Discount>,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "SCREAMING_SNAKE_CASE"))]
pub enum DiscountApplicationStrategy {
    First,
    Maximum,
}

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize)]
pub struct Discount {
    pub value: Value,
    pub targets: Vec<Target>,
    pub message: Option<String>,
    pub conditions: Option<Vec<Condition>>,
}

#[skip_serializing_none]
#[serde_as]
#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub enum Value {
    FixedAmount {
        #[serde_as(as = "DisplayFromStr")]
        amount: Decimal,
    },
    Percentage {
        #[serde_as(as = "DisplayFromStr")]
        value: Decimal,
    },
}

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub enum Target {
    #[serde(rename_all(serialize = "camelCase"))]
    OrderSubtotal {
        excluded_variant_ids: Vec<ID>,
    },
    ProductVariant {
        id: ID,
        quantity: Option<Int>,
    },
}

#[serde_as]
#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub enum Condition {
    #[serde(rename_all(serialize = "camelCase"))]
    OrderMinimumSubtotal {
        excluded_variant_ids: Vec<ID>,
        #[serde_as(as = "DisplayFromStr")]
        minimum_amount: Decimal,
        target_type: ConditionTargetType,
    },
    #[serde(rename_all(serialize = "camelCase"))]
    ProductMinimumQuantity {
        ids: Vec<ID>,
        minimum_quantity: Int,
        target_type: ConditionTargetType,
    },
    #[serde(rename_all(serialize = "camelCase"))]
    ProductMinimumSubtotal {
        ids: Vec<ID>,
        #[serde_as(as = "DisplayFromStr")]
        minimum_amount: Decimal,
        target_type: ConditionTargetType,
    },
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all(serialize = "SCREAMING_SNAKE_CASE"))]
pub enum ConditionTargetType {
    OrderSubtotal,
    ProductVariant,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all(serialize = "SCREAMING_SNAKE_CASE", deserialize = "SCREAMING_SNAKE_CASE"))]
pub enum DiscountRequirementType {
    Subtotal,
    Quantity,
}

#[skip_serializing_none]
#[serde_as]
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "camelCase"))]
pub enum RuleValue {
    FixedAmount {
        #[serde_as(as = "DisplayFromStr")]
        value: Decimal,
        #[serde_as(as = "DisplayFromStr")]
        amount_or_quantity: Int,
    },
    Percentage {
        #[serde_as(as = "DisplayFromStr")]
        value: Decimal,
        #[serde_as(as = "DisplayFromStr")]
        amount_or_quantity: Int,
    },
}

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Rule {
    pub value: RuleValue,
}