"""Generate local SVG illustrations; the application does not need Python at runtime."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / 'public' / 'art'
DEFS = '''<defs>
<linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6d876b"/><stop offset=".45" stop-color="#3e614a"/><stop offset="1" stop-color="#233e30"/></linearGradient>
<linearGradient id="cream" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#f1ead8"/><stop offset=".55" stop-color="#ded2b6"/><stop offset="1" stop-color="#baa98a"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#d5b48d"/><stop offset=".6" stop-color="#bd946a"/><stop offset="1" stop-color="#a77b50"/></linearGradient>
<filter id="shadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="1" dy="14" stdDeviation="10" flood-color="#263a22" flood-opacity=".18"/></filter>
</defs>'''
SHAPES = {
    'audio': '''<path d="M115 178v-43a85 85 0 0 1 170 0v43" fill="none" stroke="#203e34" stroke-width="25"/><path d="M117 140a83 83 0 0 1 166 0" fill="none" stroke="#486657" stroke-width="10"/><rect x="91" y="153" width="52" height="100" rx="23" fill="url(#green)" transform="rotate(-9 117 203)"/><rect x="257" y="153" width="52" height="100" rx="23" fill="url(#green)" transform="rotate(9 283 203)"/><rect x="104" y="164" width="22" height="76" rx="10" fill="#19382e" transform="rotate(-9 117 203)"/><rect x="274" y="164" width="22" height="76" rx="10" fill="#19382e" transform="rotate(9 283 203)"/><path d="M145 88q50-47 105 0" fill="none" stroke="#77907b" stroke-width="3"/>''',
    'speaker': '''<rect x="113" y="78" width="174" height="202" rx="40" fill="url(#green)"/><rect x="124" y="89" width="152" height="181" rx="32" fill="#586e58"/><path d="M134 115h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130m-130 10h130" stroke="#263f30" stroke-width="3" opacity=".55"/><rect x="179" y="90" width="42" height="10" rx="5" fill="#d6c9a7"/><text x="200" y="260" text-anchor="middle" font-size="9" fill="#e4e6cf" font-family="Arial" letter-spacing="3">MORROW</text>''',
    'earbuds': '''<rect x="105" y="168" width="190" height="107" rx="40" fill="url(#cream)"/><path d="M108 202h184" stroke="#c5bda6" stroke-width="2"/><circle cx="200" cy="244" r="4" fill="#668362"/><g fill="#ddd8c7" stroke="#c1b9a2"><rect x="137" y="81" width="23" height="100" rx="11" transform="rotate(-22 148 130)"/><ellipse cx="139" cy="91" rx="27" ry="22" transform="rotate(-22 139 91)"/><rect x="237" y="81" width="23" height="100" rx="11" transform="rotate(22 248 130)"/><ellipse cx="256" cy="91" rx="27" ry="22" transform="rotate(22 256 91)"/></g>''',
    'record': '''<path d="M76 120h248v139H76z" fill="url(#wood)"/><path d="M76 120l35-33h248l-35 33" fill="#d6b78a"/><circle cx="181" cy="186" r="61" fill="#28332b"/><circle cx="181" cy="186" r="47" fill="none" stroke="#4d564a" stroke-width="10"/><circle cx="181" cy="186" r="17" fill="#d4bf8d"/><circle cx="181" cy="186" r="4" fill="#52604d"/><path d="M281 137l-3 55-35 25" stroke="#bfc3af" fill="none" stroke-width="8"/><circle cx="282" cy="138" r="11" fill="#485242"/><path d="M90 259v11m220-11v11" stroke="#4a3a2f" stroke-width="10"/>''',
    'radio': '''<rect x="83" y="120" width="234" height="142" rx="22" fill="url(#wood)"/><rect x="97" y="133" width="207" height="116" rx="13" fill="#9d8865"/><circle cx="161" cy="190" r="46" fill="#3e493b"/><circle cx="161" cy="190" r="34" fill="none" stroke="#7c876c" stroke-width="15"/><rect x="228" y="151" width="56" height="15" rx="4" fill="#d8d6bd"/><circle cx="256" cy="203" r="20" fill="#d9c79d"/><path d="M126 118V96h150v22" fill="none" stroke="#403f31" stroke-width="8"/><path d="M283 117l28-61" stroke="#8c9583" stroke-width="5"/>''',
    'microphone': '''<rect x="164" y="61" width="72" height="145" rx="36" fill="url(#green)"/><path d="M151 149v24a49 49 0 0 0 98 0v-24M200 222v50" fill="none" stroke="#253f34" stroke-width="10"/><ellipse cx="200" cy="282" rx="58" ry="13" fill="#304c3a"/><path d="M179 85h43m-47 13h50m-52 13h54m-54 13h54m-54 13h54m-52 13h50" stroke="#8b9f84" stroke-width="3"/>''',
    'home': '''<path d="M250 142h22a45 45 0 0 1 0 90h-22" fill="none" stroke="#b1a385" stroke-width="20"/><path d="M111 129h145l-8 114q-4 31-64 31t-64-31z" fill="url(#cream)"/><ellipse cx="183" cy="129" rx="73" ry="22" fill="#c7b99c"/><ellipse cx="183" cy="129" rx="62" ry="15" fill="#735641"/><path d="M147 161v70q0 17 20 21" stroke="#f3eee0" stroke-width="7" opacity=".75" fill="none"/>''',
    'vase': '''<path d="M167 76h66l-4 55q2 21 28 51c40 52 18 103-57 103s-97-51-57-103q26-30 28-51z" fill="url(#cream)"/><ellipse cx="200" cy="76" rx="33" ry="9" fill="#b0a48b"/><path d="M180 67q-15-55 25-92M206 67q33-38 57-41" fill="none" stroke="#7d8f66" stroke-width="5"/><ellipse cx="192" cy="14" rx="27" ry="9" fill="#8fa171" transform="rotate(35 192 14)"/><ellipse cx="245" cy="34" rx="29" ry="9" fill="#7f9564" transform="rotate(-27 245 34)"/>''',
    'bowl': '''<ellipse cx="200" cy="180" rx="117" ry="37" fill="#c4b393"/><path d="M83 180q5 96 117 96t117-96q-117 58-234 0" fill="url(#cream)"/><ellipse cx="200" cy="178" rx="105" ry="29" fill="#e7dfc9"/><ellipse cx="200" cy="186" rx="82" ry="18" fill="#d2c6ab"/>''',
    'candle': '''<rect x="129" y="126" width="142" height="153" rx="15" fill="url(#cream)"/><ellipse cx="200" cy="127" rx="71" ry="20" fill="#eee7d7"/><ellipse cx="200" cy="127" rx="61" ry="13" fill="#d3c7ac"/><rect x="153" y="170" width="94" height="67" fill="#f6f1e5"/><text x="200" y="194" font-size="12" text-anchor="middle" font-family="Georgia" fill="#4a5f42">morrow</text><text x="200" y="214" font-size="7" text-anchor="middle" font-family="Arial" letter-spacing="2" fill="#788366">SLOW SUNDAY</text><path d="M200 126v-16" stroke="#5d4e34" stroke-width="3"/><path d="M200 110q-18-23 0-39 17 21 0 39" fill="#d5ae51"/>''',
    'blanket': '''<path d="M103 106l182-20 29 172-190 27z" fill="url(#wood)"/><path d="M103 106l93 40-10 133-62 6z" fill="#c9a882"/><path d="M134 116l23 162m11-148l14 147m21-175l25 169m11-173l26 169m10-174l27 169" stroke="#e7cba8" stroke-width="3"/><path d="M126 284v13m15-15v14m16-16v13m16-15v13m16-16v13m16-15v13m16-16v13m16-15v13m16-16v13m16-15v13m16-16v13m16-15v13" stroke="#bc9165" stroke-width="4"/>''',
    'clock': '''<circle cx="200" cy="170" r="107" fill="url(#wood)"/><circle cx="200" cy="170" r="92" fill="#eee9d9"/><path d="M200 89v10m0 142v10m-81-81h10m142 0h10" stroke="#8b9176" stroke-width="4"/><path d="M200 118v52l42 29" fill="none" stroke="#3d5841" stroke-linecap="round" stroke-width="6"/><circle cx="200" cy="170" r="8" fill="#344e39"/>''',
    'everyday': '''<path d="M113 132h174l23 145q-111 29-220 0z" fill="url(#wood)"/><path d="M151 151V92a49 49 0 0 1 98 0v59" fill="none" stroke="#9c7149" stroke-width="16"/><path d="M151 148V93a49 49 0 0 1 98 0v55" fill="none" stroke="#c8a078" stroke-width="9"/><path d="M116 147l-9 118m177-118l10 118" stroke="#e5c6a0" stroke-width="3"/><rect x="161" y="207" width="78" height="38" rx="3" fill="#ded0ab"/><text x="200" y="231" text-anchor="middle" font-size="12" fill="#647453" font-family="Georgia">morrow</text>''',
    'bottle': '''<rect x="165" y="57" width="70" height="34" rx="10" fill="#2b4938"/><path d="M163 88h74l15 27v149q0 22-52 22t-52-22V115z" fill="url(#green)"/><path d="M168 115v139" stroke="#849879" stroke-width="7" opacity=".5"/><text x="200" y="205" font-size="12" text-anchor="middle" fill="#d4d6b9" font-family="Georgia">morrow</text>''',
    'notebook': '''<path d="M100 87l169-22 35 206-169 23z" fill="#294e39"/><path d="M113 89l148-20 34 198-149 22z" fill="url(#green)"/><path d="M132 290l164-23-5-8-163 23" fill="#dfd9bd"/><path d="M250 84l31 180" stroke="#b2b596" stroke-width="4"/><text x="192" y="172" text-anchor="middle" fill="#d8d5ad" font-size="13" font-family="Georgia" transform="rotate(-8 192 172)">a little thought.</text>''',
    'sunglasses': '''<path d="M83 159l-18-52h35l57 38m162 14l18-52h-35l-57 38" stroke="#9a7955" stroke-width="12" fill="none"/><path d="M73 160q6-23 88-12l16 15q21-10 45 0l16-15q82-11 89 12l-8 68q-14 36-73 6l-23-48h-46l-23 48q-59 30-73-6z" fill="#84613f"/><path d="M89 169q30-11 66-3l-17 48q-32 18-44 0zm156-3q36-8 66 3l-5 45q-12 18-44 0z" fill="#3b4c3d"/>''',
    'pouch': '''<path d="M105 135q95-22 190 0l14 117q-109 37-218 0z" fill="url(#wood)"/><path d="M106 135q94-18 188 0" stroke="#5e6347" stroke-width="7" fill="none"/><path d="M112 151q87-17 176 0" stroke="#e0c097" stroke-width="2" fill="none"/><rect x="157" y="189" width="85" height="32" rx="3" fill="#ddd0ad"/><text x="200" y="209" text-anchor="middle" font-size="11" fill="#657052" font-family="Georgia">little things</text>''',
    'umbrella': '''<path d="M200 76v181q0 31 25 31t25-27" fill="none" stroke="#7b6c50" stroke-width="9"/><path d="M70 170a130 105 0 0 1 260 0q-32-22-65 0-32-22-65 0-32-22-65 0-32-22-65 0" fill="url(#green)"/><path d="M200 65q-50 30-65 105m65-105q50 30 65 105m-65-105v105" fill="none" stroke="#839272" stroke-width="3"/>''',
    'workspace': '''<ellipse cx="207" cy="280" rx="81" ry="14" fill="#3b5741"/><path d="M208 274V167l-38-58" stroke="#38513b" stroke-width="13" fill="none"/><circle cx="171" cy="109" r="12" fill="#6e8361"/><path d="M114 142l44-78q73-17 116 54z" fill="url(#green)"/><ellipse cx="195" cy="130" rx="83" ry="18" fill="#d7d3af" transform="rotate(-8 195 130)"/>''',
    'stand': '''<path d="M112 183l157-29 48 104-156 27z" fill="#8d9885"/><path d="M161 281l22-93 32-6-23 91z" fill="#b2bba5"/><path d="M84 75l197-33 29 147-198 34z" fill="#294735"/><path d="M97 86l174-30 25 119-174 30z" fill="#9ba99a"/><path d="M111 94l151-26 20 94-150 26z" fill="#c9d3bd"/><path d="M122 211l188-33 18 12-198 35z" fill="#bec8b0"/>''',
    'organizer': '''<path d="M87 179l199-33 30 105-200 33z" fill="url(#wood)"/><path d="M87 179l44-28 200-33-45 28" fill="#e2c09a"/><path d="M286 146l45-28 30 105-45 28" fill="#a47952"/><path d="M138 198l113-19 12 49-113 19z" fill="#c9a17b"/><path d="M156 161l-16-102m44 98l-8-104m37 98l12-104" stroke="#536a4d" stroke-width="11"/><path d="M140 59l-2-18 8 17m30-5l4-19 2 18m43-5l8-18-2 20" fill="#ceb58b"/>''',
    'mouse': '''<path d="M133 141q0-65 67-65t67 65v73q0 69-67 69t-67-69z" fill="url(#cream)"/><path d="M200 78v82m-64 7h128" stroke="#b5b59c" stroke-width="2"/><rect x="192" y="109" width="16" height="32" rx="7" fill="#78846d"/><path d="M147 173v35q0 45 24 50" fill="none" stroke="#f2eddc" stroke-width="6"/>''',
    'mat': '''<path d="M64 144l227-43 59 130-228 48z" fill="#3b5b42"/><path d="M70 143l220-39 54 121-220 47z" fill="#6f8567"/><path d="M79 146l205-36 50 112-205 42z" fill="none" stroke="#9eae88" stroke-width="2" stroke-dasharray="3 3"/>''',
}
SHAPES['keyboard'] = '''<path d="M61 138l241-35 39 120-249 38z" fill="#b6b9a2"/><path d="M61 132l241-35 39 117-249 38z" fill="url(#cream)"/>''' + ''.join(
    f'<rect x="{86 + column * 26 + row * 7}" y="{143 + row * 25 - column * 3.7}" '
    'width="21" height="17" rx="3" fill="#f6f3e8"/>'
    for row in range(3) for column in range(8)
) + '<path d="M142 223l132-20" stroke="#f5f0df" stroke-width="14"/>'


def generate():
    ROOT.mkdir(parents=True, exist_ok=True)
    for name, shape in SHAPES.items():
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 340">{DEFS}'
        svg += '<ellipse cx="200" cy="287" rx="95" ry="11" fill="#1f3227" opacity=".07"/>'
        svg += f'<g filter="url(#shadow)">{shape}</g></svg>'
        (ROOT / f'{name}.svg').write_text(svg, encoding='utf-8')
    hero = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 590">{DEFS}
    <ellipse cx="340" cy="493" rx="232" ry="25" fill="#6b7452" opacity=".12"/>
    <path d="M80 414l390-45 144 121-386 45z" fill="#dedcc8"/>
    <path d="M228 535l386-45v18l-386 45z" fill="#d0cdb5"/>
    <g transform="translate(278 56) rotate(7 200 200) scale(.94)" filter="url(#shadow)">{SHAPES['everyday']}</g>
    <g transform="translate(37 81) rotate(-15 200 200) scale(1.08)" filter="url(#shadow)">{SHAPES['audio']}</g>
    <g transform="translate(177 261) scale(.78)" filter="url(#shadow)">{SHAPES['home']}</g>
    <circle cx="102" cy="192" r="4" fill="#b3bd97"/>
    <path d="M545 383h20m-10-10v20M123 368h16m-8-8v16" stroke="#a3b38c" stroke-width="2"/>
    </svg>'''
    (ROOT / 'hero.svg').write_text(hero, encoding='utf-8')
    (ROOT / 'mark.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#2f5542"/><text x="20" y="29" fill="#faf9f6" text-anchor="middle" font-family="Georgia" font-size="32">m</text></svg>''', encoding='utf-8')
    print(f'Generated {len(SHAPES) + 2} local SVG assets.')


if __name__ == '__main__':
    generate()
