const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const motionToggle = document.querySelector('.motion-toggle');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mainNav?.classList.toggle('is-open', !isOpen);
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('is-open');
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled = !prefersReducedMotion.matches;

function setMotion(enabled) {
  motionEnabled = enabled;
  document.body.classList.toggle('motion-off', !enabled);
  document.documentElement.classList.toggle('motion-disabled', !enabled);
  motionToggle?.setAttribute('aria-pressed', String(enabled));
  motionToggle?.setAttribute('aria-label', enabled ? 'Pause motion effects' : 'Enable motion effects');
  if (motionToggle) {
    motionToggle.querySelector('.motion-label').textContent = enabled ? 'Motion on' : 'Motion off';
    motionToggle.querySelector('.motion-glyph').textContent = enabled ? 'Ⅱ' : '▶';
  }
}

setMotion(motionEnabled);
motionToggle?.addEventListener('click', () => setMotion(!motionEnabled));

const scrollProgressFill = document.querySelector('#scroll-progress-fill');
let scrollProgressQueued = false;
function updateScrollProgress() {
  if (!scrollProgressFill) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  scrollProgressFill.style.transform = `scaleX(${progress})`;
}
window.addEventListener('scroll', () => {
  if (scrollProgressQueued) return;
  scrollProgressQueued = true;
  requestAnimationFrame(() => {
    updateScrollProgress();
    scrollProgressQueued = false;
  });
}, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

const revealTargets = document.querySelectorAll(
  '.intro, .experience, .work, .practice, .impact-block, .approach, .toolkit, .contact, .discipline-explorer, .impact-lead, .impact-details article, .timeline-item, .project-card, .process-list li, .approach-accordion details, .toolkit-card, .console-panel, .packet-panel, .section-kicker, .section-heading-row, .systems-feature, .systems-graphic, .impact-heading, .credentials-grid, .contact-inner, .capability-strip article, .steps-grid article, .zone-coverage, .zone-grid article, .field-notes, .field-note-grid article, .automation-path, .automation-grid article, .modern-path, .modern-grid article, .ops-studio, .studio-card, .studio-alerts, .career-snapshot, .skill-map, .interview-lab'
);

document.documentElement.classList.add('motion-ready');
revealTargets.forEach((element) => element.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -5% 0px' });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const linkedSections = sectionLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.section);

if ('IntersectionObserver' in window && linkedSections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    linkedSections.forEach(({ link, section }) => {
      if (section === current.target) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .15, .4, .7] });
  linkedSections.forEach(({ section }) => navObserver.observe(section));
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
if (finePointer.matches) {
  document.querySelectorAll('.project-card, .toolkit-card, .studio-card, .zone-grid article, .field-note-grid article').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (!motionEnabled) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
    });
  });

  const hero = document.querySelector('.hero');
  const networkVisual = document.querySelector('.network-visual');
  hero?.addEventListener('pointermove', (event) => {
    if (!motionEnabled || !networkVisual) return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    networkVisual.style.setProperty('--parallax-x', `${(x * 7).toFixed(1)}px`);
    networkVisual.style.setProperty('--parallax-y', `${(y * 7).toFixed(1)}px`);
    networkVisual.style.setProperty('--spot-x', `${((x + .5) * 100).toFixed(1)}%`);
    networkVisual.style.setProperty('--spot-y', `${((y + .5) * 100).toFixed(1)}%`);
  }, { passive: true });
  hero?.addEventListener('pointerleave', () => {
    networkVisual?.style.removeProperty('--parallax-x');
    networkVisual?.style.removeProperty('--parallax-y');
    networkVisual?.style.removeProperty('--spot-x');
    networkVisual?.style.removeProperty('--spot-y');
  });
}

const projectDialog = document.querySelector('#project-dialog');
const projectDialogContent = document.querySelector('#project-dialog-content');
let lastProjectTrigger = null;

function addProjectDetail(tag, source, className) {
  if (!source || !projectDialogContent) return;
  const copy = source.cloneNode(true);
  copy.classList.add(className);
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  copy.querySelectorAll('a').forEach((link) => {
    link.target = '_blank';
    link.rel = 'noreferrer';
  });
  projectDialogContent.append(copy);
}

function openProjectPreview(card, trigger) {
  if (!projectDialog || !projectDialogContent) return;
  lastProjectTrigger = trigger;
  projectDialogContent.replaceChildren();
  const heading = document.createElement('h2');
  heading.id = 'project-dialog-title';
  heading.textContent = card.querySelector('h3')?.textContent.trim() || 'Project preview';
  projectDialogContent.append(heading);
  addProjectDetail('art', card.querySelector('.project-art'), 'project-dialog-art');
  addProjectDetail('meta', card.querySelector('.project-meta'), 'project-dialog-meta');
  addProjectDetail('description', card.querySelector(':scope > p:not(.project-footnote)'), 'project-dialog-description');
  addProjectDetail('highlights', card.querySelector('.project-highlights'), 'project-dialog-highlights');
  addProjectDetail('tags', card.querySelector('.tag-row'), 'project-dialog-tags');
  const caseStudy = card.querySelector('.project-details');
  if (caseStudy) {
    caseStudy.open = true;
    addProjectDetail('case-study', caseStudy, 'project-dialog-case-study');
  }
  card.querySelectorAll('a.project-link').forEach((link) => addProjectDetail('link', link, 'project-dialog-link'));
  card.querySelectorAll('.project-footnote').forEach((note) => addProjectDetail('note', note, 'project-dialog-note'));
  projectDialog.showModal();
}

document.querySelectorAll('.project-card').forEach((card, index) => {
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'project-preview-trigger';
  trigger.innerHTML = `Explore project <span aria-hidden="true">↗</span>`;
  trigger.setAttribute('aria-label', `Open project preview: ${card.querySelector('h3')?.textContent.trim() || `project ${index + 1}`}`);
  trigger.addEventListener('click', () => openProjectPreview(card, trigger));
  card.append(trigger);
});

projectDialog?.querySelectorAll('[data-dialog-close]').forEach((button) => {
  button.addEventListener('click', () => projectDialog.close());
});
projectDialog?.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
projectDialog?.addEventListener('close', () => lastProjectTrigger?.focus());

const terminalDialog = document.querySelector('#terminal-dialog');
const terminalInput = document.querySelector('#terminal-command');
const terminalOutput = document.querySelector('#terminal-output');
let lastTerminalTrigger = null;

function openTerminal(trigger) {
  if (!terminalDialog) return;
  lastTerminalTrigger = trigger || document.querySelector('[data-terminal-open]');
  terminalDialog.showModal();
  requestAnimationFrame(() => terminalInput?.focus());
}

document.querySelectorAll('[data-terminal-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
    mainNav?.classList.remove('is-open');
    openTerminal(trigger);
  });
});

terminalDialog?.querySelectorAll('[data-dialog-close]').forEach((button) => {
  button.addEventListener('click', () => terminalDialog.close());
});
terminalDialog?.addEventListener('close', () => lastTerminalTrigger?.focus());
terminalDialog?.querySelectorAll('[data-terminal-command]').forEach((button) => {
  button.addEventListener('click', () => {
    if (terminalInput) terminalInput.value = button.dataset.terminalCommand || '';
    terminalInput?.focus();
  });
});

