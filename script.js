const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
const networkClock = document.querySelector('#network-clock');
const packetCount = document.querySelector('#packet-count');
const throughput = document.querySelector('#throughput');
const networkLatency = document.querySelector('#network-latency');
const networkStatus = document.querySelector('#network-status');
const mapSimulate = document.querySelector('#map-simulate');
let networkSeconds = 24;
setInterval(() => {
  networkSeconds = (networkSeconds + 1) % 3600;
  if (networkClock) networkClock.firstChild.textContent = `${String(Math.floor(networkSeconds / 60)).padStart(2, '0')}:${String(networkSeconds % 60).padStart(2, '0')} `;
  if (packetCount) packetCount.textContent = `${(18426 + Math.floor(Math.random() * 180)).toLocaleString()}`;
  if (throughput) throughput.textContent = `${780 + Math.floor(Math.random() * 140)} Mbps`;
}, 1200);
mapSimulate?.addEventListener('click', () => {
  if (!networkStatus || !networkLatency || !mapSimulate) return;
  networkStatus.textContent = 'Health check complete · all systems nominal';
  networkLatency.textContent = `${(2 + Math.random() * 1.2).toFixed(1)}ms`;
  mapSimulate.textContent = 'CHECK COMPLETE ✓';
  mapSimulate.classList.add('is-complete');
  setTimeout(() => { mapSimulate.textContent = 'RUN HEALTH CHECK ↻'; mapSimulate.classList.remove('is-complete'); }, 2200);
});
const networkCursor = document.querySelector('.network-cursor');
if (networkCursor && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('pointermove', (event) => {
    networkCursor.style.setProperty('--cursor-x', `${event.clientX}px`);
    networkCursor.style.setProperty('--cursor-y', `${event.clientY}px`);
  });
  document.addEventListener('pointerdown', () => {
    networkCursor.classList.remove('is-pulsing');
    requestAnimationFrame(() => networkCursor.classList.add('is-pulsing'));
  });
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('mobile-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('mobile-open');
  });
});

