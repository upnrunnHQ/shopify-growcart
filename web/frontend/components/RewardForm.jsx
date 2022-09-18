import { useState } from "react";
import {
    Card,
    Form,
    FormLayout,
    ChoiceList,
    Stack,
    Layout,
    TextField
} from "@shopify/polaris";
import {
    ContextualSaveBar,
    useAppBridge,
    useNavigate,
} from "@shopify/app-bridge-react";
import {
    RequirementType,
} from "@shopify/discount-app-components";
import { useForm, useField } from "@shopify/react-form";
import { useAuthenticatedFetch, useAppQuery } from "../hooks";

export function RewardForm() {
    const [settings, setSettings] = useState({
        minimumRequiremenType: [RequirementType.Subtotal],
        discountType: ["percentage"],
        discounts: [
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12a',
                title: '10% Off',
                type: 'percent',
                value: 10,
                amountOrQuantity: 2,
                hint: 'Add {{quantity}} more to get {{title}}',
                enabled: true,
            },
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12',
                title: '20% Off',
                type: 'percent',
                value: 20,
                amountOrQuantity: 5,
                hint: 'Add {{quantity}} more to get {{title}}',
                enabled: true,
            }
        ]
    });
    const navigate = useNavigate();
    const appBridge = useAppBridge();
    const fetch = useAuthenticatedFetch();
    const onSubmit = async (body) => console.log("submit", body);
    const {
        fields: {
            minimumRequiremenType,
            discountType,
            discounts
        },
        submit,
        submitting,
        dirty,
        reset,
        submitErrors,
        makeClean,
    } = useForm({
        fields: {
            minimumRequiremenType: useField(settings.minimumRequiremenType),
            discountType: useField(settings.discountType),
            discounts: useField(settings.discounts),
        },
        async onSubmit(form) {
            console.log(form);
            return { status: 'success' };
        },
    });

    return (
        <Stack vertical>
            <Layout>
                <Layout.Section>
                    <Form>
                        <ContextualSaveBar
                            saveAction={{
                                label: "Save",
                                onAction: submit,
                                loading: submitting,
                                disabled: submitting,
                            }}
                            discardAction={{
                                label: "Discard",
                                onAction: reset,
                                loading: submitting,
                                disabled: submitting,
                            }}
                            visible={dirty}
                            fullWidth
                        />
                        <Card title="Minimum requirement type" sectioned>
                            <ChoiceList
                                title="Minimum requirement type"
                                titleHidden
                                choices={[
                                    { label: 'Minimum purchase amount', value: RequirementType.Subtotal },
                                    { label: 'Minimum quantity of items', value: RequirementType.Quantity },
                                ]}
                                selected={minimumRequiremenType.value}
                                onChange={minimumRequiremenType.onChange}
                            />
                        </Card>

                        {discounts.value.map(discount => (
                            <Card title={discount.title} sectioned>
                                <FormLayout>
                                    <TextField
                                        label="Title"
                                        value={discount.title}
                                        onChange={() => { }}
                                        autoComplete="off"
                                    />
                                    <ChoiceList
                                        title="Discount type"
                                        choices={[
                                            { label: 'Percentage', value: 'percentage' },
                                            { label: 'Fixed amount', value: 'fixed' },
                                        ]}
                                        selected={[discount.type]}
                                        onChange={() => { }}
                                    />
                                    <TextField
                                        label="Minimum cart quantity"
                                        type="number"
                                        value={discount.amountOrQuantity}
                                        onChange={() => { }}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="Hint"
                                        value={discount.hint}
                                        onChange={() => { }}
                                        helpText="We’ll use this address if we need to contact you about your account."
                                        autoComplete="off"
                                    />
                                </FormLayout>
                            </Card>
                        ))}
                    </Form>
                </Layout.Section>
            </Layout>
        </Stack>
    );
}