const terminalCommands = {
  help: 'Available commands:\n  about                  who is Sohit?\n  projects               list selected work\n  project 1–6            open a project preview\n  skills                 show core capabilities\n  systems                servers, AD, and remote access\n  telecom                phones, EPABX, and PA\n  tools                  troubleshooting toolkit\n  ticket                 open the sample ticket workflow\n  open projects/contact  jump to a section\n  resume                 open the PDF in a new tab\n  contact                show public contact details\n  clear · exit',
  about: 'Sohit Vishwakarma · Network & IT Infrastructure Engineer\nAirport operations, routing and switching, security, monitoring, and practical automation.\nBased in Lucknow, India · Open to relocation.',
  whoami: 'Sohit Vishwakarma · Network & IT Infrastructure Engineer\nLucknow, India · Open to relocation across India.',
  projects: 'SELECTED WORK\n01  Airport IT & Network Infrastructure\n02  PacketPath Networking Study Lab\n03  Fake Signature Detection\n04  React 360° Virtual Tour\n05  Cisco Routing & Automation Lab\n06  Network Monitoring Lab\nTip: type project 1 to open a detail preview.',
  skills: 'L2/L3 SWITCH & ROUTER MANAGEMENT · VLAN · OSPF · STP/RSTP\nFIREWALLS & VPN · SOPHOS HA · FORTIGATE\nWINDOWS/LINUX SERVERS · ACTIVE DIRECTORY · GROUP POLICY\nTICKETING · SAT · CABLING · VENDOR COORDINATION',
  systems: 'Windows Server · Linux (Ubuntu/CentOS) · Active Directory users/groups · Group Policy · PowerShell · Bash · SSH/PuTTY remote access.',
  telecom: 'Analog phones · IP phones · EPABX/telecom · public-address systems · ISP/vendor coordination and service troubleshooting.',
  tools: 'Infron NMS · Zabbix · SolarWinds · Wireshark · Nmap · PuTTY · ping · traceroute · netstat · logs and CLI checks.',
  contact: 'EMAIL     isohitv@gmail.com\nLINKEDIN  linkedin.com/in/sohit-vishwakarma\nGITHUB    github.com/SOHITVISH',
  resume: 'Opening the résumé PDF in a new tab…',
  clear: '',
  exit: 'Closing terminal…'
};

function runPortfolioCommand(rawCommand) {
  if (!terminalOutput) return;
  const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!command) return;
  const projectMatch = command.match(/^(?:open )?project(?: | #)([1-6])$/);
  const sectionMatch = command.match(/^open (projects|work|contact|skills|story)$/);
  let response = terminalCommands[command];
  if (command === 'ticket') {
    terminalDialog?.close();
    document.querySelector('.ticket-demo')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto' });
    response = 'Opening the sample ticket workflow…';
  } else if (projectMatch) {
    const projectIndex = Number(projectMatch[1]) - 1;
    terminalDialog?.close();
    requestAnimationFrame(() => document.querySelectorAll('.project-preview-trigger')[projectIndex]?.click());
    response = `Opening project ${projectMatch[1]}…`;
  } else if (sectionMatch) {
    const targets = { projects: '#work', work: '#work', contact: '#contact', skills: '#toolkit', story: '#experience' };
    const target = document.querySelector(targets[sectionMatch[1]]);
    terminalDialog?.close();
    target?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto' });
    response = `Jumping to ${sectionMatch[1]}…`;
  } else if (command === 'resume') {
    window.open('Sohit_Vishwakarma_Resume.pdf', '_blank', 'noopener,noreferrer');
  } else if (command === 'exit') {
    terminalDialog?.close();
  } else if (response === undefined) {
    response = `Command not found: ${command}\nType help to see what this terminal can do.`;
  }
  if (command === 'clear') {
    terminalOutput.textContent = 'Terminal cleared. Type help for commands.';
  } else {
    terminalOutput.textContent = `sohit@portfolio:~$ ${command}\n${response || ''}\n\n`;
  }
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  if (terminalInput) terminalInput.value = '';
}

document.querySelector('#terminal-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  runPortfolioCommand(terminalInput?.value || '');
});

document.addEventListener('keydown', (event) => {
  const active = document.activeElement;
  const isTyping = active instanceof HTMLElement && (active.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName));
  if (!isTyping && !event.ctrlKey && !event.metaKey && !event.altKey && event.code === 'Backquote' && !terminalDialog?.open && !projectDialog?.open) {
    event.preventDefault();
    openTerminal(document.querySelector('[data-terminal-open]'));
  }
});

const disciplineInfo = {
  operate: {
    index: '01 / 03 · OPERATIONS',
    title: 'Keep airport services moving.',
    description: 'I monitor connected services through 24/7 NOC workflows, resolve L1/L2 issues, and use packet evidence and RCA to restore service carefully.',
    tags: ['Infron NMS', 'Wireshark', 'Incident response'],
    href: '#experience'
  },
  protect: {
    index: '02 / 03 · SECURITY & ACCESS',
    title: 'Control paths and access.',
    description: 'I work with Sophos HA, VPN tunnels, firewall policies, wireless access, and Active Directory in a live airport environment.',
    tags: ['Sophos HA', 'IPsec VPN', 'Active Directory'],
    href: '#experience'
  },
  automate: {
    index: '03 / 03 · AUTOMATION',
    title: 'Make repeatable checks routine.',
    description: 'I built Python, Netmiko, and NAPALM scripts for configuration backups, OSPF checks, and interface reporting. My EVE-NG lab reports 4+ hours saved weekly.',
    tags: ['Python', 'Netmiko', 'NAPALM'],
    href: '#work'
  }
};

const disciplineButtons = [...document.querySelectorAll('.discipline-button')];
disciplineButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.discipline;
    const content = disciplineInfo[key];
    if (!content) return;
    disciplineButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#discipline-visual').dataset.mode = key;
    document.querySelector('#discipline-index').textContent = content.index;
    document.querySelector('#discipline-title').textContent = content.title;
    document.querySelector('#discipline-description').textContent = content.description;
    document.querySelector('#discipline-link').href = content.href;
    const tags = document.querySelector('#discipline-tags');
    tags.replaceChildren(...content.tags.map((tag) => {
      const item = document.createElement('span');
      item.textContent = tag;
      return item;
    }));
  });
});

