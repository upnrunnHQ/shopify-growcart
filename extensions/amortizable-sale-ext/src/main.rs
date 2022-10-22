use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none, DisplayFromStr};

mod api;
use api::*;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Configuration {
    pub value: f64,
}

impl Configuration {
    const DEFAULT_VALUE: f64 = 50.00;

    fn from_str(value: &str) -> Self {
        serde_json::from_str(value).expect("Unable to parse configuration value from metafield")
    }
}

impl Default for Configuration {
    fn default() -> Self {
        Configuration {
            value: Self::DEFAULT_VALUE,
        }
    }
}

impl input::Input {
    pub fn configuration(&self) -> Configuration {
        match &self.discount_node.metafield {
            Some(input::Metafield { value }) => Configuration::from_str(value),
            None => Configuration::default(),
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscountConfiguration {
    pub discount_requirement_type: DiscountRequirementType,
    pub rules: Vec<Rule>,
}

impl DiscountConfiguration {
    // const DEFAULT_VALUE: f64 = 50.00;
    fn from_str(value: &str) -> Self {
        serde_json::from_str(value).expect("Unable to parse configuration value from metafield")
    }
}

impl Default for DiscountConfiguration {
    fn default() -> Self {
        DiscountConfiguration {
            discount_requirement_type: DiscountRequirementType::Subtotal,
            rules: vec![Rule {
                value: RuleValue::FixedAmount { value: 10.00, amount_or_quantity: 5.00 },
            }],
        }
    }
}

impl input::Input {
    pub fn config(&self) -> DiscountConfiguration {
        match &self.discount_node.metafield {
            Some(input::Metafield { value }) => DiscountConfiguration::from_str(value),
            None => DiscountConfiguration::default(),
        }
    }
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
        amount_or_quantity: Decimal,
    },
    Percentage {
        #[serde_as(as = "DisplayFromStr")]
        value: Decimal,
        #[serde_as(as = "DisplayFromStr")]
        amount_or_quantity: Decimal,
    },
}

#[skip_serializing_none]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Rule {
    pub value: RuleValue,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let input: input::Input = serde_json::from_reader(std::io::BufReader::new(std::io::stdin()))?;
    let mut out = std::io::stdout();
    let mut serializer = serde_json::Serializer::new(&mut out);
    function(input)?.serialize(&mut serializer)?;
    Ok(())
}

fn function(input: input::Input) -> Result<FunctionResult, Box<dyn std::error::Error>> {
    let config = input.configuration();
    let converted_value = convert_to_cart_currency(config.value, input.presentment_currency_rate);
    let targets = vec![Target::OrderSubtotal {
        excluded_variant_ids: vec![],
    }];
    Ok(build_result(converted_value, targets))
}

fn another_function(input: input::Input) -> Result<FunctionResult, Box<dyn std::error::Error>> {
    // let config = input.configuration();
    let converted_value = convert_to_cart_currency(10.00, input.presentment_currency_rate);
    let targets = vec![Target::OrderSubtotal {
        excluded_variant_ids: vec![],
    }];
    Ok(build_result(converted_value, targets))
}

fn convert_to_cart_currency(value: f64, presentment_currency_rate: f64) -> f64 {
    value * presentment_currency_rate
}

fn build_result(amount: f64, targets: Vec<Target>) -> FunctionResult {
    let discounts = if targets.is_empty() {
        vec![]
    } else {
        vec![Discount {
            message: None,
            conditions: None,
            targets,
            value: Value::FixedAmount { amount },
        }]
    };
    FunctionResult {
        discounts,
        discount_application_strategy: DiscountApplicationStrategy::First,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn input(
        config: Option<Configuration>,
        presentment_currency_rate: Option<Decimal>,
    ) -> input::Input {
        input::Input {
            discount_node: input::DiscountNode {
                metafield: Some(input::Metafield {
                    value: serde_json::to_string(&config.unwrap_or_default()).unwrap()
                }),
            },
            presentment_currency_rate: presentment_currency_rate.unwrap_or(1.00),
        }
    }

    fn another_input(
        config: Option<DiscountConfiguration>,
        presentment_currency_rate: Option<Decimal>,
    ) -> input::Input {
        input::Input {
            discount_node: input::DiscountNode {
                metafield: Some(input::Metafield {
                    value: serde_json::to_string(&config.unwrap_or_default()).unwrap()
                }),
            },
            presentment_currency_rate: presentment_currency_rate.unwrap_or(1.00),
        }
    }

    #[test]
    fn test_discount_with_no_configuration() {
        let input = input(None, None);
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "fixedAmount": { "amount": "50" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });
        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_discount_with_value() {
        let input = input(Some(Configuration { value: 12.34 }), None);
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "fixedAmount": { "amount": "12.34" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });
        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_discount_with_presentment_currency_rate() {
        let input = input(Some(Configuration { value: 10.00 }), Some(2.00));
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "fixedAmount": { "amount": "20" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });
        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_input_deserialization() {
        let input_json = r#"
        {
            "discountNode": { "metafield": { "value": "{\"value\":10.0}" }},
            "presentmentCurrencyRate": "2.00"
        }
        "#;

        let expected_input = input(
            Some(Configuration { value: 10.00 }),
            Some(2.00)
        );
        assert_eq!(expected_input, serde_json::from_str::<input::Input>(input_json).unwrap());
    }

    #[test]
    fn test_my_deserialization() {
        let input_json = r#"
        {
            "discountNode": { "metafield": { "value": "{\"discountRequirementType\":\"SUBTOTAL\",\"rules\":[{\"value\":{\"fixedAmount\":{\"value\":\"10\",\"amount_or_quantity\":\"5\"}}}]}" }},
            "presentmentCurrencyRate": "2.00"
        }
        "#;

        let expected_input = another_input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Subtotal,
                rules: vec![Rule {
                    value: RuleValue::FixedAmount { value: 10.00, amount_or_quantity: 5.00 },
                }],
            }),
            Some(2.00)
        );   

        assert_eq!(expected_input, serde_json::from_str::<input::Input>(input_json).unwrap());
    }

    #[test]
    fn test_my() {
        let input = another_input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Subtotal,
                rules: vec![Rule {
                    value: RuleValue::FixedAmount { value: 10.00, amount_or_quantity: 5.00 },
                }],
            }),
            Some(2.00)
        );

        let config = input.config();

        println!("{:#?}", config);

        match config.rules[0].value {
            RuleValue::FixedAmount {value, amount_or_quantity} =>
                println!("value: {}, amount_or_quantity : {}", value, amount_or_quantity),
            RuleValue::Percentage {value, amount_or_quantity} =>
                println!("value: {}, amount_or_quantity : {}", value, amount_or_quantity)
        }

        assert_eq!(1.00, 1.00);
    }
}