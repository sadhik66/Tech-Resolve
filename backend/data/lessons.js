module.exports = [
  { id: "network-basics", title: "Network Fundamentals", level: "Beginner", duration: "15 min",
    summary: "Understand how devices communicate across a network.",
    topics: ["A network connects devices so they can exchange data.", "A LAN covers a limited area such as a home, school or office.", "A WAN connects networks across larger geographic areas.", "A client requests a service; a server provides it."] },
  { id: "network-devices", title: "Network Devices", level: "Beginner", duration: "18 min",
    summary: "Learn the roles of routers, switches, access points and modems.",
    topics: ["A switch forwards frames within a local network using MAC addresses.", "A router forwards packets between different IP networks.", "A wireless access point lets Wi-Fi devices join a network.", "A modem connects a network to an internet service over the provider's access technology."] },
  { id: "ip-addressing", title: "IP Addressing", level: "Beginner", duration: "20 min",
    summary: "Learn IPv4 addresses, gateways, subnet masks and DNS.",
    topics: ["An IP address identifies an interface on an IP network.", "A subnet mask separates the network portion from the host portion of an IPv4 address.", "The default gateway is the router used to reach other networks.", "DNS translates domain names into IP addresses."] },
  { id: "protocols-ports", title: "Protocols and Ports", level: "Intermediate", duration: "20 min",
    summary: "Explore common application and transport protocols.",
    topics: ["TCP provides ordered, reliable byte-stream delivery.", "UDP is connectionless and has lower protocol overhead.", "HTTP commonly uses TCP port 80; HTTPS commonly uses TCP port 443.", "DNS commonly uses port 53 over UDP or TCP."] },
  { id: "troubleshooting", title: "Troubleshooting Method", level: "Beginner", duration: "15 min",
    summary: "Use a structured process to investigate connectivity problems.",
    topics: ["Identify the symptoms and ask what changed.", "Check physical or Wi-Fi connectivity and adapter status.", "Check IP configuration, gateway reachability and DNS separately.", "Change one thing at a time and verify whether the fix worked."] }
];
