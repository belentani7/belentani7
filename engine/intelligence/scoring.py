from __future__ import annotations


def score_page(data: dict, objective: str = '') -> dict:
    checks = {
        'content': min(10, round(data.get('word_count', 0) / 100)),
        'seo': sum(bool(data.get(k)) for k in ('title', 'description', 'headings')) + (1 if data.get('language') else 0),
        'structured_data': min(10, len(data.get('json_ld', [])) * 2),
        'technology': min(10, len(data.get('technologies', [])) * 2),
        'navigation': min(10, len(data.get('links', [])) // 10),
    }
    total = round(sum(checks.values()) / len(checks), 2)
    opportunities = []
    if not data.get('title'): opportunities.append({'type': 'seo', 'message': 'No se detectó título HTML', 'evidence': data['evidence']})
    if not data.get('description'): opportunities.append({'type': 'seo', 'message': 'No se detectó meta description', 'evidence': data['evidence']})
    if not data.get('json_ld'): opportunities.append({'type': 'structured_data', 'message': 'No se detectó JSON-LD', 'evidence': data['evidence']})
    if data.get('word_count', 0) < 100: opportunities.append({'type': 'content', 'message': 'Contenido textual escaso', 'evidence': data['evidence']})
    return {'scores': checks, 'overall': total, 'opportunities': opportunities, 'objective': objective, 'evidence': data['evidence']}