const progress = document.querySelector('.scroll-progress');
let progressFrame = 0;
const updateScrollProgress = () => {
  progressFrame = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
};
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateScrollProgress);
}, { passive: true });
updateScrollProgress();

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const cliResponses = {
  'show version': 'Cisco IOS XE Software, Version 17.09.04\nSW-CORE uptime is 1 year, 184 days\nModel: Catalyst 9300 · image: CAT9K_IOSXE',
  'show vlan brief': 'VLAN  Name                 Status    Ports\n10    MGMT                 active    Gi1/0/1-4\n20    FIDS                 active    Gi1/0/5-12\n30    CCTV                 active    Gi1/0/13-24\n40    GUEST-WIFI           active    Gi1/0/25-36',
  'show ip route': 'O    10.0.10.0/24 [110/2] via 10.0.0.2, Vlan10\nO    10.0.20.0/24 [110/2] via 10.0.0.2, Vlan20\nC    10.0.0.0/30 is directly connected, Gi1/1/1\nGateway of last resort is 10.0.0.2',
  'show interfaces status': 'Port      Name       Status       Vlan  Duplex  Speed\nGi1/0/1   AD-DNS     connected    10    a-full  a-1000\nGi1/0/5   FIDS-APP   connected    20    a-full  a-1000\nGi1/0/13  CCTV-NVR   connected    30    a-full  a-1000\nGi1/1/1   DIST-A     connected    trunk a-full  a-10000',
  'show spanning-tree': 'VLAN0020\nRoot ID    Priority 24596  Address 00:aa:bb:cc:20:01\nThis bridge is the root\nGi1/1/1  Desg FWD 10  P2p',
  'ping 10.0.20.15': 'Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 10.0.20.15...\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 2/3/5 ms'
};
const runCliCommand = (command) => {
  const output = document.querySelector('#cli-output');
  const normalized = command.trim().toLowerCase();
  if (output) output.textContent = cliResponses[normalized] || `% Invalid input detected at '^' marker.\nTry: show version, show vlan brief, show ip route, ping 10.0.20.15`;
};
document.querySelectorAll('.console-actions button').forEach((button) => button.addEventListener('click', () => runCliCommand(button.dataset.command)));
document.querySelector('#cli-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#cli-input');
  if (input) { runCliCommand(input.value); input.value = ''; }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const quizQuestions = [
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
const quiz = { index: 0, score: 0, streak: 0, answered: false, order: [] };
const questionEl = document.querySelector('#game-question');
const optionsEl = document.querySelector('#quiz-options');
const progressEl = document.querySelector('#game-progress');
const scoreEl = document.querySelector('#game-score');
const streakEl = document.querySelector('#game-streak');
const categoryEl = document.querySelector('#game-category');
const statusEl = document.querySelector('#game-status');
const difficultyEl = document.querySelector('#game-difficulty');
const messageEl = document.querySelector('#game-message');
const shuffle = (items) => items.map((item) => [Math.random(), item]).sort((a, b) => a[0] - b[0]).map((item) => item[1]);
const renderQuestion = () => {
  const item = quizQuestions[quiz.order[quiz.index]];
  quiz.answered = false;
  questionEl.textContent = item[0];
  categoryEl.textContent = item[3];
  difficultyEl.textContent = quiz.index % 3 === 0 ? 'SCENARIO' : 'INTERVIEW LEVEL';
  progressEl.textContent = `${quiz.index + 1} / 10`;
  messageEl.textContent = 'Choose the best answer.';
  optionsEl.innerHTML = '';
  shuffle(item[1].map((answer, answerIndex) => ({ answer, answerIndex }))).forEach(({ answer, answerIndex }) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.innerHTML = `<span>${String.fromCharCode(65 + answerIndex)}</span>${answer}`;
    button.addEventListener('click', () => answerQuestion(button, answerIndex, item[2]));
    optionsEl.appendChild(button);
  });
};
const answerQuestion = (button, answerIndex, correctIndex) => {
  if (quiz.answered) return;
  quiz.answered = true;
  const buttons = [...optionsEl.querySelectorAll('button')];
  buttons.forEach((item) => { item.disabled = true; });
  if (answerIndex === correctIndex) {
    button.classList.add('correct');
    quiz.score += 10 + quiz.streak * 2;
    quiz.streak += 1;
    messageEl.textContent = 'Correct — strong engineering instinct. Next question loading...';
    statusEl.textContent = 'ANSWER ACCEPTED';
  } else {
    button.classList.add('incorrect');
    buttons.find((item) => item.textContent.slice(1) === quizQuestions[quiz.order[quiz.index]][1][correctIndex])?.classList.add('correct');
    quiz.streak = 0;
    messageEl.textContent = `Not quite. Correct answer: ${quizQuestions[quiz.order[quiz.index]][1][correctIndex]}`;
    statusEl.textContent = 'REVIEW REQUIRED';
  }
  scoreEl.textContent = quiz.score;
  streakEl.textContent = quiz.streak;
  setTimeout(() => { quiz.index += 1; if (quiz.index >= 10) finishQuiz(); else renderQuestion(); }, 1100);
};
const finishQuiz = () => {
  questionEl.textContent = `Session complete — ${quiz.score} points`;
  categoryEl.textContent = 'RESULTS';
  difficultyEl.textContent = '10 RANDOM QUESTIONS';
  optionsEl.innerHTML = '<div class="quiz-result">You completed a randomized interview set. Reset to test another route through the 100-question bank.</div>';
  progressEl.textContent = '10 / 10';
  statusEl.textContent = 'SESSION COMPLETE';
  messageEl.textContent = 'New session is ready when you are.';
};
const newQuiz = () => { quiz.index = 0; quiz.score = 0; quiz.streak = 0; quiz.order = shuffle([...Array(quizQuestions.length).keys()]); scoreEl.textContent = '0'; streakEl.textContent = '0'; renderQuestion(); };
document.querySelector('#game-reset')?.addEventListener('click', newQuiz);
if (questionEl && optionsEl) newQuiz();

