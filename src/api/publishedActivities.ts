import { generateClient } from 'aws-amplify/api';
import type { ActivitySubmissionRecord } from './activitySubmissions';
import { isGraphqlUnauthorizedError } from './activitySubmissions';
import { publishedActivityFromSubmission } from '../utils/activityIds';

export type UpsertPublishedActivityInput = {
  activity_id: string;
  region: string;
  country: string;
  activity: string;
  description: string;
  status: string;
  focal_point?: string;
  budget?: string;
  timeline?: string;
  focal_point_name?: string;
  focal_point_email?: string;
  location?: string;
  building_block?: string;
  use_case?: string;
  video_url?: string;
  image_keys?: string[];
  source: string;
  source_id?: string;
  published_at?: string;
  updated_at?: string;
  published_by?: string;
};

export type PublishedActivityRecord = UpsertPublishedActivityInput & {
  created_at?: string | null;
};

type ListActivitiesResponse = {
  listGovstackActivities?: {
    items?: PublishedActivityRecord[] | null;
    nextToken?: string | null;
  } | null;
};

const activityFields = /* GraphQL */ `
  activity_id
  region
  country
  activity
  description
  status
  focal_point
  budget
  timeline
  focal_point_name
  focal_point_email
  location
  building_block
  use_case
  video_url
  image_keys
  source
  source_id
  published_at
  updated_at
  published_by
`;

const createPublishedActivityMutation = /* GraphQL */ `
  mutation CreateGovstackActivities($input: CreateGovstackActivitiesInput!) {
    createGovstackActivities(input: $input) {
      ${activityFields}
    }
  }
`;

const updatePublishedActivityMutation = /* GraphQL */ `
  mutation UpdateGovstackActivities($input: UpdateGovstackActivitiesInput!) {
    updateGovstackActivities(input: $input) {
      ${activityFields}
    }
  }
`;

const getPublishedActivityQuery = /* GraphQL */ `
  query GetGovstackActivities($activity_id: ID!) {
    getGovstackActivities(activity_id: $activity_id) {
      ${activityFields}
    }
  }
`;

const listPublishedActivitiesQuery = /* GraphQL */ `
  query ListGovstackActivities($limit: Int, $nextToken: String) {
    listGovstackActivities(limit: $limit, nextToken: $nextToken) {
      items {
        ${activityFields}
      }
      nextToken
    }
  }
`;

const client = generateClient();

function extractGraphqlErrorMessage(err: unknown): string | null {
  if (err && typeof err === 'object') {
    const withErrors = err as { errors?: { message?: string }[]; message?: string };
    if (withErrors.errors?.length) {
      return graphqlErrorsMessage(
        withErrors.errors.filter((e): e is { message: string } => Boolean(e.message)),
      );
    }
    if (typeof withErrors.message === 'string' && withErrors.message.trim()) {
      return withErrors.message;
    }
  }
  return null;
}

function formatGraphqlError(err: unknown, label: string): Error {
  if (isGraphqlUnauthorizedError(err)) {
    return new Error(
      'Administrator access required to publish activities. Your account must be in the Cognito group "admins".',
    );
  }
  const detail = extractGraphqlErrorMessage(err);
  if (detail) {
    return new Error(detail);
  }
  if (err instanceof Error && err.message && !err.message.startsWith('Failed ')) {
    return err;
  }
  return new Error(`Failed ${label}.`);
}

function graphqlErrorsMessage(errors: { message: string }[]): string {
  return errors.map(error => error.message).join('; ');
}

function assertGraphqlData<T>(
  response: { data?: T; errors?: { message: string }[] },
  label: string,
): T {
  if (response.errors?.length) {
    throw new Error(graphqlErrorsMessage(response.errors));
  }
  if (!response.data) {
    throw new Error(`No data returned for ${label}.`);
  }
  return response.data;
}

async function runGraphql<TData>(
  label: string,
  request: Parameters<typeof client.graphql>[0],
): Promise<TData> {
  try {
    const response = await client.graphql(request);
    if (!('data' in response)) {
      throw new Error(`Unexpected GraphQL response for ${label}.`);
    }
    return assertGraphqlData<TData>(response, label);
  } catch (err) {
    throw formatGraphqlError(err, label);
  }
}

export async function getPublishedActivity(activityId: string): Promise<PublishedActivityRecord | null> {
  const data = await runGraphql<{ getGovstackActivities?: PublishedActivityRecord | null }>(
    'getPublishedActivity',
    {
      query: getPublishedActivityQuery,
      variables: { activity_id: activityId },
      authMode: 'userPool',
    },
  );
  return data.getGovstackActivities ?? null;
}

export async function createPublishedActivity(
  input: UpsertPublishedActivityInput,
): Promise<PublishedActivityRecord> {
  const data = await runGraphql<{ createGovstackActivities?: PublishedActivityRecord | null }>(
    'createPublishedActivity',
    {
      query: createPublishedActivityMutation,
      variables: { input: { ...input, image_keys: input.image_keys ?? [] } },
      authMode: 'userPool',
    },
  );

  const record = data.createGovstackActivities;
  if (!record?.activity_id) {
    return { ...input, activity_id: input.activity_id };
  }
  return record;
}

export async function updatePublishedActivity(
  input: UpsertPublishedActivityInput,
): Promise<PublishedActivityRecord> {
  const data = await runGraphql<{ updateGovstackActivities?: PublishedActivityRecord | null }>(
    'updatePublishedActivity',
    {
      query: updatePublishedActivityMutation,
      variables: { input: { ...input, image_keys: input.image_keys ?? [] } },
      authMode: 'userPool',
    },
  );

  const record = data.updateGovstackActivities;
  if (!record?.activity_id) {
    throw new Error('Published activity was not updated.');
  }
  return record;
}

/**
 * Admin only — idempotent publish by activity_id.
 * Uses create (DynamoDB PutItem), which overwrites an existing row.
 * Does not call get/update so validate works even if only create + list resolvers exist.
 */
export async function upsertPublishedActivity(
  input: UpsertPublishedActivityInput,
): Promise<PublishedActivityRecord> {
  return createPublishedActivity(input);
}

export async function upsertPublishedActivityFromSubmission(
  record: ActivitySubmissionRecord,
  publishedBy?: string | null,
): Promise<PublishedActivityRecord> {
  return upsertPublishedActivity(publishedActivityFromSubmission(record, publishedBy));
}

export async function listPublishedActivitiesPage(options?: {
  limit?: number;
  nextToken?: string | null;
}): Promise<{ items: PublishedActivityRecord[]; nextToken: string | null }> {
  const authMode = 'userPool' as const;
  const data = await runGraphql<ListActivitiesResponse>('listPublishedActivities', {
    query: listPublishedActivitiesQuery,
    variables: {
      limit: options?.limit ?? 100,
      nextToken: options?.nextToken ?? null,
    },
    authMode,
  });

  const connection = data.listGovstackActivities;
  return {
    items: (connection?.items ?? []).filter(
      (item): item is PublishedActivityRecord => Boolean(item?.activity_id),
    ),
    nextToken: connection?.nextToken ?? null,
  };
}

export async function listAllPublishedActivities(): Promise<PublishedActivityRecord[]> {
  const all: PublishedActivityRecord[] = [];
  let nextToken: string | null = null;

  do {
    const page = await listPublishedActivitiesPage({ limit: 100, nextToken });
    all.push(...page.items);
    nextToken = page.nextToken;
  } while (nextToken);

  return all;
}