document.querySelectorAll('.approach-accordion details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.approach-accordion details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

const demoResponses = {
  'help': 'Supported demo commands:\nshow ip route\nshow ip interface brief\nshow interfaces status\nshow mac address-table\nshow vlan brief\nshow ip ospf neighbor\nshow spanning-tree\nping 198.51.100.20\ntraceroute 198.51.100.20\ncheck firewall path\nwhoami\nabout sohit\nshow achievements\nshow certifications\nsudo hire sohit',
  'whoami': 'Sohit Vishwakarma\nNetwork & IT Infrastructure Engineer\nLucknow, India · Open to relocation across India',
  'about sohit': 'Network operations · Airport infrastructure · Application support\nI work across reliability, security, monitoring, and practical automation.',
  'show achievements': '20+ Cisco Catalyst switches supported\n55+ Ruckus wireless APs supported\n50+ Wipro backend incidents/month · 95%+ SLA adherence\n99%+ reported uptime across supported key services',
  'show certifications': 'Sophos Certified Network Engineer · 2025\nFortiGate Administrator · Fortinet · 2026\nCCNA networking coursework · in progress\nCisco / Google / IBM training listed in Learning',
  'sudo hire sohit': 'This read-only portfolio terminal cannot run privileged commands.\nTo start a conversation, use the public email link on this page.',
  'show ip route': 'C  192.0.2.0/24       directly connected, Vlan10\nS  198.51.100.0/24   via 192.0.2.1\nS* 0.0.0.0/0         via 192.0.2.1\n\nSIMULATED ROUTING TABLE · DOCUMENTATION RANGES',
  'show ip interface brief': 'Interface       IP-Address      Status  Protocol\nVlan10          192.0.2.2       up      up\nGi0/1           unassigned      up      up\nGi0/2           unassigned      up      up\n\nSYNTHETIC INTERFACE SUMMARY · LAB ONLY',
  'show interfaces status': 'Port    Name       Status       VLAN  Type\nGi0/1   UPLINK     connected    trunk 1G\nGi0/2   USERS      connected    20    1G\nGi0/3   SPARE      notconnect   1     1G\n\nSIMULATED SWITCH STATE · NOT A LIVE DEVICE',
  'show mac address-table': 'VLAN  MAC Address       Type      Port\n10    00aa.10bb.20cc    DYNAMIC   Gi0/1\n20    00dd.30ee.40ff    DYNAMIC   Gi0/2\n\nSYNTHETIC MAC TABLE · SAMPLE VALUES',
  'show vlan brief': 'VLAN  Name       Status\n10    MGMT       active\n20    USERS      active\n30    LAB        active\n\nSYNTHETIC VLAN EXAMPLE · NO SITE DATA',
  'show ip ospf neighbor': 'Neighbor ID     State     Interface\n198.51.100.2    FULL/DR   Gi0/1\n\nSYNTHETIC OSPF ADJACENCY · LAB ONLY',
  'show spanning-tree': 'VLAN0030\nRoot bridge: LAB-SW-01\nGi0/1  Root FWD  cost 4\nGi0/2  Desg FWD  cost 4\n\nSIMULATED STP STATE',
  'ping 198.51.100.20': 'Sending 5 ICMP echoes to 198.51.100.20...\n!!!!!\nSuccess rate is 100 percent (5/5)\nRound-trip time: synthetic lab result',
  'traceroute 198.51.100.20': 'Tracing a sample path to 198.51.100.20\n1  192.0.2.1       1 ms\n2  192.0.2.254     3 ms\n3  198.51.100.20   5 ms\n\nSYNTHETIC PATH · DOCUMENTATION RANGES',
  'check firewall path': 'SAMPLE FLOW · CLIENT VLAN 20 → POLICY LOOKUP → NAT CHECK → DESTINATION TEST\nReview source, destination, service, rule order, VPN/route state, and logs before escalation.\n\nADVISORY EXAMPLE · NO FIREWALL CONTACTED'
};

const consoleOutput = document.querySelector('#console-output');
const consoleInput = document.querySelector('#console-command');
function runDemoCommand(command) {
  if (!consoleOutput) return;
  const normalized = command.trim().toLowerCase().replace(/\s+/g, ' ');
  consoleOutput.textContent = demoResponses[normalized] || '% Command not available in this safe demo. Type help to see supported commands.';
}
document.querySelectorAll('[data-console-command]').forEach((button) => {
  button.addEventListener('click', () => runDemoCommand(button.dataset.consoleCommand));
});
document.querySelector('#console-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  runDemoCommand(consoleInput?.value || '');
  if (consoleInput) consoleInput.value = '';
});

function updatePacketEndpoints() {
  const sourceAddress = document.querySelector('#packet-source-address');
  const destinationAddress = document.querySelector('#packet-destination-address');
  if (sourceAddress) sourceAddress.textContent = document.querySelector('#packet-source')?.value || '192.0.2.44';
  if (destinationAddress) destinationAddress.textContent = document.querySelector('#packet-destination')?.value || '198.51.100.15';
}
document.querySelector('#packet-source')?.addEventListener('change', updatePacketEndpoints);
document.querySelector('#packet-destination')?.addEventListener('change', updatePacketEndpoints);
updatePacketEndpoints();
const traceButton = document.querySelector('#trace-packet');
traceButton?.addEventListener('click', () => {
  const track = document.querySelector('#packet-track');
  const status = document.querySelector('#packet-status');
  if (track) {
    track.classList.remove('is-tracing');
    requestAnimationFrame(() => track.classList.add('is-tracing'));
  }
  const source = document.querySelector('#packet-source')?.selectedOptions[0]?.textContent || 'sample client';
  const destination = document.querySelector('#packet-destination')?.selectedOptions[0]?.textContent || 'sample service';
  if (status) status.textContent = `Simulation complete: ${source} → route lookup → policy check → ${destination}. No live systems contacted.`;
});

const impactInfo = {
  operate: {
    context: 'LIVE AIRPORT SYSTEMS · REPORTED FIGURE',
    number: '99', suffix: '%+',
    title: 'Availability supports the service.',
    description: 'Reported uptime across FIDS, 300+ CCTV cameras, and access control, supported through proactive monitoring and 24/7 NOC response.',
    link: '#experience', linkText: 'Read the operations story'
  },
  support: {
    context: 'WIPRO · APPLICATION SUPPORT',
    number: '50', suffix: '+',
    title: 'Incidents resolved. Services restored.',
    description: 'Resolved 50+ backend incidents per month with 95%+ SLA adherence, working with DevOps, development, and QA teams on production issues and root-cause analysis.',
    link: '#experience', linkText: 'Read the support story'
  },
  automate: {
    context: 'EVE-NG · AUTOMATION LAB · REPORTED ESTIMATE',
    number: '4+', suffix: 'h',
    title: 'Repeatable checks return time.',
    description: 'My lab workflows use Python and Netmiko for configuration backups, OSPF checks, and interface reporting. The time saved is a lab-reported estimate.',
    link: '#work', linkText: 'Explore the lab work'
  }
};

const impactButtons = [...document.querySelectorAll('.impact-button')];
impactButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const story = impactInfo[button.dataset.impact];
    if (!story) return;
    impactButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#impact-context').textContent = story.context;
    document.querySelector('#impact-number').innerHTML = `${story.number}<span>${story.suffix}</span>`;
    document.querySelector('#impact-title').textContent = story.title;
    document.querySelector('#impact-description').textContent = story.description;
    const link = document.querySelector('#impact-link');
    link.href = story.link;
    link.firstChild.textContent = `${story.linkText} `;
  });
});

