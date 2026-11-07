from pathlib import Path

text = Path(__file__).parents[1].joinpath('docker-compose.yml').read_text()
for required in ('8080:8080', 'BELLENTANI_DB: /app/data/bellentani.db', 'BELLENTANI_ARTIFACTS: /app/data/artifacts', 'healthcheck:', 'CMD'):
    assert required in text, required
print('distribution-config-ok')
