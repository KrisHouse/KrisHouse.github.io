/* =========================================================================
   THE CHOSEN LAND — map engine (plain JS; expects global d3 + topojson)
   buildGeometry()  -> projects & merges empires once, returns baked paths
   createMap(...)   -> renders one themed, interactive SVG map into a host
   openModal(...)   -> shared themed detail card
   ========================================================================= */
(function () {
  const SVGNS = "http://www.w3.org/2000/svg";
  const VB_W = 1000, VB_H = 860;
  // Label anchors that fall off-frame (huge nations) get a manual override.
  const LABEL_OVERRIDE = { "Rus Federation": [752, 232] };

  function biggestPoly(geom) {
    if (geom.type === "Polygon") return geom;
    let best = null, ba = -1;
    geom.coordinates.forEach(c => {
      const a = d3.geoArea({ type: "Feature", geometry: { type: "Polygon", coordinates: c } });
      if (a > ba) { ba = a; best = c; }
    });
    return { type: "Polygon", coordinates: best };
  }

  async function buildGeometry() {
    const W = window.WORLD;
    const topo = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json");
    const byName = {};
    topo.objects.countries.geometries.forEach(g => { byName[g.properties.name] = g; });

    const features = Object.entries(W.EMPIRES).map(([name, info]) => {
      const gs = info.members.map(n => byName[n]).filter(Boolean);
      return { type: "Feature", properties: { name }, geometry: topojson.merge(topo, gs) };
    });

    const proj = d3.geoAzimuthalEqualArea().rotate([-10, -52]);
    const fitFC = {
      type: "FeatureCollection",
      features: features.filter(f => f.properties.name !== "Rus Federation")
        .map(f => ({ type: "Feature", geometry: biggestPoly(f.geometry) }))
    };
    proj.fitExtent([[24, 24], [VB_W - 24, VB_H - 24]], fitFC);
    const path = d3.geoPath(proj);
    const round = d => d.replace(/-?\d+\.\d+/g, m => Math.round(parseFloat(m)).toString());

    const paths = {}, labels = {};
    features.forEach(f => {
      const nm = f.properties.name;
      paths[nm] = round(path(f));
      if (LABEL_OVERRIDE[nm]) { labels[nm] = LABEL_OVERRIDE[nm]; }
      else {
        const c = path.centroid({ type: "Feature", geometry: biggestPoly(f.geometry) });
        labels[nm] = [Math.round(c[0]), Math.round(c[1])];
      }
    });
    return { paths, labels, vbW: VB_W, vbH: VB_H };
  }

  // ---- shared modal -------------------------------------------------------
  let modalRoot = null;
  function ensureModalRoot() {
    if (modalRoot) return modalRoot;
    modalRoot = document.createElement("div");
    modalRoot.className = "cl-modal-overlay";
    modalRoot.style.opacity = "0";
    modalRoot.style.pointerEvents = "none";
    modalRoot.innerHTML = '<div class="cl-modal" role="dialog" aria-modal="true"></div>';
    modalRoot.addEventListener("click", e => { if (e.target === modalRoot) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
    document.body.appendChild(modalRoot);
    return modalRoot;
  }
  let onModalClose = null;
  function closeModal() {
    if (!modalRoot) return;
    modalRoot.classList.remove("open");
    modalRoot.style.opacity = "0";
    modalRoot.style.pointerEvents = "none";
    if (onModalClose) { onModalClose(); onModalClose = null; }
  }
  function blocOf(id) { return window.WORLD.BLOCS.find(b => b.id === id); }

  function openModal(empireName, theme, afterClose) {
    const W = window.WORLD;
    const e = W.EMPIRES[empireName];
    const bloc = blocOf(e.bloc);
    const root = ensureModalRoot();
    const v = theme.vars, col = theme.blocColor[e.bloc];
    const card = root.querySelector(".cl-modal");
    card.setAttribute("data-texture", theme.texture);
    card.style.setProperty("--panel", v.panel);
    card.style.setProperty("--panelInk", v.panelInk);
    card.style.setProperty("--accent", col);
    card.style.setProperty("--border", v.border);
    card.style.fontFamily = theme.font;
    card.innerHTML = `
      <button class="cl-x" aria-label="Close">&times;</button>
      <div class="cl-modal-band" style="background:${col}"></div>
      <div class="cl-modal-body">
        <h2 class="cl-emp">${empireName}</h2>
        <div class="cl-cap">Leadership &mdash; <strong>${e.seat || e.capital}</strong></div>
        <p class="cl-blurb">${e.blurb}</p>
        <h3>Notable Cities / Landmarks</h3>
        <ul class="cl-cities">${e.cities.map(c => `<li${c===e.capital?' class="cap"':''}>${c}${c===e.capital?' <em>· capital</em>':''}</li>`).join("")}</ul>
      </div>`;
    card.querySelector(".cl-x").onclick = closeModal;
    onModalClose = afterClose || null;
    root.classList.add("open");
    root.style.opacity = "1";
    root.style.pointerEvents = "auto";
  }

  // ---- one interactive map ------------------------------------------------
  function createMap(host, theme, geom, opts) {
    const showLegend = !opts || opts.legend !== false;
    const W = window.WORLD, v = theme.vars;
    const wrap = document.createElement("div");
    wrap.className = "cl-map";
    wrap.setAttribute("data-texture", theme.texture);
    Object.entries(v).forEach(([k, val]) => wrap.style.setProperty("--" + k, val));
    wrap.style.setProperty("--font", theme.font);
    wrap.style.setProperty("--labelScale", theme.label.scale);

    const uid = "clip-" + theme.id;
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${geom.vbW} ${geom.vbH}`);
    svg.setAttribute("class", "cl-svg");
    svg.innerHTML = `<defs>
      <clipPath id="${uid}"><rect x="0" y="0" width="${geom.vbW}" height="${geom.vbH}"/></clipPath>
      <pattern id="hatch-${theme.id}" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="7" stroke="${v.seaEdge}" stroke-width="0.8" opacity="0.6"/>
      </pattern>
    </defs>`;

    // sea
    const sea = document.createElementNS(SVGNS, "rect");
    sea.setAttribute("x", 0); sea.setAttribute("y", 0);
    sea.setAttribute("width", geom.vbW); sea.setAttribute("height", geom.vbH);
    sea.setAttribute("class", "cl-sea");
    svg.appendChild(sea);
    if (theme.texture === "engrave") {
      const hatch = document.createElementNS(SVGNS, "rect");
      hatch.setAttribute("x", 0); hatch.setAttribute("y", 0);
      hatch.setAttribute("width", geom.vbW); hatch.setAttribute("height", geom.vbH);
      hatch.setAttribute("fill", `url(#hatch-${theme.id})`);
      svg.appendChild(hatch);
    }

    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("clip-path", `url(#${uid})`);
    svg.appendChild(g);

    const labelG = document.createElementNS(SVGNS, "g");
    labelG.setAttribute("class", "cl-labels");

    const tip = document.createElement("div");
    tip.className = "cl-tip";
    wrap.appendChild(svg);
    wrap.appendChild(tip);

    const pathEls = {};
    const baseW = parseFloat(v.borderW) || 1;
    let selected = null;
    function restingStyle(p) {
      if (p === selected) { p.style.stroke = v.select; p.style.strokeWidth = (baseW * 2.8) + "px"; }
      else { p.style.stroke = ""; p.style.strokeWidth = ""; }
      p.style.filter = "";
    }
    function front(p) { g.insertBefore(p, labelG); } // raise but keep labels on top
    Object.keys(W.EMPIRES).forEach(name => {
      const info = W.EMPIRES[name];
      const isUnrevealed = !!info.unrevealed;
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("d", geom.paths[name]);
      p.setAttribute("class", "cl-emp");
      p.setAttribute("fill", isUnrevealed ? theme.unrevealedColor : theme.blocColor[info.bloc]);
      p.dataset.empire = name;
      p.dataset.bloc = info.bloc;
      if (isUnrevealed) p.style.cursor = "default";
      g.appendChild(p);
      pathEls[name] = p;

      const [lx, ly] = geom.labels[name];
      const t = document.createElementNS(SVGNS, "text");
      t.setAttribute("x", lx); t.setAttribute("y", ly);
      t.setAttribute("class", "cl-label");
      t.style.setProperty("fill", v.ink);
      t.style.setProperty("stroke", v.inkHalo);
      t.style.setProperty("stroke-width", "2px");
      t.style.setProperty("paint-order", "stroke");
      t.style.fontFamily = theme.font;
      t.style.textTransform = theme.label.transform;
      t.style.letterSpacing = theme.label.spacing;
      t.style.fontWeight = theme.label.weight;
      t.style.opacity = "0";
      t.textContent = name;
      labelG.appendChild(t);

      if (isUnrevealed) return;

      p.addEventListener("mousemove", ev => {
        const r = wrap.getBoundingClientRect();
        tip.style.left = (ev.clientX - r.left) + "px";
        tip.style.top = (ev.clientY - r.top) + "px";
      });
      p.addEventListener("mouseenter", () => {
        wrap.classList.add("hovering");
        p.style.stroke = v.hover;
        p.style.strokeWidth = (baseW * 2.6) + "px";
        p.style.filter = "brightness(1.08) saturate(1.07)";
        front(p);
        tip.textContent = name;
        tip.classList.add("show");
      });
      p.addEventListener("mouseleave", () => {
        wrap.classList.remove("hovering");
        restingStyle(p);
        tip.classList.remove("show");
      });
      p.addEventListener("click", () => {
        const prev = selected;
        selected = p;
        if (prev && prev !== p) restingStyle(prev);
        front(p);
        p.style.stroke = v.select;
        p.style.strokeWidth = (baseW * 2.8) + "px";
        p.style.filter = "";
        tip.classList.remove("show");
        openModal(name, theme, () => { if (selected === p) selected = null; restingStyle(p); });
      });
    });
    g.appendChild(labelG); // labels above fills, inside clip

    // ---- chrome: title strip, legend, label toggle ----
    const chrome = document.createElement("div");
    chrome.className = "cl-chrome";
    chrome.innerHTML = `
      <button class="cl-toggle" aria-pressed="false">Show names</button>
      ${showLegend ? '<div class="cl-legend"></div>' : ''}`;
    wrap.appendChild(chrome);

    if (showLegend) {
      const legend = chrome.querySelector(".cl-legend");
      W.BLOCS.forEach(b => {
        const item = document.createElement("button");
        item.className = "cl-leg-item";
        item.innerHTML = `<span class="cl-sw" style="background:${theme.blocColor[b.id]}"></span><span class="cl-leg-name">${b.short}</span>`;
        item.addEventListener("mouseenter", () => {
          wrap.classList.add("focusing");
          Object.values(pathEls).forEach(el => {
            if (el.dataset.bloc !== b.id) el.setAttribute("fill-opacity", "0.22");
            else el.removeAttribute("fill-opacity");
          });
        });
        item.addEventListener("mouseleave", () => {
          wrap.classList.remove("focusing");
          Object.values(pathEls).forEach(el => el.removeAttribute("fill-opacity"));
        });
        legend.appendChild(item);
      });
    }

    const toggle = chrome.querySelector(".cl-toggle");
    toggle.addEventListener("click", () => {
      const on = wrap.classList.toggle("labels-on");
      toggle.setAttribute("aria-pressed", on ? "true" : "false");
      toggle.textContent = on ? "Hide names" : "Show names";
      labelG.querySelectorAll(".cl-label").forEach(l => { l.style.opacity = on ? "1" : "0"; });
    });

    host.appendChild(wrap);
    return wrap;
  }

  window.CL = { buildGeometry, createMap, openModal };
})();