const filterButtons = [...document.querySelectorAll('.filter-button')];
const projectCards = [...document.querySelectorAll('.project-card')];

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const interviewQuestionBank = [
['Which OSI layer forwards frames using MAC addresses?',['Physical','Data Link','Network','Transport'],1,'SWITCHING'],['What is the default subnet mask for a Class C network?',['255.0.0.0','255.255.0.0','255.255.255.0','255.255.255.252'],2,'IP FUNDAMENTALS'],['Which protocol resolves IPv4 addresses to MAC addresses?',['DNS','DHCP','ARP','ICMP'],2,'PROTOCOLS'],['What is the loopback IPv4 address?',['127.0.0.1','169.254.1.1','0.0.0.0','255.255.255.255'],0,'IP FUNDAMENTALS'],['Which command tests reachability with ICMP?',['traceroute','ping','nslookup','arp'],1,'TROUBLESHOOTING'],['What does CIDR /24 represent?',['64 addresses','128 addresses','256 addresses','512 addresses'],2,'IP FUNDAMENTALS'],['Which IPv6 prefix is link-local?',['2000::/3','FC00::/7','FE80::/10','FF00::/8'],2,'IP FUNDAMENTALS'],['What is the purpose of a default gateway?',['Assign DNS','Reach remote networks','Encrypt traffic','Block broadcasts'],1,'ROUTING'],['Which address is private RFC1918 space?',['8.8.8.8','172.20.5.1','1.1.1.1','198.51.100.4'],1,'IP FUNDAMENTALS'],['What does DHCP provide?',['Only routing','Automatic network configuration','Encryption keys','MAC filtering'],1,'SERVICES'],
['Which VLAN carries untagged traffic on an 802.1Q trunk?',['Voice VLAN','Native VLAN','Management VLAN','Private VLAN'],1,'VLAN'],['Which command shows VLANs on Cisco IOS?',['show ip route','show vlan brief','show cdp','show access-lists'],1,'CISCO IOS'],['What does an access port normally carry?',['Multiple tagged VLANs','One untagged VLAN','Only routed traffic','No traffic'],1,'SWITCHING'],['Which feature prevents rogue DHCP servers?',['DHCP snooping','Port mirroring','BPDU filter','NAT'],0,'SWITCH SECURITY'],['What is a trunk port used for?',['Connect hosts only','Carry multiple VLANs','Disable STP','Assign IP addresses'],1,'VLAN'],['Which VLAN is commonly used for IP phones?',['Native VLAN','Voice VLAN','Blackhole VLAN','Transit VLAN'],1,'VLAN'],['What does 802.1Q add to an Ethernet frame?',['IP header','VLAN tag','TCP flag','MAC address'],1,'VLAN'],['What is inter-VLAN routing?',['Routing within one VLAN','Routing between VLANs','Routing only IPv6','Routing without a gateway'],1,'ROUTING'],['Which command verifies a Cisco interface status?',['show interfaces status','show users','show flash','show clock'],0,'CISCO IOS'],['What is a broadcast domain?',['Devices sharing broadcasts','A single cable','A routing protocol','A VPN tunnel'],0,'SWITCHING'],
['What problem does STP prevent?',['IP conflicts','Layer 2 loops','DNS failure','Packet encryption'],1,'STP'],['Which switch becomes STP root based on the lowest bridge ID?',['Root bridge','Designated router','Backup server','DHCP relay'],0,'STP'],['RSTP is standardized as which IEEE protocol?',['802.1X','802.1D','802.1w','802.3ad'],2,'STP'],['What does PortFast do?',['Speeds host port forwarding','Encrypts a port','Bundles links','Blocks BPDUs'],0,'STP'],['Which STP feature protects against unexpected BPDUs on edge ports?',['BPDU Guard','Root Guard','Loop Guard','UDLD'],0,'STP'],['What is EtherChannel used for?',['Link aggregation','Address translation','VLAN pruning','Route encryption'],0,'SWITCHING'],['Which protocol negotiates Cisco EtherChannel?',['LACP only','PAgP','OSPF','VTP'],1,'SWITCHING'],['What can cause a MAC address flapping alert?',['Layer 2 loop','Correct routing','DNS cache','Low CPU'],0,'TROUBLESHOOTING'],['Which command shows the MAC address table?',['show mac address-table','show ip arp','show cdp neighbors','show spanning-tree root'],0,'CISCO IOS'],['What does storm control limit?',['Broadcast or multicast traffic','CPU temperature','Routing updates','User passwords'],0,'SWITCH SECURITY'],
['Which routing protocol is link-state?',['RIP','OSPF','BGP path vector','EIGRP distance vector'],1,'OSPF'],['What metric does OSPF primarily use?',['Hop count','Cost','Bandwidth only','Delay only'],1,'OSPF'],['What does an OSPF hello packet establish?',['Neighbor relationship','NAT mapping','DNS zone','VLAN tag'],0,'OSPF'],['Which OSPF area is the backbone?',['Area 0','Area 1','Area 100','Area 255'],0,'OSPF'],['What is an OSPF DR used for?',['Reduce adjacency count on multi-access networks','Encrypt LSAs','Assign IPs','Replace a firewall'],0,'OSPF'],['Which route has the lowest administrative distance by default?',['OSPF 110','Static 1','RIP 120','eBGP 20'],1,'ROUTING'],['What is a floating static route?',['Backup route with higher AD','Encrypted route','IPv6-only route','Default OSPF route'],0,'ROUTING'],['What does route redistribution do?',['Shares routes between protocols','Removes VLANs','Encrypts packets','Resets interfaces'],0,'ROUTING'],['BGP is primarily used for what?',['Inter-domain routing','Host discovery','MAC learning','Wireless roaming'],0,'BGP'],['Which BGP attribute helps select the outbound path inside an AS?',['Local preference','TTL','VLAN ID','CRC'],0,'BGP'],
['What is the purpose of NAT?',['Translate addresses','Prevent STP','Monitor CPU','Resolve names'],0,'SECURITY'],['Which NAT maps many private hosts to one public IP using ports?',['Static NAT','PAT','1:1 NAT','Proxy ARP'],1,'SECURITY'],['What does an ACL do on a router?',['Filters traffic','Creates VLANs','Learns MACs','Forms OSPF neighbors'],0,'SECURITY'],['Where is an extended Cisco ACL commonly placed?',['Near the source','Near the destination only','On the console','Inside DNS'],0,'CISCO IOS'],['What does a stateful firewall track?',['Connection state','Only MAC addresses','Cable length','Switch roots'],0,'FIREWALL'],['What is the main purpose of an IPS?',['Detect and block threats','Assign DHCP leases','Route OSPF','Compress packets'],0,'SECURITY'],['What is a site-to-site VPN?',['Encrypted network-to-network tunnel','Host-only cable','DNS forwarder','Wireless SSID'],0,'VPN'],['Which VPN protocol provides encryption at Layer 3?',['IPsec','FTP','TFTP','ARP'],0,'VPN'],['What is HA in a firewall pair?',['High availability','Host addressing','Hardware access','Hybrid ARP'],0,'FIREWALL'],['What is a DMZ?',['Isolated network for exposed services','A VLAN with no switch','A backup route','A DNS record'],0,'SECURITY'],
['Which DNS record maps a name to an IPv4 address?',['AAAA','A','MX','PTR'],1,'DNS'],['Which record maps a name to IPv6?',['A','AAAA','CNAME','NS'],1,'DNS'],['What does an MX record identify?',['Mail server','Web server','Default gateway','NTP source'],0,'DNS'],['What is a DNS PTR record used for?',['Reverse lookup','Mail exchange','Alias creation','DHCP relay'],0,'DNS'],['Which DHCP message does a client send first?',['Offer','Discover','Request','ACK'],1,'DHCP'],['What is DHCP reservation based on?',['MAC address','DNS name','OS version','TCP port'],0,'DHCP'],['Which protocol synchronizes system clocks?',['NTP','SNMP','SMTP','SFTP'],0,'SERVICES'],['What port does HTTPS use by default?',['22','53','80','443'],3,'PROTOCOLS'],['What port does SSH use by default?',['21','22','23','3389'],1,'PROTOCOLS'],['What port does DNS commonly use?',['25','53','110','161'],1,'PROTOCOLS'],
['Which transport protocol is connection-oriented?',['UDP','TCP','ICMP','ARP'],1,'TCP/IP'],['What does TCP three-way handshake use?',['SYN, SYN-ACK, ACK','ACK, FIN, RST','DNS, DHCP, ARP','GET, POST, PUT'],0,'TCP/IP'],['What does UDP trade for lower overhead?',['Reliability and ordering','IP addressing','MAC learning','Encryption always'],0,'TCP/IP'],['Which TCP flag gracefully closes a connection?',['SYN','ACK','FIN','PSH'],2,'TCP/IP'],['What does MTU define?',['Maximum packet size on a link','Minimum VLAN ID','Maximum users','Routing priority'],0,'TCP/IP'],['What is fragmentation?',['Splitting a packet to fit MTU','Encrypting a frame','Learning a MAC','Creating an ACL'],0,'TCP/IP'],['Which tool captures packets for analysis?',['Wireshark','Notepad','PowerPoint','Task Manager'],0,'TROUBLESHOOTING'],['What does traceroute reveal?',['Layer 3 hops','MAC table only','Firewall rules','Wi-Fi password'],0,'TROUBLESHOOTING'],['What does an ICMP destination unreachable indicate?',['A delivery problem','Successful DNS','A healthy BGP session','A VLAN tag'],0,'TROUBLESHOOTING'],['What is a broadcast storm?',['Excessive broadcast traffic','A routing protocol','A firewall HA event','A DNS alias'],0,'TROUBLESHOOTING'],
['Which SNMP version supports strong authentication and encryption?',['SNMPv1','SNMPv2c','SNMPv3','SNMPv0'],2,'MONITORING'],['What does SNMP monitor?',['Network device metrics','User source code','Email content','Disk partitions only'],0,'MONITORING'],['What is a syslog message?',['A device or application log event','A routing packet','A VLAN tag','A certificate'],0,'MONITORING'],['What does an NMS provide?',['Central monitoring and alerts','Only file storage','Code compilation','Wireless encryption'],0,'MONITORING'],['What is MTTR?',['Mean time to repair','Maximum transmission test rate','Managed trunk table route','Mean traffic trace ratio'],0,'NOC'],['What is an SLA?',['Service level agreement','Secure link algorithm','Switch learning address','System log archive'],0,'NOC'],['Why perform RCA after an incident?',['Prevent recurrence','Increase broadcast traffic','Disable monitoring','Change MAC addresses'],0,'NOC'],['What is alert correlation?',['Combining related events','Deleting all alerts','Encrypting logs','Changing IP ranges'],0,'NOC'],['What is a runbook?',['Documented operational procedure','A routing table','A firewall object','A cable tester'],0,'NOC'],['What is proactive monitoring?',['Finding issues before users report them','Waiting for outages','Disabling alerts','Replacing DNS'],0,'NOC'],
['Which Linux command displays IP addresses?',['ip addr','show ip interface','ifconfig /all','route print'],0,'LINUX'],['Which Linux command tests a TCP port commonly?',['curl or nc','mkdir','chmod','whoami'],0,'LINUX'],['What does chmod change?',['File permissions','IP routes','DNS records','Kernel version'],0,'LINUX'],['Which Linux tool follows a log file live?',['tail -f','grep -r','ps aux','df -h'],0,'LINUX'],['What does systemctl manage?',['Linux services','VLANs','DNS zones','Browser tabs'],0,'LINUX'],['Which Windows tool manages directory users and groups?',['Active Directory Users and Computers','Disk Cleanup','Paint','Registry Editor only'],0,'WINDOWS'],['What does Group Policy manage?',['Centralized Windows settings','OSPF costs','Switch trunks','CCTV streams'],0,'WINDOWS'],['Which Windows command tests name resolution?',['nslookup','ipconfig','tasklist','net use'],0,'WINDOWS'],['Which PowerShell cmdlet lists services?',['Get-Service','Get-ProcessTree','Show-Service','List-Services'],0,'POWERSHELL'],['Which command shows Windows IP configuration?',['ipconfig','ifconfig','show ip route','netstat -r only'],0,'WINDOWS'],
['What is Netmiko used for?',['Network device automation over SSH','Packet capture','Database backup only','DNS hosting'],0,'AUTOMATION'],['What is NAPALM?',['Multi-vendor network automation library','Firewall appliance','Monitoring protocol','Linux shell'],0,'AUTOMATION'],['What is Ansible primarily?',['Agentless configuration automation','A routing protocol','A packet analyzer','A database engine'],0,'AUTOMATION'],['What format is commonly used for Ansible variables?',['YAML','MP3','EXE','PSD'],0,'AUTOMATION'],['Why automate configuration backups?',['Consistency and recovery','Increase manual errors','Disable auditing','Remove version history'],0,'AUTOMATION'],['What does Git track?',['Changes to files and code','Live packets','DHCP leases','CPU temperature'],0,'DEVTOOLS'],['What is an API?',['Programmatic interface between systems','A physical cable','A VLAN type','A log severity'],0,'DEVTOOLS'],['What is JSON commonly used for?',['Structured data exchange','Optical testing','Cable labeling','Power delivery'],0,'DEVTOOLS'],['What does idempotent automation mean?',['Repeated runs reach the same desired state','Every run changes everything','Only one device is supported','No validation is done'],0,'AUTOMATION'],['What should automation include before changes?',['Validation and safe rollback','Hard-coded secrets','No logs','Random delays'],0,'AUTOMATION'],
['Which Wi-Fi standard introduced Wi-Fi 6?',['802.11ac','802.11ax','802.11n','802.11g'],1,'WIRELESS'],['What does WPA2-Enterprise commonly use for authentication?',['RADIUS','FTP','BGP','NTP'],0,'WIRELESS'],['What is an SSID?',['Wireless network name','Firewall rule','Switch MAC','VPN key'],0,'WIRELESS'],['What causes co-channel interference?',['Overlapping networks using the same channel','Different DNS zones','Static routes','Low DHCP lease time'],0,'WIRELESS'],['What does 802.1X provide?',['Port-based access control','VLAN routing only','Packet compression','Cable testing'],0,'ACCESS CONTROL'],['What is RADIUS used for?',['Centralized AAA','DNS caching','Link aggregation','Video encoding'],0,'SECURITY'],['What does AAA stand for?',['Authentication, Authorization, Accounting','Address, ARP, Access','Availability, Audit, Automation','Authentication, Allocation, Aggregation'],0,'SECURITY'],['Why segment a network into VLANs?',['Limit broadcast domains and improve control','Increase collisions','Remove routing','Disable security'],0,'VLAN'],['What is zero trust based on?',['Verify explicitly and least privilege','Trust the internal network','Allow all traffic','Disable identity checks'],0,'SECURITY'],['What is the safest way to store credentials in automation?',['Secret manager or protected variables','Plain text in Git','Public README','URL query string'],0,'SECURITY'],
['What is a UPS used for?',['Power continuity','Packet routing','DNS resolution','Wireless roaming'],0,'INFRASTRUCTURE'],['What does RAID provide?',['Disk redundancy or performance','Network encryption','VLAN tagging','User authentication'],0,'INFRASTRUCTURE'],['What is structured cabling?',['Organized standards-based cabling system','A routing protocol','A firewall policy','A log format'],0,'INFRASTRUCTURE'],['What does a patch panel provide?',['A managed cable termination point','A DHCP server','A Wi-Fi controller','A VPN gateway'],0,'INFRASTRUCTURE'],['What does CCTV availability depend on besides cameras?',['Network, power, storage and monitoring','Only DNS','Only VLAN names','Only browser cache'],0,'AIRPORT SYSTEMS'],['What is FIDS?',['Flight Information Display System','Firewall Intrusion Detection Service','Fiber Interface Distribution Switch','File Index Database Service'],0,'AIRPORT SYSTEMS'],['What is a change window?',['Approved time to perform planned work','A browser popup','A firewall port','A VLAN range'],0,'NOC'],['Why document a topology?',['Faster support and safer change planning','To expose live credentials','To remove monitoring','To increase downtime'],0,'DOCUMENTATION'],['What is a hardware health check?',['Review of device state, power, temperature and interfaces','A DNS query','A routing update','A user password reset'],0,'INFRASTRUCTURE'],['What is a zero-downtime mindset?',['Plan, monitor and recover without service interruption','Never test changes','Ignore alerts','Avoid documentation'],0,'NOC'],
['Which command shows the Cisco routing table?',['show ip route','show vlan brief','show users','show version'],0,'CISCO IOS'],['Which Cisco command shows OSPF neighbors?',['show ip ospf neighbor','show ip bgp','show cdp entry','show interfaces counters'],0,'OSPF'],['What does show running-config display?',['Active configuration in RAM','Startup config only','MAC addresses','Flash files'],0,'CISCO IOS'],['What does copy running-config startup-config do?',['Save active config for reboot','Reload the switch','Clear counters','Start DHCP'],0,'CISCO IOS'],['What is the Cisco enable secret for?',['Privileged EXEC authentication','VLAN tagging','SNMP polling','NTP'],0,'CISCO IOS'],['Which command enters interface configuration mode?',['interface GigabitEthernet0/1','router ospf 1','enable secret','line vty'],0,'CISCO IOS'],['What does shutdown on an interface do?',['Administratively disables it','Clears its MAC','Changes its VLAN','Starts OSPF'],0,'CISCO IOS'],['What does no shutdown do?',['Enables an interface administratively','Deletes the interface','Removes its IP','Disables STP'],0,'CISCO IOS'],['Which Cisco feature mirrors traffic for analysis?',['SPAN','PAT','VTP','HSRP'],0,'TROUBLESHOOTING'],['What does HSRP provide?',['First-hop gateway redundancy','Wireless encryption','DNS failover','Packet capture'],0,'HIGH AVAILABILITY'],
['What is a health check in incident response?',['A targeted test to confirm service state','A certificate type','A VLAN tag','A database schema'],0,'TROUBLESHOOTING'],['What is the first step when a user reports no connectivity?',['Scope and gather symptoms','Reboot everything','Delete the VLAN','Disable monitoring'],0,'TROUBLESHOOTING'],['Why compare a working and failing path?',['Isolate the difference','Increase noise','Skip evidence','Change all devices'],0,'TROUBLESHOOTING'],['What does packet loss mean?',['Packets fail to reach the destination','DNS is always broken','The cable is always cut','The firewall is always down'],0,'TROUBLESHOOTING'],['What can duplex mismatch cause?',['Errors and poor performance','Better throughput','New VLANs','Faster DNS'],0,'TROUBLESHOOTING'],['What does CRC errors often suggest?',['Physical layer or cabling issue','Correct routing','Good optics','A DNS alias'],0,'TROUBLESHOOTING'],['What is escalation management?',['Moving an issue to the right support level','Deleting an incident','Changing a MAC address','Disabling an SLA'],0,'NOC'],['What is a maintenance rollback plan?',['Steps to restore the previous state','A new VLAN design','A user survey','A DNS record'],0,'CHANGE MANAGEMENT'],['What does SLA adherence measure?',['Whether service targets are met','Number of VLANs','Cable length','CPU model'],0,'ITSM'],['Why close an incident with documentation?',['Preserve knowledge and audit history','Hide the outage','Remove root cause','Disable future alerts'],0,'ITSM']
];


