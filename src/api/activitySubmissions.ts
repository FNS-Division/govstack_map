import { generateClient } from 'aws-amplify/api';

export type CreateActivitySubmissionInput = {
  region: string;
  country: string;
  activity: string;
  description: string;
  status: string;
  focal_point_name?: string;
  focal_point_email?: string;
  location?: string;
  building_block?: string;
  use_case?: string;
  budget?: string;
  timeline?: string;
  video_url?: string;
  image_keys?: string[];
};

export type ActivitySubmissionRecord = {
  submission_id: string;
  submission_status?: string | null;
  region?: string | null;
  country?: string | null;
  activity?: string | null;
  description?: string | null;
  status?: string | null;
  focal_point_name?: string | null;
  focal_point_email?: string | null;
  location?: string | null;
  building_block?: string | null;
  use_case?: string | null;
  budget?: string | null;
  timeline?: string | null;
  video_url?: string | null;
  image_keys?: string[] | null;
  submitted_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ListSubmissionsResponse = {
  listGovstackActivitySubmissions?: {
    items?: ActivitySubmissionRecord[] | null;
    nextToken?: string | null;
  } | null;
};

const submissionFields = /* GraphQL */ `
  submission_id
  submission_status
  region
  country
  activity
  description
  status
  focal_point_name
  focal_point_email
  location
  building_block
  use_case
  budget
  timeline
  video_url
  image_keys
  submitted_by
  created_at
  updated_at
`;

const createActivitySubmissionMutation = /* GraphQL */ `
  mutation CreateGovstackActivitySubmissions($input: CreateGovstackActivitySubmissionsInput!) {
    createGovstackActivitySubmissions(input: $input) {
      ${submissionFields}
    }
  }
`;

const listActivitySubmissionsQuery = /* GraphQL */ `
  query ListGovstackActivitySubmissions($limit: Int, $nextToken: String) {
    listGovstackActivitySubmissions(limit: $limit, nextToken: $nextToken) {
      items {
        ${submissionFields}
      }
      nextToken
    }
  }
`;

const client = generateClient();

function assertGraphqlData<T>(
  response: { data?: T; errors?: { message: string }[] },
  label: string,
): T {
  if (response.errors?.length) {
    throw new Error(response.errors.map(error => error.message).join('; '));
  }
  if (!response.data) {
    throw new Error(`No data returned for ${label}.`);
  }
  return response.data;
}

async function runGraphqlQuery<TData>(label: string, request: Parameters<typeof client.graphql>[0]) {
  const response = await client.graphql(request);
  if (!('data' in response)) {
    throw new Error(`Unexpected GraphQL response for ${label}.`);
  }
  return assertGraphqlData<TData>(response, label);
}

export async function createActivitySubmission(
  input: CreateActivitySubmissionInput,
): Promise<ActivitySubmissionRecord> {
  const data = await runGraphqlQuery<{ createGovstackActivitySubmissions?: ActivitySubmissionRecord | null }>(
    'createActivitySubmission',
    {
      query: createActivitySubmissionMutation,
      variables: { input: { ...input, image_keys: input.image_keys ?? [] } },
      authMode: 'userPool',
    },
  );

  const record = data.createGovstackActivitySubmissions;
  if (!record?.submission_id) {
    throw new Error('Submission was not created.');
  }

  return record;
}

/** Fetches one page of submissions from AppSync. */
export async function listActivitySubmissionsPage(options?: {
  limit?: number;
  nextToken?: string | null;
}): Promise<{ items: ActivitySubmissionRecord[]; nextToken: string | null }> {
  const data = await runGraphqlQuery<ListSubmissionsResponse>('listActivitySubmissions', {
    query: listActivitySubmissionsQuery,
    variables: {
      limit: options?.limit ?? 100,
      nextToken: options?.nextToken ?? null,
    },
    authMode: 'userPool',
  });

  const connection = data.listGovstackActivitySubmissions;
  return {
    items: (connection?.items ?? []).filter(
      (item): item is ActivitySubmissionRecord => Boolean(item?.submission_id),
    ),
    nextToken: connection?.nextToken ?? null,
  };
}

/** Loads all submission pages (for admin review). */
export async function listAllActivitySubmissions(): Promise<ActivitySubmissionRecord[]> {
  const all: ActivitySubmissionRecord[] = [];
  let nextToken: string | null = null;

  do {
    const page = await listActivitySubmissionsPage({ limit: 100, nextToken });
    all.push(...page.items);
    nextToken = page.nextToken;
  } while (nextToken);

  return all.sort((a, b) => {
    const aTime = a.created_at ?? '';
    const bTime = b.created_at ?? '';
    return bTime.localeCompare(aTime);
  });
}
