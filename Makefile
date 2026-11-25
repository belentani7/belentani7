# repo-forge:tareas
PYTHON ?= python3
NODE ?= node
.PHONY: help doctor test test-node test-python audit serve verify check all

help:
	@echo "Objetivos disponibles:"
	@echo "  make doctor      Estructura y reglas del repositorio (solo lectura)"
	@echo "  make test-node   Tests de las herramientas de navegador (docs/living-machine)"
	@echo "  make test-python Suites de contratos en tests/ (unittest, sin dependencias)"
	@echo "  make test        Ambos conjuntos de tests"
	@echo "  make audit       Auditoría de accesibilidad, SEO, higiene y peso"
	@echo "  make serve       Sirve docs/ en http://0.0.0.0:4173"
	@echo "  make verify      Lint + tipado + tests + build del playground (requiere npm ci)"
	@echo "  make check       doctor + test + audit (puerta mínima, sin dependencias)"

doctor:
	$(PYTHON) scripts/doctor.py

test-node:
	$(NODE) --test docs/living-machine/*.test.cjs

test-python:
	$(PYTHON) -m unittest discover -s tests -p 'test_*.py' -v

test: test-node test-python

audit:
	$(PYTHON) scripts/audit_site.py --include-root

serve:
	$(PYTHON) scripts/serve_docs.py --port 4173

verify:
	npm run verify

check: doctor test audit

all: check