const studioTriage = {
  ospf: 'Check peer reachability and interface state; confirm area, timers, authentication, and adjacency logs; compare route changes before acting.',
  dhcp: 'Confirm the client VLAN and link; inspect the scope and relay path; check service reachability; validate with a sample lease in the lab.',
  wifi: 'Check SSID and authentication service status; review AP and client logs; compare a working client; verify VLAN mapping and signal conditions.',
  cctv: 'Check the camera path and switch port; review PoE and link status; confirm VLAN reachability and VMS registration in a lab example.',
  fids: 'Check the display endpoint and application health; trace DNS and network reachability; compare timestamps and upstream service status.'
};

const ticketStatus = document.querySelector('#ticket-status');
const ticketQueue = document.querySelector('#ticket-queue');
const ticketOutput = document.querySelector('#ticket-output');
document.querySelectorAll('[data-ticket-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.ticketAction;
    const states = {
      acknowledge: ['ACKNOWLEDGED · P2', 'NETWORK SUPPORT', 'Ticket accepted · impact and affected service recorded; investigation assigned to the support queue.'],
      investigate: ['IN PROGRESS · P2', 'NETWORK SUPPORT', 'Work note added · check interface and VLAN state, review NMS events, then verify the route and packet path. Sample evidence only.'],
      escalate: ['VENDOR ESCALATION · P2', 'VENDOR COORDINATION', 'Escalation note added · share impact, checks completed, relevant timestamps, and the next action with the vendor; track follow-up to closure.'],
      resolve: ['RESOLVED · P2', 'NETWORK SUPPORT', 'Resolution recorded · validate reachability and user service, attach the check result, and document the root cause before closure.'],
      close: ['CLOSED · P2', 'NETWORK SUPPORT', 'Ticket closed · resolution, validation evidence, handoff, and final notes are recorded in this synthetic example.']
    };
    if (action === 'reset') {
      if (ticketStatus) ticketStatus.textContent = 'OPEN · P2';
      if (ticketQueue) ticketQueue.textContent = 'NETWORK SUPPORT';
      if (ticketOutput) ticketOutput.textContent = 'New sample ticket · record the impact, then choose an action. No live ticketing system is connected.';
      return;
    }
    const [status, queue, message] = states[action] || [];
    if (!status) return;
    if (ticketStatus) ticketStatus.textContent = status;
    if (ticketQueue) ticketQueue.textContent = queue;
    if (ticketOutput) ticketOutput.textContent = message;
  });
});

