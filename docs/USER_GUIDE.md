# Product Usage Guide

The application also contains this guide in its `راهنمای استفاده` page. This document is the canonical maintenance copy.

## Customer

1. Create a request and fill in the form name, purpose, organization, and owner unit.
2. In `طراحی فرم`, add sections and fields. For a select/radio field, add active choices.
3. In `گردش فرم`, record real stages and create one action for every decision.
4. Use `بازبینی و ارسال` to resolve validation messages before submission.
5. After a specialist requests completion, open `پرسش‌ها`, respond to the exact question, and resubmit.

## Specialist

1. Change the demo role to `کارشناس`.
2. Open the review queue from the specialist home page.
3. Start review, inspect form design and workflow tabs, then register focused questions.
4. Use `درخواست تکمیل` when customer input is insufficient.
5. Use `تأیید نهایی` when the request is complete, then download the structured Excel file for the design team.

## Manager

1. Change the demo role to `مدیر`.
2. Use the dashboard to identify requests needing attention.
3. Manage demo users in `کاربران`.
4. Manage reusable starter records in `قالب‌ها`.

## Output rules

- Excel export contains guide, form design, options, workflow, and open questions sheets.
- The PDF route currently opens browser print; choose Save as PDF in the browser dialog.
- In the future server version, both exports should be generated from the persisted request, not browser draft state.
