---
aliases:
title: HOVR
role: UX/UI Designer
highlight: "Reducing driver approval time by 84.9%: How an OCR-powered architectural rebuild transformed a 48-second operational bottleneck into a 7-second streamlined workflow"
hero_images:
  - Bulk-approval.mp4
thumbnail_light: /hovr/thumbnail-test2.jpg
thumbnail_dark: /hovr/thumbnail-test.jpg
---
### The Impact
#### 84.9% Reduction in Manual Review Time
The most critical metric for the HOVR admin panel was driver activation speed. 
By completely overhauling the document verification workflow, a new solution reduced the time required for a single driver approval from 48.08 seconds to just 7.26 seconds. This 84.9% time savings effectively eliminated the operational bottleneck in the driver onboarding pipeline.
![Original](/hovr/Original%20time.mp4)
![New Solution](/hovr/New%20Time.mp4)
---
### The Catalyst
#### Uncovering the 48-Second Bottleneck

This transformation began not at a desk, but through direct conversations and observation of the support team's daily grind. User interviews and workflow tracking revealed a deeper, more punishing issue: manual document verification. 

Support staff were forced to spend nearly 48 seconds per driver, individually clicking through uploaded documents and navigating clumsy pop-up windows. 

This insight was the turning point. The core objective became enabling users to review and approve all documents simultaneously in a single view: **A complete architectural rebuild of the validation system.**

> ### Action: User Interviews & Research
> Conducted direct **user interviews** and **workflow analysis** with the support staff to uncover the root causes of the 48-second approval bottleneck.

> ### Finding: Key User Pain Points
> * **Cumbersome Review Process:** Manually opening and verifying each document individually is highly inefficient and time-consuming, even with existing automation.
> * **High-Friction Rejection:** The current rejection flow requires navigating clumsy popups and scrolling to find specific reasons, causing unnecessary delays.
> * **Desire for Bulk Approval:** Staff need a single-action option to approve all matching documents at once to drastically cut processing time.

> ### Action: Technical Feasibility Sync
> Shared early problem-solving sketches with the engineering team to align on technical constraints and explore the scope of automation capabilities.

> ### Finding: OCR Automation Potential
>  **90%+ Auto-Scanning Accuracy:** Engineering confirmed the upcoming OCR technology will guarantee at least 90% accuracy for driver-uploaded documents, creating an opportunity for automation.

### Unpacking the Solution 01
#### Zero-Context-Switching Architecture
To achieve a sub-10-second approval rate, the primary technical constraint to overcome was navigation friction.
![[solution1-1.png]]
<video src="/hovr/solution1.mp4" autoplay loop muted playsinline></video>

* **Split-View Inspection:** Introduced a dual-panel workflow where clicking a driver's card on the left list immediately renders a document details view on the right.
* **Cognitive Load Reduction:** This side-by-side layout ensures that complex data comparison happens entirely within a single screen. Support staff can validate inputs without ever losing the context of the overall queue, drastically reducing the number of clicks required.

### Unpacking the Solution 02
#### Automating Straight-Through Processing
The fastest way to process a document is to let the system verify it first. **An OCR-powered data validation system** was integrated into the workflow to handle the heavy lifting.
<video src="/hovr/Bulk-approval.mp4" controls width="100%"></video>
<video src="/hovr/Approve-one.mp4" controls width="100%"></video>
* **Real-Time Validation Tags:** The system evaluates documents instantly, displaying clear status indicators on the left-hand card ("Image matches typed info" or "Image doesn't match typed info")
* **One-Click Approvals:** Support staff can scan these pre-validated cues at a glance and approve each legitimate document with a single click, ensuring a rapid and continuous workflow.

### Unpacking the Solution 03
#### Frictionless Rejection & Feedback Loops
Handling invalid documents efficiently is just as crucial as processing valid ones. An optimized rejection flow **eliminates tedious, repetitive drill-down interactions**, and minimizes support tickets.
<video src="/hovr/Reject.mov" controls width="100%"></video>
* **Contextual Rejection:** If a mismatch is detected, staff can reject the document directly above the image viewer, without leaving the current screen.
* **Automated SMS Triggers:** A rejection cannot be submitted without a reason. Staff must select from a predefined list or enter a custom note. This payload is instantly routed to the driver via SMS, providing precise instructions on how to correct their submission and avoid repeating the mistake.

### Takeaway
#### Internal Tools Require a Different Lens
Unlike public-facing products, enterprise and internal tools are specialized utility engines. Efficiency and workflow optimization must take precedence over visual embellishment. 

By collaborating directly with the end-users (the support team) to gather clear feature requirements, I learned that rapid problem-solving and deep empathy for the operator's daily grind are the true core of UX design. This experience reinforced the importance of direct user communication, particularly in a fast-paced startup environment.
