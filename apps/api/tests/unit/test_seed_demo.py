import pytest

from scripts.seed_demo import _demo_password


def test_demo_seed_requires_explicit_password(monkeypatch):
    monkeypatch.delenv("DEMO_PASSWORD", raising=False)

    with pytest.raises(SystemExit, match="Defina DEMO_PASSWORD"):
        _demo_password()


def test_demo_seed_uses_configured_password(monkeypatch):
    monkeypatch.setenv("DEMO_PASSWORD", "provided-password")

    assert _demo_password() == "provided-password"
