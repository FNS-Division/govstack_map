# AppSync: list submissions (admin review)

The admin page calls `listGovstackActivitySubmissions`. Attach a resolver if Queries fail.

## Schema

Ensure `Query.listGovstackActivitySubmissions` exists (auto-generated schema usually includes it).

## Resolver (AppSync JavaScript)

- **Type:** `Query`
- **Field:** `listGovstackActivitySubmissions`
- **Data source:** `govstack_activity_submissions_ds`
- **Runtime:** APPSYNC_JS

### `request`

```javascript
import { scan } from '@aws-appsync/utils/dynamodb';

export function request(ctx) {
  return scan({
    limit: ctx.args.limit ?? 200,
    nextToken: ctx.args.nextToken,
  });
}
```

### `response`

```javascript
export function response(ctx) {
  return {
    items: ctx.result.items ?? [],
    nextToken: ctx.result.nextToken,
  };
}
```

## Test in Queries

```graphql
query ListAll {
  listGovstackActivitySubmissions(limit: 50) {
    items {
      submission_id
      submission_status
      region
      country
      activity
      created_at
      submitted_by
    }
    nextToken
  }
}
```

Use **Cognito** (logged in) or **API Key** — same auth as create mutation.
