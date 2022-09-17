import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
} from "@shopify/polaris";
import { RewardsIndex } from "../components";

export default function HomePage() {
  /*
    Add an App Bridge useNavigate hook to set up the navigate function.
    This function modifies the top-level browser URL so that you can
    navigate within the embedded app and keep the browser in sync on reload.
  */
  const navigate = useNavigate();

  /*
    These are mock values. Setting these values lets you preview the loading markup and the empty state.
  */
  const isLoading = false;
  const isRefetching = false;
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


  /* Set the QR codes to use in the list */
  const rewardsMarkup = rewards?.length ? (
    <RewardsIndex rewards={rewards} loading={isRefetching} />
  ) : null;

  /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  /* Use Polaris Card and EmptyState components to define the contents of the empty state */
  const emptyStateMarkup =
    !isLoading && !rewards?.length ? (
      <Card sectioned>
        <EmptyState
          heading="Create unique reward rules for your shop!"
          action={{
            content: "Create reward",
            onAction: () => navigate("/rewards/new"),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Nudge customers to spend more with your brand.
          </p>
        </EmptyState>
      </Card>
    ) : null;

  /*
    Use Polaris Page and TitleBar components to create the page layout,
    and include the empty state contents set above.
  */
  return (
    <Page>
      <TitleBar
        title="Rewards"
        primaryAction={{
          content: "Create reward",
          onAction: () => navigate("/rewards/new"),
        }}
      />
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {rewardsMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
