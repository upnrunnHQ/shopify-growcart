use serde::{Serialize};

mod api;
use api::*;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let input: input::Input = serde_json::from_reader(std::io::BufReader::new(std::io::stdin()))?;
    let mut out = std::io::stdout();
    let mut serializer = serde_json::Serializer::new(&mut out);
    function(input)?.serialize(&mut serializer)?;
    Ok(())
}

fn function(input: input::Input) -> Result<FunctionResult, Box<dyn std::error::Error>> {
    let config = input.configuration();

    let mut discount_value: Value = Value::FixedAmount { amount: 0.0 };

    match config.discount_requirement_type {
        DiscountRequirementType::Subtotal =>
            for rule in config.rules {
                match rule.value {
                    RuleValue::FixedAmount {title,value, subtotal, quantity: _} =>
                        if input.cart.cost.subtotal_amount.amount >= subtotal {
                            let converted_value = convert_to_cart_currency(value, input.presentment_currency_rate);
                            discount_value = Value::FixedAmount { amount: converted_value }
                        },
                    RuleValue::Percentage {title, value, subtotal, quantity: _} =>
                        if input.cart.cost.subtotal_amount.amount >= subtotal {
                            let converted_value = convert_to_cart_currency(value, input.presentment_currency_rate);
                            discount_value = Value::Percentage { value: converted_value }
                        }
                }
                
            }
        DiscountRequirementType::Quantity =>
            if input.cart.lines.is_empty() {
            } else {
                let mut _quantity: Int = 0;

                for line in input.cart.lines {
                    _quantity += line.quantity;
                }
                
                for rule in config.rules {
                    match rule.value {
                        RuleValue::FixedAmount {title, value, subtotal: _, quantity} =>
                            if _quantity >= quantity {
                                let converted_value = convert_to_cart_currency(value, input.presentment_currency_rate);
                                discount_value = Value::FixedAmount { amount: converted_value }
                            },
                        RuleValue::Percentage {title, value, subtotal: _, quantity} =>
                            if _quantity >= quantity {
                                let converted_value = convert_to_cart_currency(value, input.presentment_currency_rate);
                                discount_value = Value::Percentage { value: converted_value }
                            }
                    }
                }

            }
    }
    
    let targets = vec![Target::OrderSubtotal {
        excluded_variant_ids: vec![],
    }];

    Ok(build_result(discount_value, targets))
}

fn convert_to_cart_currency(value: f64, presentment_currency_rate: f64) -> f64 {
    value * presentment_currency_rate
}