document.querySelector('#triage-run')?.addEventListener('click', () => {
  const symptom = document.querySelector('#triage-symptom')?.value;
  const output = document.querySelector('#triage-output');
  if (output) output.textContent = `SAMPLE TRIAGE · ${studioTriage[symptom] || 'Choose a symptom to view checks.'}`;
});

document.querySelectorAll('[data-scenario]').forEach((button) => {
  button.addEventListener('click', () => {
    const scenarios = {
      uplink: 'Simulated uplink event: compare interface state, counters, and the alternate path before recovery.',
      dhcp: 'Simulated DHCP event: validate VLAN membership, relay, scope capacity, and service reachability.',
      loop: 'Simulated loop warning: inspect STP state and recent topology changes; do not disable protections blindly.'
    };
    const output = document.querySelector('#scenario-output');
    if (output) output.textContent = scenarios[button.dataset.scenario] || 'Sample event selected.';
  });
});

document.querySelector('#run-runbook')?.addEventListener('click', () => {
  const task = document.querySelector('input[name="runbook"]:checked')?.value;
  const messages = {
    backup: 'DRY RUN COMPLETE · pre-check passed → synthetic config backup prepared → integrity check passed → audit note recorded.',
    ospf: 'DRY RUN COMPLETE · sample peers checked → adjacency state compared → route summary recorded → no device contacted.',
    vlan: 'DRY RUN COMPLETE · sample VLAN intent compared → drift report prepared → review step recorded → no change deployed.'
  };
  const output = document.querySelector('#runbook-output');
  if (output) output.textContent = messages[task] || 'Choose a runbook to start the dry run.';
});

