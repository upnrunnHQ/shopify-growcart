import { useState } from "react";
import {
    Card,
    Form,
    FormLayout,
    ChoiceList,
    Button,
    Layout,
    TextField,
    Heading
} from "@shopify/polaris";
import {
    ContextualSaveBar,
} from "@shopify/app-bridge-react";
import {
    RequirementType,
} from "@shopify/discount-app-components";
import { useForm, useField } from "@shopify/react-form";
import { useQueryClient } from 'react-query'
import { v4 as uuidv4 } from 'uuid';
import { useAppMutation } from "../hooks";

const staticDiscounts = [
    {
        id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12a',
        title: '10% Off',
        type: 'percentage',
        value: 10,
        amountOrQuantity: 2,
        hint: 'Add {{quantity}} more to get {{title}}',
        enabled: true,
    },
    {
        id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12',
        title: '20% Off',
        type: 'fixed',
        value: 20,
        amountOrQuantity: 5,
        hint: 'Add {{quantity}} more to get {{title}}',
        enabled: true,
    }
];

export function RewardForm(props) {
    const queryClient = useQueryClient();
    const mutation = useAppMutation({
        url: `/api/settings/${props.id}`,
        fetchInit: {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        reactMutationOptions: {
            onSuccess: () => {
                // queryClient.invalidateQueries('/api/settings');
            }
        }
    });

    const [settings, setSettings] = useState({
        ...props,
        discounts: JSON.parse(props.discounts),
        // discounts: staticDiscounts,
    });
    const {
        fields: {
            minimumRequiremenType,
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
            discounts: useField(settings.discounts),
        },
        async onSubmit(fieldValues) {
            try {
                const response = await mutation.mutateAsync({
                    ...props,
                    ...fieldValues
                })
                console.log(fieldValues);
                console.log(JSON.parse(response[0].discounts));
                makeClean();
            } catch (remoteErrors) {
                return { status: 'fail', errors: remoteErrors };
            } finally {
                return { status: 'success' }
            }
        }
    });

    function updateDiscounts(discount) {
        discounts.onChange(discounts.value.map(d => discount.id === d.id ? discount : d));
    }

    function removeDiscounts(discount) {
        discounts.onChange(discounts.value.filter(d => discount.id !== d.id));
    }

    return (
        <Form onSubmit={submit}>
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
                    disabled: submitting,
                }}
                visible={dirty}
                fullWidth
            />
            <Layout>
                <Layout.Section>
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
                </Layout.Section>

                <Layout.Section>
                    <Heading>Rewards</Heading>
                </Layout.Section>

                <Layout.Section>
                    <div className="Discounts-List">
                        {discounts.value.map(discount => (
                            <Card title={discount.title} sectioned key={discount.id}>
                                <FormLayout>
                                    <TextField
                                        label="Title"
                                        value={discount.title}
                                        onChange={(title) => updateDiscounts({
                                            ...discount,
                                            title
                                        })}
                                        autoComplete="off"
                                    />
                                    <ChoiceList
                                        title="Discount type"
                                        choices={[
                                            { label: 'Percentage', value: 'percentage' },
                                            { label: 'Fixed amount', value: 'fixed' },
                                        ]}
                                        selected={discount.type}
                                        onChange={(type) => updateDiscounts({
                                            ...discount,
                                            type
                                        })}
                                    />
                                    <TextField
                                        label="Minimum cart quantity"
                                        type="number"
                                        value={discount.amountOrQuantity}
                                        onChange={(amountOrQuantity) => updateDiscounts({
                                            ...discount,
                                            amountOrQuantity
                                        })}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="Hint"
                                        value={discount.hint}
                                        onChange={(hint) => updateDiscounts({
                                            ...discount,
                                            hint
                                        })}
                                        helpText="We’ll use this address if we need to contact you about your account."
                                        autoComplete="off"
                                    />

                                    <Button size="slim" destructive onClick={() => removeDiscounts(discount)}>Delete</Button>
                                </FormLayout>
                            </Card>
                        ))}
                    </div>
                </Layout.Section>

                <Layout.Section>
                    <Button onClick={() => discounts.onChange([
                        ...discounts.value,
                        {
                            id: uuidv4(),
                            title: '10% Off',
                            type: 'percentage',
                            value: 10,
                            amountOrQuantity: 2,
                            hint: 'Add {{quantity}} more to get {{title}}',
                            enabled: true,
                        }
                    ])}>Add reward</Button>
                </Layout.Section>
            </Layout>
        </Form>
    );
}
