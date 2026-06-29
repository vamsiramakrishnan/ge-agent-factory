---
name: ge-unstructured-blob-packager
description: |
  Use to generate and package unstructured evidence blobs for mock systems:
  PDF, DOCX, Markdown, HTML, email transcripts, chat transcripts, contracts,
  policies, plan documents, and Cloud Storage manifests.
triggers:
  - "PDF"
  - "DOCX"
  - "document blob"
  - "unstructured"
  - "Cloud Storage documents"
  - "plan documents"
outputs:
  primary: mock_data/blobs/
  secondary: [mock_data/cloud/documents_manifest.jsonl]
resources:
  scripts: []
  references:
    - path: references/blob-package-contract.md
      purpose: Blob manifest, checksum, URI, and citation-anchor contract.
      use_when: Creating or auditing unstructured evidence packages.
  assets:
    - path: assets/object-plan.yaml
      purpose: Template object plan for Cloud Storage evidence blobs.
      use_when: Creating mock_data/blobs/object-plan.yaml.
---

# GE Unstructured Blob Packager

Use this for source evidence that should not become fake relational rows.

## Data Shapes

- PDF: plan docs, policy packets, statements, contracts.
- DOCX: generated letters, drafts, SOPs, executive briefs.
- Markdown/HTML: local lightweight stand-ins when binary fidelity is not required.
- Email/chat transcripts: conversational evidence and notification trails.

## Cloud Target

- Store blobs in Cloud Storage.
- Store metadata in BigQuery `documents_manifest`.
- Include document IDs, checksums, MIME type, source system, URI, linked entities, and citation anchors.

Do not stuff long documents into OLTP tables unless the use case explicitly needs a text index table.

## Bundled Resources

- `references/blob-package-contract.md`: when creating manifests, checksums, or citation anchors.
- `assets/object-plan.yaml`: object-plan template.
