import {
  createKindeServerClient,
  GrantType,
} from "@kinde-oss/kinde-typescript-sdk";
import "dotenv/config";

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_ISSUER_URL,
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectURL: `${process.env.KINDE_SITE_URL}/callback`,
  logoutRedirectURL: process.env.KINDE_SITE_URL,
});

export { kindeClient };
