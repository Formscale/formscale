import DashTitle from "../components/title";

import FormsContent from "./forms";

export default function FormsPage() {
  return (
    <>
      <DashTitle title="Forms" />
      <FormsContent />
    </>
  );
}

// rename to formscale it sounds cooler

// todo:
// x pagination
// x table row should be a link
// x reusable table, columns, and filters
// x sidebar footer should use default-dropdown
// - create tables for submissions, logs, and domains
// - shadcn sheets for specific field/table data
// x finish template card for data & use in settings
// - replace button & link with link inside button asChild
// - add form settings to the schema instead of saved as json string
// - dark mode light mode
// - work on mobile
// - fix env

// /forms/id
// - add metrics/live monitor to form
// x submissions table
// x filter submissions table headers
// 1/2 webhook & zod/schema validation
// - sheet for full submission data
// - special formatting for data (ex: left align numbers, etc)
// x search submissions from all parameters
// - disable "save changes" button if no changes
// - add delete section in form settings

// settings
// - add members to settings - add/remove members, see status, etc
// - addons? - pay for additional integrations

// metrics
// - fix filters
// - set to last 30 days
// - fix 24 hour invalid date error

// general
// - add global error sonner/boundary?
// - 404 page

// api
// - add tests
