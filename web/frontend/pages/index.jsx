import { TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  Layout,
  Page,
  SkeletonBodyText,
} from "@shopify/polaris";
import { useAppQuery } from "../hooks";
import { RewardForm } from "../components";

export default function HomePage() {
  const {
    data: settings,
    isLoading,
  } = useAppQuery({
    url: "/api/settings",
    reactQueryOptions: {
      refetchOnReconnect: false,
    },
  });

  return (
    <Page narrowWidth>
      <TitleBar title="GrowCart Settings" primaryAction={null} />
      <Layout>
        <Layout.Section>
          {isLoading ? (
            <Card sectioned>
              <Loading />
              <SkeletonBodyText />
            </Card>
          ) : <RewardForm {...settings} />}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
