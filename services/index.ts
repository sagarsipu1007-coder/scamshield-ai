/**
 * Service registry. Import from here so swapping mocks for real services
 * happens in one place when the backend is ready.
 */

export { mockAuthService as authService } from './mockAuth';
export { mockScanService as scanService } from './mockScan';
export { mockAssistantService as assistantService } from './mockAssistant';
export { mockIncidentService as incidentService } from './mockIncident';
export { mockActivityService as activityService } from './mockActivity';

export type * from './types';
