// Mobile menu + anchors + section highlighting + breadcrumb + dropdown
(function(){
  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if(menuBtn && links){
    menuBtn.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Dropdown toggle (works on mobile; desktop still supports hover)
  document.querySelectorAll('.dropdown .dropbtn').forEach(btn=>{
    const parent = btn.closest('.dropdown');
    const menu = parent.querySelector('.submenu');
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close others
      document.querySelectorAll('.dropdown .dropbtn[aria-expanded="true"]').forEach(b=>{
        if(b!==btn){ b.setAttribute('aria-expanded','false'); b.closest('.dropdown')?.classList.remove('open'); }
      });
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      parent.classList.toggle('open', !expanded);
      if(!expanded){ menu.querySelector('a')?.focus(); }
    });
  });
  // Close dropdowns on outside click / Esc
  document.addEventListener('click', ()=>{
    document.querySelectorAll('.dropdown').forEach(d=>{
      d.classList.remove('open'); d.querySelector('.dropbtn')?.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      document.querySelectorAll('.dropdown').forEach(d=>{
        d.classList.remove('open'); d.querySelector('.dropbtn')?.setAttribute('aria-expanded','false');
      });
    }
  });

  // Smooth scroll to sections on this page
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){
        e.preventDefault();
        el.setAttribute('tabindex','-1');
        el.scrollIntoView({behavior:'smooth', block:'start'});
        el.focus({preventScroll:true});
        history.replaceState(null,'','#'+id);
      }
    });
  });

  // Section tracking for tabs + breadcrumb (only on project.html)
  const sections = ['architecture','wbs','standards','risks'];
  const sectionName = {
    architecture: 'Architecture',
    wbs: 'WBS & Timeline',
    standards: 'Modeling & Standards',
    risks: 'Risks'
  };
  const tabLinks = sections.map(id => ({ id, el: document.querySelector(`.section-tabs a[href="#${id}"]`) }))
    .filter(x => x.el);
  const crumbCurrent = document.getElementById('crumb-current');

  const setActive = (id) => {
    tabLinks.forEach(t => t.el.classList.toggle('active', t.id === id));
    // If you also have in-page anchors in the top nav (dropdown), reflect active state there too
    document.querySelectorAll('.submenu a[href^="#"]').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#'+id)
    );
    if(crumbCurrent){
      const name = sectionName[id] || 'Section';
      crumbCurrent.innerHTML = `<a href="#${id}" aria-current="page">${name}</a>`;
    }
  };

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ setActive(entry.target.id); }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

  sections.forEach(id=>{
    const el = document.getElementById(id);
    if(el) io.observe(el);
  });

  // Gantt rendering
  const mount = document.getElementById('gantt');
  if(mount){
    const phases = [
      { label: 'Project Planning', range: [0,1] },    // Feb–Mar 2025
      { label: 'HW & Basic SW', range: [2,5] },       // Apr–Jul 2025
      { label: 'Adv. SW & ML', range: [6,8] },        // Aug–Oct 2025
      { label: 'Integration & Test', range: [9,10] }, // Nov–Dec 2025
      { label: 'Docs & Report', range: [10,11] }      // Dec 2025–Jan 2026
    ];
    const totalMonths = 12;
    const pct = (m)=> (m/totalMonths)*100;

    phases.forEach(p=>{
      const row = document.createElement('div');
      row.className = 'row';
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = p.label;
      const bars = document.createElement('div');
      bars.className = 'bars';

      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.left = pct(p.range[0]) + '%';
      bar.style.width = pct(p.range[1]-p.range[0]+1) + '%';

      bars.appendChild(bar);
      row.appendChild(label);
      row.appendChild(bars);
      mount.appendChild(row);
    });
  }
})();
