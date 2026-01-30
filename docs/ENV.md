# Environment variables

Create a `.env` file in the project root. **Never commit `.env`.**

## SSO (OpenID Connect)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SSO_BASE_URL` | Yes | Base URL of the identity provider (e.g. `https://your-site.my.site.com`) |
| `VITE_SSO_APP_ID` | Yes | Application ID from the provider |
| `VITE_SSO_APP_SECRET` | Yes | Application secret from the provider |
| `VITE_SSO_REDIRECT_URI` | No | Callback URL (default: current origin, e.g. `http://localhost:3000`) |

For the Vite dev-server token proxy you can also set `SSO_APP_SECRET` (server-side; same value).

## Example

```env
VITE_SSO_BASE_URL=
VITE_SSO_APP_ID=
VITE_SSO_APP_SECRET=
```

Fill in values from your identity provider’s app settings.

**If you get `invalid_client_id`:** Use values without quotes or leading/trailing spaces in `.env`. Copy the Consumer Key exactly from Salesforce: Setup → App Manager → your Connected App → View (Consumer Key).
