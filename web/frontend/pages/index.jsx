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
    isRefetching,
  } = useAppQuery({
    url: "/api/settings",
    reactQueryOptions: {
      refetchOnReconnect: false,
    },
  });

  console.log(settings);
  
  const rewards = [
    {
      createdAt: "2022-06-13",
      destination: "checkout",
      title: "My first QR code",
      id: 1,
      discountCode: "SUMMERDISCOUNT",
      product: {
        title: "Faded t-shirt",
      }
    },
  ];

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
          ) : null}
          <RewardForm />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