document.querySelectorAll('.alert-row[data-alert]').forEach((row) => {
  row.addEventListener('click', () => {
    document.querySelectorAll('.alert-row[data-alert]').forEach((other) => other.classList.toggle('is-selected', other === row));
    const status = document.querySelector('#alert-status');
    if (status) status.textContent = `Selected sample alert: ${row.querySelector('b')?.textContent || row.dataset.alert}.`;
  });
});
document.querySelectorAll('[data-alert-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = document.querySelector('.alert-row.is-selected[data-alert]');
    const status = document.querySelector('#alert-status');
    if (status) status.textContent = `${button.dataset.alertAction} recorded for the selected sample alert. This is a local simulation.`;
  });
});

let replayTimer = null;
document.querySelector('#replay-run')?.addEventListener('click', () => {
  const steps = [...document.querySelectorAll('#replay-steps li')];
  const output = document.querySelector('#replay-output');
  if (!steps.length || !output) return;
  if (replayTimer) clearInterval(replayTimer);
  let index = 0;
  const showStep = () => {
    steps.forEach((step, stepIndex) => step.classList.toggle('is-current', stepIndex === index));
    output.textContent = `SIMULATED REPLAY · Step ${index + 1} of ${steps.length}: ${steps[index].textContent}`;
    index += 1;
    if (index >= steps.length) { clearInterval(replayTimer); replayTimer = null; }
  };
  showStep();
  replayTimer = setInterval(showStep, 1050);
});

const skillEvidence = {
  routing: ['ROUTING & SWITCHING', 'Evidence: Cisco routing and automation lab; support across access and distribution/core switch roles and routed paths.', 'L2/L3 switches · Routers · OSPF · VLAN · STP/RSTP'],
  security: ['FIREWALLS & VPN', 'Evidence: Sophos HA, FortiGate administration, VPN, access controls, and security-log checks.', 'Sophos HA · FortiGate · IPsec/SSL VPN · ACL · NAT'],
  automation: ['NETWORK AUTOMATION', 'Evidence: EVE-NG practice and repeatable Python/Netmiko/NAPALM checks.', 'Python · Netmiko · NAPALM · Ansible'],
  cloud: ['CLOUD NETWORKING', 'Learning direction: AWS networking and cloud-connected infrastructure fundamentals.', 'AWS VPC · EC2 · S3 · IAM fundamentals'],
  observability: ['TROUBLESHOOTING TOOLKIT', 'Evidence: use monitoring signals, path tests, logs, and packet inspection to isolate faults and verify recovery.', 'Infron NMS · Zabbix · SolarWinds · Wireshark · Nmap · ping · traceroute'],
  switchmgmt: ['SWITCH MANAGEMENT', 'Evidence: hands-on operation and troubleshooting across L2 access and L3 distribution/core switch roles.', 'Cisco IOS CLI · PuTTY/SSH · VLAN · STP/RSTP · trunk checks'],
  servers: ['SERVER MANAGEMENT', 'Evidence: Windows and Linux server administration, service and health checks, remote access, and operations support.', 'Windows Server · Linux · PowerShell · Bash · PuTTY/SSH'],
  identity: ['ACTIVE DIRECTORY & GROUP POLICY', 'Evidence: directory users/groups, organizational units, Group Policy, and access support.', 'Active Directory · Users/Groups · OU · GPO'],
  noc: ['TICKETING & NOC OPERATIONS', 'Evidence: ticket-based incident handling from impact and priority through work notes, escalation, validation, and closure.', 'Incident queue · updates · vendor handoff · resolution notes'],
  field: ['CABLING, SAT & FIELD DELIVERY', 'Evidence: structured cabling and cable dressing, Site Acceptance Testing, commissioning checks, and vendor coordination through handover.', 'Cabling · SAT · commissioning · vendor follow-up'],
  iac: ['NETWORK AS CODE', 'Learning direction: versioned intent, reviewable changes, and repeatable configuration.', 'Git · YAML · Ansible · Python'],
  airport: ['AIRPORT IT SYSTEMS', 'Evidence: deployment and support for connected passenger-facing infrastructure.', 'Cisco · Ruckus · Sophos · FIDS'],
  surveillance: ['VIDEO SURVEILLANCE', 'Evidence: CCTV service support and DVR/NVR/VMS troubleshooting.', '300+ Honeywell cameras · DVR/NVR · VMS'],
  telephony: ['TELECOM & PHONE SYSTEMS', 'Evidence: support and coordination across analog and IP phone services, EPABX, public-address systems, and ISP dependencies.', 'Analog phones · IP phones · EPABX · PA'],
  isp: ['ISP & WAN OPERATIONS', 'Evidence: ISP coordination and LAN/WAN incident path checks.', 'WAN · VPN · routing · escalation']
};
document.querySelectorAll('.skill-options [data-skill]').forEach((button) => {
  button.addEventListener('click', () => {
    const item = skillEvidence[button.dataset.skill];
    if (!item) return;
    document.querySelectorAll('.skill-options [data-skill]').forEach((other) => other.classList.toggle('is-active', other === button));
    const readout = document.querySelector('#skill-readout');
    if (!readout) return;
    readout.replaceChildren(...item.map((text, index) => {
      const part = document.createElement(index === 0 ? 'b' : index === 1 ? 'span' : 'small');
      part.textContent = text;
      return part;
    }));
  });
});