const failureState = new Set();
const failureLinks = { edge: ['link-core-edge'], firewall: ['link-core-fw'], wireless: ['link-core-ap'], server: ['link-core-server', 'link-dist-a-servers', 'link-dist-b-servers'], link: ['link-core-dist-a', 'link-core-dist-b'], stp: ['link-dist-a-access-a', 'link-dist-a-access-b', 'link-dist-b-access-c', 'link-dist-b-access-d'], dhcp: ['link-dist-a-servers'], traffic: [] };
const failureMessages = {
  edge: 'Edge router unreachable — OSPF adjacency lost. Traffic is rerouting through the backup path.',
  firewall: 'Firewall isolated — Sophos HA failover required. Secure zones are currently degraded.',
  wireless: 'Wireless controller unavailable — Ruckus AP clients are offline. Wired services remain nominal.',
  server: 'Server farm stopped — AD and FIDS dependencies are unavailable. Network fabric remains healthy.',
  link: 'Distribution trunk degraded — traffic is taking the alternate path with increased latency.',
  stp: 'STP loop detected — broadcast protection is converging and access ports are rate-limited.',
  dhcp: 'DHCP/NTP service unavailable — new clients are receiving APIPA addresses until recovery.',
  traffic: 'Traffic spike injected — simulated throughput is above threshold and packet loss is rising.',
  'dist-a': 'DIST-A unavailable — VLAN gateways are reconverging through DIST-B.',
  'dist-b': 'DIST-B unavailable — redundant gateway path is carrying the simulated load.',
  wlc: 'Wireless controller unavailable — Ruckus APs are isolated from the management plane.',
  lb: 'Load balancer unhealthy — FIDS web sessions are draining to the backup pool.',
  'access-a': 'SW-01 access switch offline — VLAN 20 endpoints are unreachable.',
  'access-b': 'SW-02 access switch offline — VLAN 30 endpoints are unreachable.',
  'access-c': 'SW-03 access switch offline — VLAN 40 endpoints are unreachable.',
  'access-d': 'SW-04 access switch offline — VLAN 50 endpoints are unreachable.',
  ad: 'AD/DNS service unavailable — authentication and name resolution are degraded.',
  fids: 'FIDS application unavailable — passenger display updates are paused.',
  cctv: 'CCTV/NVR service unavailable — camera recording is degraded.',
  nms: 'NMS/Zabbix unavailable — monitoring visibility is reduced.',
  backup: 'Backup node unavailable — scheduled protection jobs are paused.'
};
const labLatency = document.querySelector('#lab-latency');
const labLoss = document.querySelector('#lab-loss');
const labPackets = document.querySelector('#lab-packets');
let labReplayTimer;
const gameObjective = document.querySelector('#game-objective');
const gameGuidance = document.querySelector('#game-guidance');
const gameScore = document.querySelector('#game-score');
const gameTime = document.querySelector('#game-time');
const startMission = document.querySelector('#start-mission');
const missionSequence = ['edge', 'firewall', 'server', 'dhcp'];
let missionIndex = -1;
let missionScore = 0;
let missionSeconds = 90;
let missionTimer;
const missionLabels = { edge: 'Triage the unreachable edge router and recover OSPF adjacency.', firewall: 'Validate the Sophos HA state and restore secure traffic.', server: 'Recover the airport server farm without touching the network fabric.', dhcp: 'Restore DHCP/NTP so affected clients can rejoin the network.' };
const missionGuidance = {
  edge: 'Symptom: external routes are missing. Check reachability and restore the routing edge first.',
  firewall: 'Symptom: secure-zone traffic is degraded. Fail over the standby unit and preserve policy continuity.',
  server: 'Symptom: AD and FIDS are unavailable. Restore services, not switches, to limit the blast radius.',
  dhcp: 'Symptom: new clients have APIPA addresses. Restore address assignment and time synchronization.'
};
const finishMission = (message) => {
  clearInterval(missionTimer);
  if (gameObjective) gameObjective.textContent = message;
  if (gameGuidance) gameGuidance.textContent = 'Training outcome: correlate symptoms, choose the smallest safe action, and verify recovery.';
  if (startMission) startMission.textContent = 'Replay mission ↻';
};
const startMissionGame = () => {
  clearInterval(missionTimer);
  failureState.clear();
  missionIndex = 0;
  missionScore = 0;
  missionSeconds = 90;
  if (gameScore) gameScore.textContent = '0';
  if (gameTime) gameTime.textContent = '90s';
  failureState.add(missionSequence[missionIndex]);
  if (gameObjective) gameObjective.textContent = `INCIDENT 1 / 4 — ${missionLabels[missionSequence[missionIndex]]}`;
  if (gameGuidance) gameGuidance.textContent = missionGuidance[missionSequence[missionIndex]];
  renderFailureState();
  missionTimer = setInterval(() => {
    missionSeconds -= 1;
    if (gameTime) gameTime.textContent = `${missionSeconds}s`;
    if (missionSeconds <= 0) {
      finishMission(`MISSION FAILED — ${missionScore} points. Restore the lab and try again.`);
      renderFailureState();
    }
  }, 1000);
};
const renderFailureState = () => {
  document.querySelectorAll('.failure-node').forEach((node) => node.classList.toggle('is-failed', failureState.has(node.dataset.node)));
  document.querySelectorAll('.failure-link').forEach((link) => {
    const failed = [...failureState].some((fault) => (failureLinks[fault] || []).some((name) => link.classList.contains(name)));
    link.style.opacity = failed ? '0.18' : '1';
    link.style.background = failed ? '#ff806d' : '';
  });
  const health = document.querySelector('#failure-health');
  if (health) {
    health.textContent = failureState.size ? `● ${failureState.size} ACTIVE FAULT${failureState.size > 1 ? 'S' : ''}` : '● NOMINAL';
    health.style.color = failureState.size ? '#ff806d' : '';
  }
  const severity = [...failureState].reduce((total, fault) => total + (fault === 'traffic' ? 2.5 : fault === 'stp' ? 1.8 : 0.7), 0);
  if (labLatency) labLatency.textContent = `${(2.4 + severity * 4 + Math.random() * 1.6).toFixed(1)}ms`;
  if (labLoss) labLoss.textContent = `${Math.min(18, severity * 1.7 + Math.random() * .7).toFixed(1)}%`;
};
document.querySelectorAll('.sim-control[data-fault]').forEach((button) => {
  button.addEventListener('click', () => {
    const fault = button.dataset.fault;
    failureState.add(fault);
    const log = document.querySelector('#failure-log');
    if (log) log.textContent = `[alert] ${failureMessages[fault]}\n[action] Investigate telemetry, isolate scope, restore safely.`;
    renderFailureState();
  });
});
document.querySelector('#reset-failures')?.addEventListener('click', () => {
  clearInterval(missionTimer);
  missionIndex = -1;
  failureState.clear();
  const log = document.querySelector('#failure-log');
  if (log) log.textContent = '[recovery] All devices restored. Links healthy and services nominal.';
  renderFailureState();
});
startMission?.addEventListener('click', startMissionGame);
const toggleFailure = (node) => {
    const fault = node.dataset.node;
    if (fault === 'core') return;
    const wasFailed = failureState.has(fault);
    wasFailed ? failureState.delete(fault) : failureState.add(fault);
    if (wasFailed && missionIndex >= 0 && fault === missionSequence[missionIndex]) {
      missionScore += Math.max(100, missionSeconds * 5);
      missionIndex += 1;
      if (gameScore) gameScore.textContent = String(missionScore);
      if (missionIndex >= missionSequence.length) {
        finishMission(`MISSION COMPLETE — ${missionScore} points. Airport services stabilized.`);
      } else {
        const nextFault = missionSequence[missionIndex];
        failureState.add(nextFault);
        if (gameObjective) gameObjective.textContent = `INCIDENT ${missionIndex + 1} / 4 — ${missionLabels[nextFault]}`;
        if (gameGuidance) gameGuidance.textContent = missionGuidance[nextFault];
      }
    }
    const log = document.querySelector('#failure-log');
    if (log) log.textContent = failureState.has(fault) ? `[alert] ${failureMessages[fault]}` : `[recovery] ${node.textContent.split('\n')[0]} restored.`;
    renderFailureState();
};
document.querySelectorAll('.failure-node').forEach((node) => {
  node.addEventListener('click', () => toggleFailure(node));
  node.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleFailure(node); } });
});
document.querySelector('#run-traffic-test')?.addEventListener('click', () => {
  const log = document.querySelector('#failure-log');
  if (log) log.textContent = '[trace] 10.0.0.1 → DIST-A → SW-02 → FIDS APP\n[reply] 4 packets transmitted, 4 received, 0.0% loss\n[result] Simulated path healthy.';
  if (labPackets) labPackets.textContent = `${(1842 + Math.floor(Math.random() * 240)).toLocaleString()}`;
});
document.querySelector('#replay-incident')?.addEventListener('click', () => {
  clearInterval(labReplayTimer);
  const sequence = ['link', 'dhcp', 'traffic'];
  let step = 0;
  failureState.clear();
  labReplayTimer = setInterval(() => {
    if (step >= sequence.length) { clearInterval(labReplayTimer); return; }
    const fault = sequence[step++];
    failureState.add(fault);
    const log = document.querySelector('#failure-log');
    if (log) log.textContent = `[replay ${step}/3] ${failureMessages[fault]}\n[action] Observe telemetry, isolate scope, restore safely.`;
    renderFailureState();
  }, 850);
});
setInterval(() => {
  if (!labPackets) return;
  const activePenalty = [...failureState].length;
  labPackets.textContent = `${(1842 + Math.floor(Math.random() * 240)).toLocaleString()}`;
  if (labLatency) labLatency.textContent = `${(2.4 + activePenalty * 1.8 + Math.random() * 1.2).toFixed(1)}ms`;
  if (labLoss && !failureState.has('traffic')) labLoss.textContent = `${(activePenalty * .4 + Math.random() * .3).toFixed(1)}%`;
}, 1400);

