import pytest

from app.core.domain import DomainError
from app.modules.identity.domain.value_objects import Email


@pytest.mark.parametrize("value", ["buyer@example.com", "a@b.c"])
def test_email_accepts_basic_addresses(value):
    assert Email(value).value == value


@pytest.mark.parametrize(
    "value", ["missing-at", "a@@example.com", "a@b", "a@b.", "a@b.c.", "a@b c.com", "a@b.com\n"],
)
def test_email_rejects_malformed_addresses(value):
    with pytest.raises(DomainError, match="E-mail inválido"):
        Email(value)