fn build_result(value: Value, targets: Vec<Target>) -> FunctionResult {
    let discounts = if targets.is_empty() {
        vec![]
    } else {
        vec![Discount {
            message: Some("Some value".to_string()),
            conditions: None,
            targets,
            value,
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
        config: Option<DiscountConfiguration>,
        presentment_currency_rate: Option<Decimal>,
    ) -> input::Input {
        let input = r#"
        {
            "cart": {
                "cost": {
                    "subtotalAmount": {
                        "amount": "50",
                        "currencyCode": "AED"
                    }
                },
                "lines": [
                    {
                        "quantity": 5,
                        "merchandise": {
                            "id": "gid://shopify/ProductVariant/0"
                        }
                    },
                    {
                        "quantity": 1,
                        "merchandise": {
                            "id": "gid://shopify/ProductVariant/1"
                        }
                    }
                ]
            },
            "discountNode": { "metafield": null },
            "presentmentCurrencyRate": "1.00"
        }
        "#;

        let default_input: input::Input = serde_json::from_str(input).unwrap();
        let value = serde_json::to_string(&config.unwrap_or_default()).unwrap();

        let discount_node = input::DiscountNode {
            metafield: Some(input::Metafield {
                value
            }),
        };

        input::Input {
            discount_node,
            presentment_currency_rate: presentment_currency_rate.unwrap_or(1.00),
            ..default_input
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
                    "value": { "fixedAmount": { "amount": "10" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });
        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_discount_with_value() {
        let input = input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Subtotal,
                rules: vec![Rule {
                    value: RuleValue::FixedAmount { title: "$5 Off".to_string(), value: 5.00, subtotal: 20.00, quantity: 0 },
                }],
            }),
            None
        );
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "fixedAmount": { "amount": "5" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });

        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_discount_with_presentment_currency_rate() {
        let input = input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Subtotal,
                rules: vec![Rule {
                    value: RuleValue::FixedAmount { title: "$5 Off".to_string(), value: 5.00, subtotal: 20.00, quantity: 0 },
                }],
            }),
            Some(2.00)
        );
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "fixedAmount": { "amount": "10" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });
        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_discount_with_multiple_rules() {
        let input = input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Subtotal,
                rules: vec![
                    Rule {
                        value: RuleValue::FixedAmount { title: "$5 Off".to_string(), value: 5.00, subtotal: 20.00, quantity: 0 },
                    },
                    Rule {
                        value: RuleValue::FixedAmount { title: "$10 Off".to_string(), value: 10.00, subtotal: 50.00, quantity: 0 },
                    }
                ],
            }),
            None
        );
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "fixedAmount": { "amount": "10" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });

        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_discount_with_percentage_rule() {
        let input = input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Subtotal,
                rules: vec![Rule {
                    value: RuleValue::Percentage { title: "5% Off".to_string(), value: 5.00, subtotal: 20.00, quantity: 0 },
                }],
            }),
            Some(2.00)
        );
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "percentage": { "value": "10" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });
        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_discount_with_quantity() {
        let input = input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Quantity,
                rules: vec![Rule {
                    value: RuleValue::Percentage { title: "5% Off".to_string(), value: 5.00, subtotal: 0.0, quantity: 0 },
                }],
            }),
            Some(1.00)
        );
        let handle_result = serde_json::json!(function(input).unwrap());

        let expected_handle_result = serde_json::json!({
            "discounts": [
                {
                    "targets": [{ "orderSubtotal": { "excludedVariantIds": [] } }],
                    "value": { "percentage": { "value": "5" } },
                }
            ],
            "discountApplicationStrategy": "FIRST",
        });
        assert_eq!(handle_result, expected_handle_result);
    }

    #[test]
    fn test_input_deserialization_with_no_configuration() {
        let input_json = r#"
        {
            "cart": {
                "cost": {
                    "subtotalAmount": {
                        "amount": "50",
                        "currencyCode": "AED"
                    }
                },
                "lines": [
                    {
                        "quantity": 5,
                        "merchandise": {
                            "id": "gid://shopify/ProductVariant/0"
                        }
                    },
                    {
                        "quantity": 1,
                        "merchandise": {
                            "id": "gid://shopify/ProductVariant/1"
                        }
                    }
                ]
            },
            "discountNode": { "metafield": { "value": "{\"discountRequirementType\":\"SUBTOTAL\",\"rules\":[]}" }},
            "presentmentCurrencyRate": "1.00"
        }
        "#;

        let expected_input = input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Subtotal,
                rules: vec![],
            }),
            None
        );
        assert_eq!(expected_input, serde_json::from_str::<input::Input>(input_json).unwrap());
    }

    #[test]
    fn test_input_deserialization_with_value() {
        let input_json = r#"
        {
            "cart": {
                "cost": {
                    "subtotalAmount": {
                        "amount": "50",
                        "currencyCode": "AED"
                    }
                },
                "lines": [
                    {
                        "quantity": 5,
                        "merchandise": {
                            "id": "gid://shopify/ProductVariant/0"
                        }
                    },
                    {
                        "quantity": 1,
                        "merchandise": {
                            "id": "gid://shopify/ProductVariant/1"
                        }
                    }
                ]
            },
            "discountNode": { "metafield": { "value": "{\"discountRequirementType\":\"QUANTITY\",\"rules\":[]}" }},
            "presentmentCurrencyRate": "2.00"
        }
        "#;

        let expected_input = input(
            Some(DiscountConfiguration {
                discount_requirement_type: DiscountRequirementType::Quantity,
                rules: vec![],
            }),
            Some(2.00)
        );
            
        assert_eq!(expected_input, serde_json::from_str::<input::Input>(input_json).unwrap());
    }
}