const copilotPlans = {
  ospf: { severity: 'P1 · HIGH', confidence: '92%', lines: ['[signal] OSPF neighbors dropped', '[likely cause] WAN/interface, MTU or authentication mismatch', '[triage] show ip ospf neighbor → show interfaces → ping next hop', '[action] Restore the smallest failed link, then verify adjacency and routes.'], evidence: ['Neighbor state and last reset reason', 'Interface errors, MTU and authentication', 'Next-hop reachability and route table'] },
  dhcp: { severity: 'P1 · HIGH', confidence: '89%', lines: ['[signal] Clients have 169.254.x.x addresses', '[likely cause] DHCP scope, relay or server reachability', '[triage] show ip interface → verify helper-address → test DHCP server', '[action] Restore DHCP/NTP service, renew one client, then monitor the scope.'], evidence: ['Client lease and DHCP scope health', 'Relay/helper-address on the SVI', 'Server reachability and service logs'] },
  wifi: { severity: 'P2 · MEDIUM', confidence: '86%', lines: ['[signal] Ruckus clients fail authentication', '[likely cause] WLC/RADIUS path or VLAN assignment', '[triage] check AP join state → test RADIUS → validate WLAN VLAN', '[action] Recover control-plane access before changing wireless policy.'], evidence: ['AP join and controller reachability', 'RADIUS response and shared-secret status', 'WLAN-to-VLAN assignment and DHCP'] },
  cctv: { severity: 'P1 · HIGH', confidence: '88%', lines: ['[signal] Multiple cameras unreachable', '[likely cause] CCTV VLAN, PoE/access switch or NVR path', '[triage] test gateway → inspect switch port/PoE → verify NVR service', '[action] Isolate one zone and restore service without disturbing FIDS.'], evidence: ['Affected camera zone and switch ports', 'PoE budget and access VLAN state', 'NVR reachability and recording status'] },
  fids: { severity: 'P1 · HIGH', confidence: '84%', lines: ['[signal] Passenger displays are stale', '[likely cause] FIDS app, DNS or upstream service path', '[triage] ping app → resolve DNS → inspect service health and logs', '[action] Recover the application dependency, then confirm display updates.'], evidence: ['Display heartbeat and application queue', 'DNS resolution from the FIDS VLAN', 'Upstream service logs and timestamps'] }
};
const renderCopilotPlan = () => {
  const signal = document.querySelector('#copilot-symptom')?.value;
  const plan = copilotPlans[signal];
  const output = document.querySelector('#copilot-output');
  const severity = document.querySelector('#copilot-severity');
  const confidence = document.querySelector('#copilot-confidence');
  const evidence = document.querySelector('#copilot-evidence');
  if (!plan) return;
  if (output) output.textContent = plan.lines.join('\n');
  if (severity) severity.textContent = `SEVERITY ${plan.severity}`;
  if (confidence) confidence.textContent = `CONFIDENCE ${plan.confidence}`;
  if (evidence) evidence.innerHTML = plan.evidence.map((item) => `<span>□ ${item}</span>`).join('');
};
document.querySelector('#copilot-run')?.addEventListener('click', renderCopilotPlan);
document.querySelector('#copilot-symptom')?.addEventListener('change', renderCopilotPlan);

