/* Isla React 19 sin compilación: solo si el CDN cargó. */
(function () {
  if (!window.React || !window.ReactDOM || !window.DATA) {
    var f = document.getElementById('fallback');
    if (f) f.innerHTML = 'React no está disponible ahora mismo. Usa el ' +
      '<a href="productos.html">catálogo estático</a>.';
    return;
  }
  var e = React.createElement;
  var useState = React.useState;

  function Chip(props) {
    return e('span', { className: 'chip' }, props.children);
  }

  function Item(props) {
    var r = props.repo;
    return e('article', { className: 'prod' },
      e('h3', null, r.label || r.name),
      e('p', { className: 'desc' }, r.description || r.tagline || 'Producto del ecosistema.'),
      e('p', { className: 'prod__row' },
        e('span', null, r.category),
        e('span', null, (r.stack || []).join(' · ')),
        e('span', { className: 'prod__score' }, r.pct + '% ', e('span', null, 'cumple'))
      )
    );
  }

  function Catalogo() {
    var st = useState('all');
    var cat = st[0], setCat = st[1];
    var all = window.DATA.repos;
    var cats = ['all'].concat(all.map(function (r) { return r.category; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var shown = cat === 'all' ? all : all.filter(function (r) { return r.category === cat; });
    return e('div', null,
      e('div', { className: 'filters', role: 'group', 'aria-label': 'Filtrar por categoría' },
        cats.map(function (c) {
          var n = c === 'all' ? all.length : all.filter(function (r) { return r.category === c; }).length;
          return e('button', {
            key: c, 'aria-pressed': String(cat === c),
            onClick: function () { setCat(c); }
          }, (c === 'all' ? 'Todas' : c) + ' · ' + n);
        })
      ),
      e('div', { className: 'grid' }, shown.map(function (r) {
        return e(Item, { key: r.name + r.path, repo: r });
      }))
    );
  }

  ReactDOM.createRoot(document.getElementById('app')).render(e(Catalogo));
})();
