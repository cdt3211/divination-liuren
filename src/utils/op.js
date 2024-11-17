import { OpenPanel } from '@openpanel/web';

export const op = new OpenPanel({
  clientId: process.env.OPENPANEL_CLIENTID,
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
});