const commandMode = document.querySelector('#command-mode');
commandMode?.addEventListener('click', () => {
  document.body.classList.toggle('command-mode-active');
  commandMode.textContent = document.body.classList.contains('command-mode-active') ? 'Exit command center Esc' : 'Enter full-screen mode ⛶';
  if (document.body.classList.contains('command-mode-active')) document.querySelector('#command-center')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('command-mode-active')) {
    document.body.classList.remove('command-mode-active');
    if (commandMode) commandMode.textContent = 'Enter full-screen mode ⛶';
  }
});
document.querySelectorAll('.alert-row').forEach((row) => row.addEventListener('click', () => {
  document.querySelectorAll('.alert-row').forEach((item) => item.classList.remove('active'));
  row.classList.add('active');
  const status = document.querySelector('#command-status');
  if (status) status.textContent = `[selected] ${row.querySelector('b')?.textContent || 'Incident'} · choose an action below.`;
}));
document.querySelectorAll('[data-incident-action]').forEach((button) => button.addEventListener('click', () => {
  const active = document.querySelector('.alert-row.active');
  const name = active?.querySelector('b')?.textContent || 'Selected incident';
  const action = button.dataset.incidentAction;
  const status = document.querySelector('#command-status');
  if (status) status.textContent = `[${action}] ${name} · workflow state updated locally.`;
  if (action === 'resolve' && active) active.classList.add('resolved');
}));
document.querySelectorAll('.map-zone').forEach((zone) => zone.addEventListener('click', () => {
  const signal = zone.dataset.zone;
  const select = document.querySelector('#copilot-symptom');
  if (select && copilotPlans[signal]) { select.value = signal; renderCopilotPlan(); }
  const readout = document.querySelector('#zone-readout');
  if (readout) readout.textContent = `ZONE ${zone.textContent.split('\n')[0].trim()} · INCIDENT LOADED INTO COPILOT`;
  document.querySelector('#ops-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

const tracePacket = document.querySelector('#trace-packet');
tracePacket?.addEventListener('click', () => {
  const source = document.querySelector('#packet-source')?.value.split(' · ')[0] || 'Client';
  const destination = document.querySelector('#packet-destination')?.value.split(' · ')[0] || 'Server';
  const log = document.querySelector('#journey-log');
  const track = document.querySelector('#journey-track');
  if (track) { track.classList.remove('is-tracing'); requestAnimationFrame(() => track.classList.add('is-tracing')); }
  if (log) log.textContent = `[trace] ${source} → ACCESS → DISTRIBUTION → CORE → FIREWALL → ${destination}\n[result] 6 hops · policy permitted · 3.1ms simulated RTT`;
});
document.querySelector('#scan-diff')?.addEventListener('click', () => {
  const status = document.querySelector('#diff-status');
  if (status) status.textContent = '[risk] Review trunk conversion and DHCP snooping trust before approval.';
});

const passportCopy = {
  airport: 'AIRPORT · Cisco, Sophos, Ruckus, NOC operations and zero-downtime support.',
  wipro: 'WIPRO · SLA-driven application support, incident management and production troubleshooting.',
  arivani: 'ARIVANI · Python, JavaScript, REST APIs and production web application delivery.'
};
document.querySelectorAll('.passport-node').forEach((node) => node.addEventListener('click', () => {
  document.querySelectorAll('.passport-node').forEach((item) => item.classList.remove('active'));
  node.classList.add('active');
  const readout = document.querySelector('#passport-readout');
  if (readout) readout.textContent = passportCopy[node.dataset.passport];
}));

const terminalResponses = {
  'whoami': 'SOHIT VISHWAKARMA\\nNetwork & IT Infrastructure Engineer · L1/L2 · NOC Operations',
  'about sohit': 'Airport infrastructure engineer focused on reliable networks, safe automation and clear incident response.',
  'show achievements': '99%+ uptime · 20+ Cisco switches · 55+ Ruckus APs · 300+ CCTV cameras · 4h+ weekly automation impact',
  'show certifications': 'Sophos Network Engineering · FortiGate Administration · Cisco Networking · Cybersecurity simulations',
  'sudo hire sohit': 'ACCESS GRANTED ✓\\nRecommendation: schedule a technical conversation at isohitv@gmail.com'
};
document.querySelector('#portfolio-terminal-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#portfolio-terminal-input');
  const output = document.querySelector('#portfolio-terminal-output');
  const command = input?.value.trim().toLowerCase();
  if (output) output.textContent = terminalResponses[command] || 'Command not found. Try: whoami, about sohit, show achievements, show certifications, sudo hire sohit';
  if (input) input.value = '';
});

const replaySteps = [
  '[01] Alert received · NMS raised a trunk degradation signal.',
  '[02] Engineer action · isolated the affected VLAN and checked trunk state.',
  '[03] Root cause · native VLAN mismatch introduced packet loss.',
  '[04] Recovery · restored the approved trunk configuration and verified paths.',
  '[05] Prevention · added config-diff review to the automation runbook.'
];
let replayTimer = null;
document.querySelector('#replay-theatre-run')?.addEventListener('click', () => {
  const steps = document.querySelectorAll('.replay-step');
  const readout = document.querySelector('#replay-readout');
  let index = 0;
  if (replayTimer) clearInterval(replayTimer);
  steps.forEach((step) => step.classList.remove('active', 'complete'));
  replayTimer = setInterval(() => {
    steps.forEach((step, stepIndex) => step.classList.toggle('complete', stepIndex < index));
    if (steps[index]) steps[index].classList.add('active');
    if (readout) readout.textContent = replaySteps[index] || replaySteps[replaySteps.length - 1];
    index += 1;
    if (index >= replaySteps.length) { clearInterval(replayTimer); replayTimer = null; }
  }, 700);
});

const radarData = {
  routing: ['ROUTING & SWITCHING', 'Project: MVI Airport Network Deployment', 'Cisco Catalyst · OSPF · VLAN · STP/RSTP'],
  security: ['SECURITY & VPN', 'Case study: Sophos Firewall HA and secure airport zones', 'Sophos · FortiGate · IPsec · NAT · IPS'],
  automation: ['AUTOMATION', 'Project: Repeatable network backup and compliance workflow', 'Python · Netmiko · NAPALM · Ansible · Git'],
  noc: ['NOC OPERATIONS', 'Case study: 24/7 airport monitoring and incident response', 'Infron NMS · Zabbix · Wireshark · RCA']
};
document.querySelectorAll('.radar-option').forEach((option) => option.addEventListener('click', () => {
  document.querySelectorAll('.radar-option').forEach((item) => item.classList.remove('active'));
  option.classList.add('active');
  const data = radarData[option.dataset.skill];
  const readout = document.querySelector('#radar-readout');
  if (readout && data) readout.innerHTML = `<b>${data[0]}</b><span>${data[1]}</span><small>${data[2]}</small>`;
}));

const builderCanvas = document.querySelector('#builder-canvas');
const builderStatus = document.querySelector('#builder-status');
let builderCount = 0;
let builderSelected = null;
const builderConnections = [];
const builderLinkSvg = builderCanvas?.querySelector('.builder-links');
const renderBuilderLinks = () => {
  if (!builderLinkSvg || !builderCanvas) return;
  const bounds = builderCanvas.getBoundingClientRect();
  builderLinkSvg.setAttribute('viewBox', `0 0 ${builderCanvas.clientWidth} ${builderCanvas.clientHeight}`);
  builderLinkSvg.innerHTML = builderConnections.map(([from, to]) => {
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const x1 = a.left - bounds.left + a.width / 2;
    const y1 = a.top - bounds.top + a.height / 2;
    const x2 = b.left - bounds.left + b.width / 2;
    const y2 = b.top - bounds.top + b.height / 2;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
  }).join('');
};
const updateBuilderStatus = () => {
  if (builderStatus) builderStatus.textContent = `${builderCount} devices · ${builderConnections.length} links`;
  const hint = builderCanvas?.querySelector('.canvas-hint');
  if (hint) hint.hidden = builderCount > 0;
  renderBuilderLinks();
};
const addBuilderDevice = (type, x = 20 + (builderCount % 4) * 82, y = 24 + Math.floor(builderCount / 4) * 58) => {
  if (!builderCanvas || builderCount >= 10) return;
  const device = document.createElement('button');
  device.type = 'button';
  device.className = 'canvas-device';
  device.dataset.device = type;
  device.style.left = `${Math.min(x, builderCanvas.clientWidth - 84)}px`;
  device.style.top = `${Math.min(y, builderCanvas.clientHeight - 48)}px`;
  device.innerHTML = `${type.toUpperCase()}<small>SIMULATED</small>`;
  device.addEventListener('click', () => {
    if (!builderSelected) { builderSelected = device; device.classList.add('selected'); return; }
    if (builderSelected === device) { device.classList.remove('selected'); builderSelected = null; return; }
    const duplicate = builderConnections.some(([from, to]) => (from === builderSelected && to === device) || (from === device && to === builderSelected));
    if (duplicate) { builderSelected.classList.remove('selected'); builderSelected = null; return; }
    builderConnections.push([builderSelected, device]);
    builderSelected.classList.remove('selected');
    builderSelected = null;
    updateBuilderStatus();
  });
  builderCanvas.appendChild(device);
  builderCount += 1;
  updateBuilderStatus();
};
document.querySelectorAll('#builder-tools button').forEach((tool) => {
  tool.addEventListener('dragstart', (event) => event.dataTransfer?.setData('text/plain', tool.dataset.device));
  tool.addEventListener('click', () => addBuilderDevice(tool.dataset.device));
});
builderCanvas?.addEventListener('dragover', (event) => { event.preventDefault(); builderCanvas.classList.add('is-over'); });
builderCanvas?.addEventListener('dragleave', () => builderCanvas.classList.remove('is-over'));
builderCanvas?.addEventListener('drop', (event) => {
  event.preventDefault();
  builderCanvas.classList.remove('is-over');
  const rect = builderCanvas.getBoundingClientRect();
  addBuilderDevice(event.dataTransfer?.getData('text/plain') || 'switch', event.clientX - rect.left - 40, event.clientY - rect.top - 20);
});
document.querySelector('#builder-reset')?.addEventListener('click', () => {
  builderCanvas?.querySelectorAll('.canvas-device').forEach((device) => device.remove());
  builderCount = 0; builderConnections.length = 0; builderSelected = null; updateBuilderStatus();
});
window.addEventListener('resize', renderBuilderLinks);

const runbookLogs = {
  backup: ['[precheck] 20 devices reachable via SSH', '[execute] collecting running-config from Catalyst estate', '[verify] checksums match and archive committed to Git', '[result] 20/20 backups complete · ROLLBACK READY'],
  ospf: ['[precheck] 12 OSPF neighbors discovered', '[execute] collecting adjacency, route and interface state', '[verify] all expected routes present · no flaps detected', '[result] topology health PASS · evidence exported'],
  vlan: ['[precheck] loading intended VLAN state from YAML', '[execute] comparing access and trunk ports', '[verify] 2 drift items detected and safely flagged', '[result] audit complete · change approval required']
};
const runbookTimeSaved = { backup: 'EST. TIME SAVED 4h+', ospf: 'EST. TIME SAVED 90m', vlan: 'EST. TIME SAVED 2h' };
let selectedRunbook = 'backup';
let runbookTimer = null;
const runbookProgress = (step, total, running = true) => {
  const bar = document.querySelector('#runbook-progress-bar');
  const label = document.querySelector('#runbook-progress-label');
  const button = document.querySelector('#run-runbook');
  if (bar) bar.style.width = `${Math.round((step / total) * 100)}%`;
  if (label) label.textContent = running ? `RUNNING · ${step}/${total}` : `COMPLETE · ${step}/${total}`;
  if (button) button.disabled = running;
};
document.querySelectorAll('.runbook-choice').forEach((choice) => choice.addEventListener('click', () => {
  if (runbookTimer) clearInterval(runbookTimer);
  document.querySelectorAll('.runbook-choice').forEach((item) => item.classList.remove('active'));
  choice.classList.add('active');
  selectedRunbook = choice.dataset.runbook;
  const saved = document.querySelector('#runbook-time-saved');
  if (saved) saved.textContent = runbookTimeSaved[selectedRunbook];
  runbookProgress(0, 4, false);
}));
document.querySelector('#run-runbook')?.addEventListener('click', () => {
  const log = document.querySelector('#runbook-log');
  const steps = runbookLogs[selectedRunbook];
  let index = 0;
  if (!log) return;
  if (runbookTimer) clearInterval(runbookTimer);
  log.textContent = '[start] dry run initialized...\n';
  runbookProgress(0, steps.length, true);
  runbookTimer = setInterval(() => {
    log.textContent += `${steps[index++]}\n`;
    runbookProgress(index, steps.length, index < steps.length);
    if (index >= steps.length) { clearInterval(runbookTimer); runbookTimer = null; }
  }, 550);
});
document.querySelector('#runbook-time-saved').textContent = runbookTimeSaved.backup;

const WEB3FORMS_ACCESS_KEY = '0cf72841-5646-4255-8636-320e160e44b8';

document.querySelector('#contact-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.querySelector('[name="name"]').value.trim();
  const email = form.querySelector('[name="email"]').value.trim();
  const message = form.querySelector('[name="message"]').value.trim();
  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  if (WEB3FORMS_ACCESS_KEY === 'PASTE_WEB3FORMS_ACCESS_KEY_HERE') {
    if (status) status.textContent = 'Contact form setup is incomplete. Add the Web3Forms access key.';
    return;
  }
  const payload = new FormData(form);
  payload.append('access_key', WEB3FORMS_ACCESS_KEY);
  payload.append('subject', `Portfolio enquiry from ${name}`);
  payload.append('from_name', 'Sohit Portfolio');
  if (submitButton) submitButton.disabled = true;
  if (status) status.textContent = 'Sending securely…';
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: payload,
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Message delivery failed.');
    form.reset();
    if (status) status.textContent = 'Message sent successfully. Thank you for reaching out.';
  } catch (error) {
    if (status) status.textContent = 'Message could not be sent. Please try again.';
    console.error('Contact form submission failed:', error);
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
