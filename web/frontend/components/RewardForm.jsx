import { useState } from "react";
import {
    Card,
    Form,
    FormLayout,
    ChoiceList,
    Stack,
    Layout,
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
        rules: [
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12a',
                name: '10% Off',
                type: 'percent',
                value: 10,
                quantity: 2,
                hint: 'Add {{quantity}} more to get {{name}}',
                enabled: true,
            },
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12',
                name: '20% Off',
                type: 'percent',
                value: 20,
                quantity: 5,
                hint: 'Add {{quantity}} more to get {{name}}',
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
            discountType
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
        },
        async onSubmit(form) {
            const remoteErrors = []; // your API call goes here
            if (remoteErrors.length > 0) {
                return { status: 'fail', errors: remoteErrors };
            }

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
                        <FormLayout>
                            <Card>
                                <Card.Section title="Minimum requirement type">
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
                                </Card.Section>

                                <Card.Section title="Discount type">
                                    <ChoiceList
                                        title="Discount type"
                                        titleHidden
                                        choices={[
                                            { label: 'Percentage', value: 'percentage' },
                                            { label: 'Fixed amount', value: 'fixed' },
                                        ]}
                                        selected={discountType.value}
                                        onChange={discountType.onChange}
                                    />
                                </Card.Section>
                            </Card>
                        </FormLayout>
                    </Form>
                </Layout.Section>
            </Layout>
        </Stack>
    );
}
