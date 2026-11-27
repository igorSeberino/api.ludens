from dataclasses import dataclass

from app.core.domain import DomainError

@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self) -> None:
        local, separator, domain = self.value.partition("@")
        dot_index = domain.find(".")
        if (
            not separator
            or not local
            or not domain
            or "@" in domain
            or any(character.isspace() for character in self.value)
            or dot_index < 1
            or dot_index >= len(domain) - 1
            or domain.endswith(".")
        ):
            raise DomainError("E-mail inválido.")
