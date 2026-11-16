/* Contenido: edita solo este arreglo. Tipos: ascii h1 h2 h3 p ul quote code */
const BLOCKS = [
 {t:'ascii', x:`   ▄███████▄    ▄████████    ▄███████▄  ▄█     ▄████████  ▄██████▄  
  ███    ███   ███    ███   ███    ███ ███    ███    ███ ███    ███ 
  ███    ███   ███    ███   ███    ███ ███▌   ███    ███ ███    ███ 
  ███    ███   ███    ███   ███    ███ ███▌  ▄███▄▄▄▄██▀ ███    ███ 
▀█████████▀  ▀███████████ ▀█████████▀  ███▌ ▀▀███▀▀▀▀▀   ███    ███ 
  ███          ███    ███   ███        ███  ▀███████████ ███    ███ 
  ███          ███    ███   ███        ███    ███    ███ ███    ███ 
 ▄████▀        ███    █▀   ▄████▀      █▀     ███    ███  ▀██████▀  
                                              ███    ███`},
 {t:'h1', x:'Papiro'},
 {t:'p', x:'Editor y lector de Markdown para la terminal. Hecho en Rust, sin marco y sin pantalla de bienvenida: se ve como tu terminal.'},
 {t:'quote', x:'Versión 0.1.2 publicada en crates.io. Pulsa **Ctrl+V** para ver esta página como Markdown puro, igual que Papiro.'},

 {t:'h2', x:'Antes de empezar'},
 {t:'ul', x:['Una terminal (probado en kitty)','Rust 1.88 o superior','Git (solo si compilas desde el código fuente)']},

 {t:'h2', x:'Instalación paso a paso'},
 {t:'h3', x:'1. Instala Rust'},
 {t:'code', l:'bash', x:"curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"},
 {t:'p', x:'Comprueba que quedó instalado:'},
 {t:'code', l:'bash', x:'rustc --version'},
 {t:'h3', x:'2. Instala Papiro'},
 {t:'p', x:'La forma más rápida, desde crates.io:'},
 {t:'code', l:'bash', x:'cargo install ppr'},
 {t:'p', x:'También puedes compilarlo desde el código fuente:'},
 {t:'code', l:'bash', x:'git clone https://github.com/Ricardo-Castro-Gastelum/papiro.git\ncd papiro\ncargo build --release\ncp target/release/ppr ~/.local/bin/ppr'},
 {t:'p', x:'Si copias el binario manualmente, asegúrate de que `~/.local/bin` esté en tu `PATH`.'},
 {t:'h3', x:'3. Abre un archivo'},
 {t:'code', l:'bash', x:'ppr apuntes.md'},
 {t:'p', x:'Si el archivo no existe, se crea al guardar. Si abres Papiro sin nombre, te lo pide al guardar. Para ver la ayuda: `ppr --help`.'},

 {t:'h2', x:'Atajos'},
 {t:'ul', x:['`Ctrl+S` guardar','`Ctrl+V` alternar entre Fuente y Vista','`Esc` volver a Fuente desde Vista','`Ctrl+Q` salir (pide confirmación si hay cambios sin guardar)','`Ctrl+Z` deshacer · `Ctrl+Y` rehacer','`Ctrl+F` buscar · `F3` siguiente · `Shift+F3` anterior','`Ctrl+←` y `Ctrl+→` moverse por palabras','`Tab` insertar dos espacios']},

 {t:'h2', x:'Dos modos'},
 {t:'p', x:'**Fuente** muestra el Markdown tal cual: `#`, `---`, `**`. **Vista** lo muestra limpio, con títulos, listas, tablas y bloques de código. Es lo que está haciendo esta página ahora mismo.'},

 {t:'h2', x:'Estado del proyecto'},
 {t:'ul', x:['Publicado en crates.io como `ppr` (versión 0.1.2)','Listo: edición, guardado seguro, vista renderizada, deshacer/rehacer, ajuste de línea y búsqueda','Licencia dual MIT o Apache 2.0','Repositorio: github.com/Ricardo-Castro-Gastelum/papiro']}
];

const $ = s => document.querySelector(s);
const doc = $('#doc');
let mode = 'v';
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inlineV = s => esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const inlineS = s => esc(s).replace(/(`[^`]+`)/g,'<span class="mk">$1</span>').replace(/(\*\*)([^*]+)(\*\*)/g,'<span class="mk">$1</span>$2<span class="mk">$3</span>');

function view(){
  return BLOCKS.map(b=>{
    switch(b.t){
      case 'ascii': return `<pre class="ascii" role="img" aria-label="Papiro">${esc(b.x)}</pre>`;
      case 'h1': return `<h1>${inlineV(b.x)}</h1>`;
      case 'h2': return `<h2>${inlineV(b.x)}</h2>`;
      case 'h3': return `<h3>${inlineV(b.x)}</h3>`;
      case 'p': return `<p>${inlineV(b.x)}</p>`;
      case 'quote': return `<blockquote>${inlineV(b.x)}</blockquote>`;
      case 'ul': return `<ul>${b.x.map(i=>`<li>${inlineV(i)}</li>`).join('')}</ul>`;
      case 'code': return `<div class="cb"><pre><code>${esc(b.x)}</code></pre><button type="button" data-copy>Copiar</button></div>`;
    }
  }).join('');
}
function source(){
  const L = (h,c='') => `<span class="ln ${c}">${h}</span>`;
  const out = [];
  BLOCKS.forEach((b,i)=>{
    const sp = i ? L('') : '';
    switch(b.t){
      case 'ascii': out.push(`<pre class="ascii" role="img" aria-label="Papiro">${esc(b.x)}</pre>`); break;
      case 'h1': out.push(L(`<span class="mk"># </span>${inlineS(b.x)}`)); break;
      case 'h2': out.push(sp, L(`<span class="mk">## </span>${inlineS(b.x)}`)); break;
      case 'h3': out.push(sp, L(`<span class="mk">### </span>${inlineS(b.x)}`)); break;
      case 'p': out.push(sp, L(inlineS(b.x))); break;
      case 'quote': out.push(sp, L(`<span class="mk">&gt; </span>${inlineS(b.x)}`)); break;
      case 'ul': out.push(sp, ...b.x.map(t=>L(`<span class="mk">- </span>${inlineS(t)}`))); break;
      case 'code': out.push(sp, L(`<span class="mk">\`\`\`${b.l||''}</span>`), ...b.x.split('\n').map(t=>L(esc(t))), L('<span class="mk">```</span>')); break;
    }
  });
  return out.join('');
}
function render(){
  doc.className = 'doc ' + mode;
  doc.innerHTML = mode === 'v' ? view() : source();
  $('#hint').textContent = mode === 'v' ? 'Ctrl+V ver Markdown' : 'Ctrl+V ver vista · Esc';
  $('.short').textContent = mode === 'v' ? 'Ver fuentes' : 'Ver vista';
  $('#name').textContent = 'papiro.md';
}
function toggle(){ mode = mode === 'v' ? 's' : 'v'; render(); window.scrollTo(0,0); }

$('#tg').addEventListener('click', toggle);
addEventListener('keydown', e=>{
  if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='v'){ e.preventDefault(); toggle(); }
  else if (e.key==='Escape' && mode==='s'){ toggle(); }
});
doc.addEventListener('click', e=>{
  const b = e.target.closest('[data-copy]'); if(!b) return;
  const t = b.parentElement.querySelector('code').textContent;
  const done = () => { b.textContent='Copiado'; setTimeout(()=>b.textContent='Copiar',1500); };
  try { navigator.clipboard.writeText(t).then(done,()=>{}); } catch(_) {}
});
render();