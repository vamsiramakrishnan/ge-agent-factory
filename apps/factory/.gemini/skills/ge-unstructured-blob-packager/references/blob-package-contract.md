# Blob Package Contract

Use this reference only when creating or auditing `mock_data/blobs/**`.

Unstructured blobs represent evidence that should not be flattened into fake rows: PDFs, DOCX files, emails, chat transcripts, contracts, policy packets, plan documents, and generated letters.

Expected files:

```text
mock_data/blobs/object-plan.yaml
mock_data/blobs/manifest.yaml
mock_data/blobs/documents_manifest.ndjson
mock_data/blobs/load-gcs.sh
```

Requirements:

- Each blob has a deterministic document ID.
- Include MIME type, checksum, source system, linked entity IDs, and citation anchors.
- Store target URI as `gs://<bucket>/<prefix>/<path>`.
- BigQuery `documents_manifest` rows must be queryable evidence, not the document body.
- Local mock path may use Markdown/HTML stand-ins when binary fidelity is not required.

Use Cloud Storage for blobs and BigQuery for metadata. Do not put long document bodies into OLTP tables by default.
