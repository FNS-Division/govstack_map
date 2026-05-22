const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "eu-central-1_hGrI0eQmt",
      userPoolClientId: "2mdldgrj96eao5tiogaqf7ckc0",
    },
  },
  API: {
    GraphQL: {
      endpoint:
        "https://5lg5sbprlnhvde3ucru3wx6vlq.appsync-api.eu-central-1.amazonaws.com/graphql",
      region: "eu-central-1",
      defaultAuthMode: "userPool" as const,
    },
  },
};

export default amplifyConfig;