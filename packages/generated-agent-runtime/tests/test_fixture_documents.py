from generated_agent_runtime.fixture_documents import (
    list_documents,
    lookup_document_section,
    read_document,
    search_documents,
)


def test_document_helpers_list_read_and_search(tmp_path):
    (tmp_path / "policy.txt").write_text("Alpha policy requires approval for transfers.", encoding="utf-8")
    docs = [{"id": "policy", "title": "Policy", "type": "txt", "path": "policy.txt"}]

    assert list_documents(tmp_path, docs)["documents"][0]["wordCount"] == 6
    assert read_document(tmp_path, docs, "policy")["content"].startswith("Alpha")
    assert search_documents(tmp_path, docs, "approval")["results"][0]["id"] == "policy"


def test_lookup_document_section_filters_source_and_anchor(tmp_path):
    (tmp_path / "policy.txt").write_text("Intro\nCompensation anchor text\nTail", encoding="utf-8")
    docs = [
        {
            "id": "policy",
            "title": "Policy",
            "path": "policy.txt",
            "source_system_id": "workday",
        }
    ]
    result = lookup_document_section(
        tmp_path,
        docs,
        source_system_id="workday",
        section_anchor="anchor",
    )
    assert result["source_system_id"] == "workday"
    assert result["document"]["anchor_matched"] is True


def test_lookup_document_section_reports_no_candidate():
    result = lookup_document_section("/missing", [], source_system_id="workday")
    assert result["error"] == "no_document_for_source"
