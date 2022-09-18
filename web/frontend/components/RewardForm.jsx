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

                        <Card title="10% Off" sectioned>
                            <FormLayout>
                                <TextField
                                    label="Name"
                                    value={"{{value}} % Off"}
                                    onChange={() => { }}
                                    autoComplete="off"
                                />
                                <ChoiceList
                                    title="Discount type"
                                    choices={[
                                        { label: 'Percentage', value: 'percentage' },
                                        { label: 'Fixed amount', value: 'fixed' },
                                    ]}
                                    selected={discountType.value}
                                    onChange={discountType.onChange}
                                />
                                <TextField
                                    label="Minimum cart quantity"
                                    type="number"
                                    value={""}
                                    onChange={() => { }}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="Hint"
                                    value={"**Add** {{quantity}} more to get {{name}}"}
                                    onChange={() => { }}
                                    helpText="We’ll use this address if we need to contact you about your account."
                                    autoComplete="off"
                                />
                            </FormLayout>
                        </Card>
                    </Form>
                </Layout.Section>
            </Layout>
        </Stack>
    );
}
