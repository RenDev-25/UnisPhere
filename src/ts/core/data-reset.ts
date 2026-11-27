/**
 * One-time cleanup of the retired UNISphere demo/operational dataset.
 *
 * Account records and authentication state are intentionally excluded:
 * - ojtflow_student_accounts (including password hashes and salts)
 * - ojtflow_supervisor_accounts (including password hashes and salts)
 * - ojtflow_session
 *
 * Coordinator authentication is source-configured and is not stored in the
 * operational data stores.
 */
const CLEANUP_VERSION_KEY = 'ojtflow_operational_data_cleanup_v1';

const OPERATIONAL_DATA_KEYS = [
  'ojtflow_applications',
  'ojtflow_deployments',
  'ojtflow_student_eligibility',
  'ojtflow_eligibility_remarks',
  'ojtflow_student_requirements',
  'ojtflow_deployment_date_drafts',
  'ojtflow_company_records', // legacy localStorage company cache
  'ojtflow_company_records_updated',
  'ojtflow_requirements_updated',
] as const;

/** Clear demo/application data once without touching registered accounts. */
export function clearRetiredOperationalData(): void {
  try {
    if (localStorage.getItem(CLEANUP_VERSION_KEY) === 'done') return;

    for (const key of OPERATIONAL_DATA_KEYS) {
      localStorage.removeItem(key);
    }

    // Mark completion only after all localStorage removals succeeded.
    localStorage.setItem(CLEANUP_VERSION_KEY, 'done');
  } catch (error) {
    // Do not block portal access if browser storage is unavailable. The
    // cleanup can be retried on the next portal load.
    console.error('UNISphere operational-data cleanup could not be completed:', error);
  }
}
