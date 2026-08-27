const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');

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
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

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

const consoleMessages = {
  uptime: '> uptime: 99%+ | environment: mission-critical | status: nominal',
  stack: '> stack: Cisco · Sophos · Ruckus · Python · Zabbix · AWS',
  approach: '> approach: detect → isolate → analyze → resolve → prevent'
};
document.querySelectorAll('.console-actions button').forEach((button) => {
  button.addEventListener('click', () => {
    const output = document.querySelector('.console-output');
    if (output) output.textContent = consoleMessages[button.dataset.command];
  });
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
