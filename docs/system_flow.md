# AI Cognitive Tutor — System Flow

This document maps the visual system flow into the repository files (non-invasive changes — documentation + UI page).

1. Student Login / Registration
- Frontend entry points: [Frontend/src/components/sidebar.jsx](Frontend/src/components/sidebar.jsx)

2. Question Submission (text or image)
- Frontend UI: [Frontend/src/components/UploadDropzone.jsx](Frontend/src/components/UploadDropzone.jsx)
- Chat UI: [Frontend/src/components/ChatBox.jsx](Frontend/src/components/ChatBox.jsx)

3. Input Processing
- Upload endpoint and preprocessing: [Backend/app/api/upload.py](Backend/app/api/upload.py)
- Image helpers: [Backend/app/services/image_service.py](Backend/app/services/image_service.py)

4. AI-Based Content Understanding
- Prompt assembly and model client: [Backend/app/services/prompt_builder.py](Backend/app/services/prompt_builder.py), [Backend/app/services/groq_client.py](Backend/app/services/groq_client.py)

5. Cognitive Effort Analysis
- Effort scoring logic: [Backend/app/services/effort_service.py](Backend/app/services/effort_service.py)
- Effort API: [Backend/app/api/effort.py](Backend/app/api/effort.py)

6. Persistence & Progress Tracking
- Database access and models: [Backend/app/database/db.py](Backend/app/database/db.py), [Backend/app/database/db_model.py](Backend/app/database/db_model.py)

7. Frontend Guidance & Dashboard
- Effort and analytics UI: [Frontend/src/components/EffortPanel.jsx](Frontend/src/components/EffortPanel.jsx), [Frontend/src/components/Analytics.jsx](Frontend/src/components/Analytics.jsx), [Frontend/src/components/Dashboard.jsx](Frontend/src/components/Dashboard.jsx)

How this repo now reflects the flow
- A new in-app page `System Flow` has been added at [Frontend/src/components/SystemFlow.jsx](Frontend/src/components/SystemFlow.jsx) to present this mapping and guide navigation.
- The sidebar offers a "View System Flow" button to open the page without changing existing behavior.

Next steps (optional):
- Add visual diagram image to `Frontend/public/` and embed in `docs/system_flow.md` and `SystemFlow.jsx`.
- Add small API docs for each backend endpoint under `docs/api/`.
