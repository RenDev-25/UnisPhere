
/* src/ts/core/constants.ts */

export type Portal = "student" | "coordinator";

export type BadgeVariant =
    | "approved"
    | "pending"
    | "rejected"
    | "draft"
    | "info"
    | "navy";

/** Keys are status labels lower-cased with spaces replaced by underscores. */
export const STATUS_VARIANTS: Record<string, BadgeVariant> = {
    // Eligibility
    eligible: "approved",
    for_review: "pending",
    incomplete: "rejected",
    not_eligible: "rejected",

    // Applications
    pending: "pending",
    pending_decision: "pending",
    under_review: "info",
    accepted: "approved",
    rejected: "rejected",
    pending_verification: "pending",
    awaiting_company_confirmation: "pending",

    // Requirements
    approved: "approved",
    pending_review: "pending",
    not_submitted: "rejected",
    for_correction: "rejected",
    for_revision: "rejected",

    // Placement and deployment
    placement_confirmed: "info",
    deployed: "approved",
    not_yet_deployed: "draft",
    placed: "info",

    // OJT status
    applying: "info",
    awaiting_assignment: "pending",
    not_yet_eligible: "draft",
    review_queue: "pending",

    // Companies
    active: "approved",
    inactive: "draft",
    accepting_applications: "approved",
    not_accepting_applications: "rejected",
    slots_filled: "rejected"
};
