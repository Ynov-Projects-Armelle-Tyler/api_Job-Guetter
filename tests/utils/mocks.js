
import { Server } from '@job-guetter/api-core';
import { MongoDB } from '@job-guetter/api-core/connectors';

export const mockServer = async (
  service,
  { serviceName, connectors = [MongoDB], returnOnlyServer = true } = {}
) => {
  service = service || (async () => (
    await Server({ serviceName, connectors })).start()
  );

  const runningService = await service();

  return returnOnlyServer ? runningService.server : runningService;
};
