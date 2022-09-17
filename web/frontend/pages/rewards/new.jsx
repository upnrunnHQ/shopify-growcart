import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { RewardForm } from "../../components";

export default function ManageReward() {
    const breadcrumbs = [{ content: "Rewards", url: "/" }];

    return (
        <Page>
            <TitleBar
                title="Create new reward"
                breadcrumbs={breadcrumbs}
                primaryAction={null}
            />
            <RewardForm />
        </Page>
    );
}
