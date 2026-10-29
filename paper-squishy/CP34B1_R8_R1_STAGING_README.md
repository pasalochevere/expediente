# Cuppy CP3.4B1-R8-R1 — staging only

**DO NOT MERGE TO MAIN OR SHIP TO CUSTOMERS.**

- Branch: `staging/cp34b1-r8-cuppy`
- Module: `paper-squishy/psq-cuppy-r8-staging.js` — disabled by default and requires preview hostname + explicit flag + active PSQ-FACTORY licence verified by the existing server-side access function.
- The six R4-R1 visual assets are in the companion locally generated ZIP, **not in this Git branch yet**. Missing files must block activation and never fall back to generic/mismatched backs.
- Install exact files in `paper-squishy/cp34b1-r8-assets/`: `cuppy_{original,lavanda,menta}_{front,back}.png`.
- Vercel protected preview creation could not complete: connected account returned 403 when creating `creatorplus-cuppy-r8-qa`. This branch has NOT been deployed to Vercel.
- Required next checks: Vercel Authentication all deployments, file GETs, valid user session on preview origin, PSQ-FACTORY entitlement, print previews, mobile, and negative permission cases.
- QA status for the **offline R7-based harness**: 16/16 desktop and 16/16 mobile after a responsive A4 screen fix. These are not a live R8 deployment or a licence validation.