const interviewRound = { index: 0, score: 0, streak: 0, answered: false, order: [] };
const interviewQuestion = document.querySelector('#quiz-question');
const interviewOptions = document.querySelector('#quiz-options');
const interviewShuffle = (items) => items.map((item) => [Math.random(), item]).sort((a, b) => a[0] - b[0]).map((item) => item[1]);
function startInterviewRound() {
  if (!interviewQuestion || !interviewOptions || !interviewQuestionBank.length) return;
  interviewRound.index = 0; interviewRound.score = 0; interviewRound.streak = 0; interviewRound.answered = false;
  interviewRound.order = interviewShuffle([...Array(interviewQuestionBank.length).keys()]).slice(0, 10);
  document.querySelector('#quiz-score').textContent = '0';
  document.querySelector('#quiz-streak').textContent = '0';
  document.querySelector('#quiz-status').textContent = 'READY';
  renderInterviewQuestion();
}
function renderInterviewQuestion() {
  const item = interviewQuestionBank[interviewRound.order[interviewRound.index]];
  if (!item) return;
  interviewRound.answered = false;
  interviewQuestion.textContent = item[0];
  document.querySelector('#quiz-category').textContent = item[3];
  document.querySelector('#quiz-level').textContent = interviewRound.index % 3 === 0 ? 'SCENARIO' : 'INTERVIEW LEVEL';
  document.querySelector('#quiz-progress').textContent = `${interviewRound.index + 1} / 10`;
  document.querySelector('#quiz-feedback').textContent = 'Choose the best answer.';
  interviewOptions.replaceChildren();
  interviewShuffle(item[1].map((answer, answerIndex) => ({ answer, answerIndex }))).forEach(({ answer, answerIndex }) => {
    const option = document.createElement('button');
    option.className = 'quiz-option';
    const letter = document.createElement('span');
    letter.textContent = String.fromCharCode(65 + answerIndex);
    option.append(letter, document.createTextNode(answer));
    option.addEventListener('click', () => answerInterviewQuestion(option, answerIndex, item));
    interviewOptions.append(option);
  });
}
function answerInterviewQuestion(selectedButton, answerIndex, item) {
  if (interviewRound.answered) return;
  interviewRound.answered = true;
  const options = [...interviewOptions.querySelectorAll('button')];
  options.forEach((option) => { option.disabled = true; });
  const feedback = document.querySelector('#quiz-feedback');
  if (answerIndex === item[2]) {
    selectedButton.classList.add('correct');
    interviewRound.score += 10 + interviewRound.streak * 2;
    interviewRound.streak += 1;
    feedback.textContent = 'Correct — strong engineering instinct. Next question loading…';
    document.querySelector('#quiz-status').textContent = 'ANSWER ACCEPTED';
  } else {
    selectedButton.classList.add('incorrect');
    options.find((option) => option.textContent.slice(1) === item[1][item[2]])?.classList.add('correct');
    interviewRound.streak = 0;
    feedback.textContent = `Not quite. Correct answer: ${item[1][item[2]]}`;
    document.querySelector('#quiz-status').textContent = 'REVIEW REQUIRED';
  }
  document.querySelector('#quiz-score').textContent = String(interviewRound.score);
  document.querySelector('#quiz-streak').textContent = String(interviewRound.streak);
  window.setTimeout(() => {
    interviewRound.index += 1;
    if (interviewRound.index >= 10) {
      interviewQuestion.textContent = `Session complete — ${interviewRound.score} points`;
      document.querySelector('#quiz-category').textContent = 'RESULTS';
      document.querySelector('#quiz-level').textContent = '10 RANDOM QUESTIONS';
      document.querySelector('#quiz-progress').textContent = '10 / 10';
      document.querySelector('#quiz-status').textContent = 'SESSION COMPLETE';
      document.querySelector('#quiz-feedback').textContent = 'Start a new session whenever you are ready.';
      interviewOptions.replaceChildren();
    } else renderInterviewQuestion();
  }, 950);
}
document.querySelector('#quiz-reset')?.addEventListener('click', startInterviewRound);
startInterviewRound();

const topologyCanvas = document.querySelector('#builder-canvas');
let selectedLabNode = null;
let labLinks = 0;
function refreshTopologyStatus() {
  const deviceCount = topologyCanvas?.querySelectorAll('.builder-node').length || 0;
  const status = document.querySelector('#builder-status');
  if (status) status.textContent = `${deviceCount} devices · ${labLinks} links`;
}
function addTopologyDevice(name) {
  if (!topologyCanvas) return;
  topologyCanvas.querySelector('.canvas-hint')?.remove();
  const device = document.createElement('button');
  device.type = 'button';
  device.className = 'builder-node';
  device.textContent = name;
  device.setAttribute('aria-label', `Select ${name} in simulated topology`);
  device.addEventListener('click', () => {
    if (!selectedLabNode || selectedLabNode === device || !selectedLabNode.isConnected) {
      topologyCanvas.querySelectorAll('.builder-node').forEach((node) => node.classList.remove('is-selected'));
      selectedLabNode = device;
      device.classList.add('is-selected');
      return;
    }
    const link = document.createElement('span');
    link.className = 'builder-connection';
    link.textContent = `${selectedLabNode.textContent} ↔ ${device.textContent}`;
    topologyCanvas.querySelector('.builder-connections')?.append(link);
    selectedLabNode.classList.remove('is-selected');
    selectedLabNode = null;
    labLinks += 1;
    refreshTopologyStatus();
  });
  topologyCanvas.insertBefore(device, topologyCanvas.querySelector('.builder-connections') || null);
  if (!topologyCanvas.querySelector('.builder-connections')) {
    const links = document.createElement('div');
    links.className = 'builder-connections';
    topologyCanvas.append(links);
  }
  refreshTopologyStatus();
}
document.querySelectorAll('.builder-tools [data-device]').forEach((button) => {
  button.addEventListener('click', () => addTopologyDevice(button.dataset.device));
  button.addEventListener('dragstart', (event) => event.dataTransfer?.setData('text/plain', button.dataset.device));
});
topologyCanvas?.addEventListener('dragover', (event) => event.preventDefault());
topologyCanvas?.addEventListener('drop', (event) => {
  event.preventDefault();
  const name = event.dataTransfer?.getData('text/plain');
  if (['Router', 'Switch', 'Firewall', 'Server'].includes(name)) addTopologyDevice(name);
});
document.querySelector('#builder-reset')?.addEventListener('click', () => {
  if (!topologyCanvas) return;
  topologyCanvas.replaceChildren(Object.assign(document.createElement('span'), { className: 'canvas-hint', textContent: 'DROP OR ADD DEVICE HERE' }));
  selectedLabNode = null; labLinks = 0; refreshTopologyStatus();
});
document.querySelector('#diff-review')?.addEventListener('click', () => {
  const result = document.querySelector('#diff-output');
  if (result) result.textContent = 'SAMPLE REVIEW · confirm that VLAN 10/20 are intended; verify DHCP snooping trust is only on a trusted uplink; compare against approved change scope before applying.';
});

document.querySelectorAll('.zone-buttons [data-zone]').forEach((button) => {
  button.addEventListener('click', () => {
    const prompts = {
      terminal: 'Sample area · FIDS/display service: check endpoint status, DNS, application response, and service freshness.',
      security: 'Sample area · wireless access: check client authentication, AP state, VLAN mapping, and radius reachability.',
      server: 'Sample area · core/server services: review interface state, route path, directory service, and host health.',
      cctv: 'Sample area · CCTV/VMS: check PoE and link, VLAN reachability, camera registration, and monitoring alerts.'
    };
    const readout = document.querySelector('#zone-readout');
    if (readout) readout.textContent = prompts[button.dataset.zone] || 'Select a sample service area.';
    document.querySelectorAll('.zone-buttons [data-zone]').forEach((item) => item.classList.toggle('is-active', item === button));
  });
});
