
import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const localLessons = [
  {
    id: "network-basics",
    title: "Network Fundamentals",
    level: "Beginner",
    duration: "15 min",
    summary: "How devices communicate.",
    topics: [
      "A network connects devices so they can exchange data.",
      "A LAN covers a limited area such as a home, school or office.",
      "A WAN connects networks across larger geographic areas.",
      "A client requests a service; a server provides it."
    ]
  },
  {
    id: "network-devices",
    title: "Network Devices",
    level: "Beginner",
    duration: "18 min",
    summary: "Routers, switches, access points and modems.",
    topics: [
      "A switch forwards frames within a local network using MAC addresses.",
      "A router forwards packets between different IP networks.",
      "A wireless access point lets Wi-Fi devices join a network.",
      "A modem connects a network to an internet service provider."
    ]
  },
  {
    id: "ip-addressing",
    title: "IP Addressing",
    level: "Beginner",
    duration: "20 min",
    summary: "IPv4, gateways, subnet masks and DNS.",
    topics: [
      "An IP address identifies an interface on an IP network.",
      "A subnet mask separates network and host portions of an IPv4 address.",
      "The default gateway is the router used to reach other networks.",
      "DNS translates domain names into IP addresses."
    ]
  },
  {
    id: "protocols-ports",
    title: "Protocols and Ports",
    level: "Intermediate",
    duration: "20 min",
    summary: "Common protocols and transport services.",
    topics: [
      "TCP provides reliable, ordered delivery.",
      "UDP is connectionless and has lower protocol overhead.",
      "HTTP commonly uses TCP port 80; HTTPS commonly uses TCP port 443.",
      "DNS commonly uses port 53 over UDP or TCP."
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting Method",
    level: "Beginner",
    duration: "15 min",
    summary: "A structured way to investigate connectivity.",
    topics: [
      "Identify symptoms and ask what changed.",
      "Check physical or Wi-Fi connectivity and adapter status.",
      "Check IP configuration, gateway reachability and DNS separately.",
      "Change one thing at a time and verify the result."
    ]
  }
];

const questions = [
  {
    q: "Which device forwards traffic between different IP networks?",
    options: ["Switch", "Router", "Keyboard", "Repeater"],
    answer: 1,
    explain: "A router forwards packets between IP networks."
  },
  {
    q: "What does DNS do?",
    options: [
      "Encrypts files",
      "Translates domain names to IP addresses",
      "Assigns MAC addresses",
      "Measures Wi-Fi strength"
    ],
    answer: 1,
    explain: "DNS resolves human-readable domain names to IP addresses."
  },
  {
    q: "Which protocol provides reliable, ordered delivery?",
    options: ["TCP", "UDP", "ARP", "ICMP"],
    answer: 0,
    explain: "TCP provides reliable, ordered byte-stream delivery."
  },
  {
    q: "Which is the usual default HTTPS port?",
    options: ["21", "25", "80", "443"],
    answer: 3,
    explain: "HTTPS commonly uses TCP port 443."
  },
  {
    q: "What is the role of a default gateway?",
    options: [
      "Prints documents",
      "Routes traffic to other networks",
      "Stores passwords",
      "Creates web pages"
    ],
    answer: 1,
    explain: "The default gateway is the next-hop router for destinations outside the local network."
  }
];

const networkDevices = [
  {
    id: "internet",
    symbol: "☁",
    name: "Internet",
    subtitle: "External network",
    description:
      "The Internet is a global network of interconnected networks. It allows devices around the world to communicate and access online services."
  },
  {
    id: "router",
    symbol: "⇄",
    name: "Router",
    subtitle: "192.168.1.1",
    description:
      "A router forwards packets between different IP networks. It commonly acts as the default gateway for devices on a home or office network."
  },
  {
    id: "switch",
    symbol: "▤",
    name: "Switch",
    subtitle: "LAN connectivity",
    description:
      "A network switch connects wired devices within a local area network and forwards Ethernet frames using MAC addresses."
  },
  {
    id: "access-point",
    symbol: "◉",
    name: "Access Point",
    subtitle: "Wi-Fi",
    description:
      "A wireless access point allows Wi-Fi devices such as laptops and phones to connect to a local network."
  },
  {
    id: "client",
    symbol: "▣",
    name: "Client PC",
    subtitle: "192.168.1.10",
    description:
      "A client is an end device that uses network services. It can request websites, files and other resources from servers."
  }
];

function App() {
  const [page, setPage] = useState("home");
  const [lessons, setLessons] = useState(localLessons);
  const [selected, setSelected] = useState(localLessons[0]);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [notice, setNotice] = useState("");
  const [completed, setCompleted] = useState([]);
  const [bestScore, setBestScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [command, setCommand] = useState("");
  const [terminal, setTerminal] = useState([
    "Tech Resolve educational command simulator",
    "Type help to view available simulated commands."
  ]);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [scenarioDone, setScenarioDone] = useState(false);

  // Network visualizer selection
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    api("/lessons")
      .then(data => {
        if (data.lessons?.length) {
          setLessons(data.lessons);
          setSelected(data.lessons[0]);
        }
      })
      .catch(() => {});
      
    const token = localStorage.getItem("techResolveToken");

    if (token) {
      api("/auth/me")
        .then(data => setUser(data.user))
        .catch(() => localStorage.removeItem("techResolveToken"));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    api("/progress")
      .then(data => {
        setCompleted(data.progress.completedModules || []);
        setBestScore(data.progress.quizBestScore || 0);
      })
      .catch(() => {});
  }, [user]);

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          total + (answers[index] === question.answer ? 1 : 0),
        0
      ),
    [answers]
  );

  async function handleAuth(e) {
    e.preventDefault();
    setNotice("");

    try {
      const endpoint =
        authMode === "register" ? "/auth/register" : "/auth/login";

      const data = await api(endpoint, {
        method: "POST",
        body: JSON.stringify(authForm)
      });

      localStorage.setItem("techResolveToken", data.token);
      setUser(data.user);
      setNotice(`Welcome, ${data.user.name}!`);

      setAuthForm({
        name: "",
        email: "",
        password: ""
      });

      setPage("home");
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function markComplete(id) {
    const next = [...new Set([...completed, id])];

    setCompleted(next);

    if (user) {
      try {
        await api("/progress", {
          method: "PUT",
          body: JSON.stringify({
            completedModules: [id],
            quizBestScore: bestScore
          })
        });

        setNotice("Your lesson progress has been saved.");
      } catch (err) {
        setNotice(err.message);
      }
    } else {
      setNotice(
        "Lesson marked complete for this session. Sign in to save progress to your account."
      );
    }
  }

  async function saveQuiz() {
    setQuizSubmitted(true);

    const newBest = Math.max(
      bestScore,
      Math.round((score / questions.length) * 100)
    );

    setBestScore(newBest);

    if (user) {
      try {
        await api("/progress", {
          method: "PUT",
          body: JSON.stringify({
            completedModules: [],
            quizBestScore: newBest
          })
        });

        setNotice("Your quiz result has been saved.");
      } catch (err) {
        setNotice(err.message);
      }
    }
  }

  function runCommand(e) {
    e.preventDefault();

    const cmd = command.trim().toLowerCase();

    if (!cmd) return;

    const responses = {
      help:
        "Available simulated commands:\nhelp — list commands\nipconfig — display sample IP configuration\nping — simulate connectivity test\ntracert — show a sample route\nnslookup — simulate a DNS lookup\nclear — clear terminal",

      ipconfig:
        "Windows IP Configuration\n\nIPv4 Address . . . . . : 192.168.1.10\nSubnet Mask . . . . . : 255.255.255.0\nDefault Gateway . . . : 192.168.1.1\nDNS Server . . . . . : 192.168.1.1",

      ping:
        "Pinging 8.8.8.8 with 32 bytes of data:\nReply: simulated response, time=28ms\nReply: simulated response, time=31ms\nPackets: Sent = 2, Received = 2, Lost = 0 (0% loss)\nNote: This is sample output, not a real network test.",

      "ping 8.8.8.8":
        "Pinging 8.8.8.8 with 32 bytes of data:\nReply: simulated response, time=28ms\nReply: simulated response, time=31ms\nPackets: Sent = 2, Received = 2, Lost = 0 (0% loss)\nNote: This is sample output, not a real network test.",

      tracert:
        "Tracing sample route to example.net\n1    192.168.1.1\n2    10.20.0.1\n3    203.0.113.10\nTrace complete (simulated).",

      nslookup:
        "Server: 192.168.1.1\nName: example.com\nAddress: 93.184.216.34\n(Sample educational result.)"
    };

    if (cmd === "clear") {
      setTerminal([]);
    } else {
      setTerminal(previous => [
        ...previous,
        `> ${cmd}`,
        responses[cmd] ||
          "Command not recognised. Type help for the available simulated commands."
      ]);
    }

    setCommand("");
  }

  function logout() {
    localStorage.removeItem("techResolveToken");
    setUser(null);
    setCompleted([]);
    setBestScore(0);
    setNotice("You have signed out.");
    setPage("home");
  }

  const nav = [
    ["home", "Home"],
    ["lessons", "Lessons"],
    ["network", "Network Lab"],
    ["troubleshoot", "Troubleshooting"],
    ["terminal", "Command Simulator"],
    ["quiz", "Quiz"],
    ["account", "Account"]
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => {
            setPage("home");
            setNotice("");
          }}
        >
          <span className="brand-mark">TR</span>
          <span>
            Tech <b>Resolve</b>
            <small>NETWORK LEARNING PLATFORM</small>
          </span>
        </button>

        <nav>
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={page === id ? "nav-link active" : "nav-link"}
              onClick={() => {
                setPage(id);
                setNotice("");
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="user-pill">
          {user ? `Hi, ${user.name.split(" ")[0]}` : "Guest mode"}
        </div>
      </header>

      <main>
        {notice && (
          <div className="notice" role="status">
            <span>{notice}</span>
            <button
              aria-label="Dismiss message"
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}

        {/* HOME PAGE */}
        {page === "home" && (
          <section className="hero">
            <div>
              <div className="eyebrow">
                LEARN • PRACTICE • TROUBLESHOOT
              </div>

              <h1>
                Understand networks.
                <br />
                <span>Resolve problems.</span>
              </h1>

              <p>
                Build practical networking knowledge through clear lessons,
                interactive labs and guided troubleshooting scenarios.
              </p>

              <div className="hero-actions">
                <button
                  className="primary"
                  onClick={() => setPage("lessons")}
                >
                  Start learning →
                </button>

                <button
                  className="secondary"
                  onClick={() => setPage("troubleshoot")}
                >
                  Try a diagnostic lab
                </button>
              </div>

              <div className="hero-stats">
                <div>
                  <b>05</b>
                  <span>Learning modules</span>
                </div>
                <div>
                  <b>03</b>
                  <span>Diagnostic stages</span>
                </div>
                <div>
                  <b>05</b>
                  <span>Quiz questions</span>
                </div>
              </div>
            </div>

            <div
              className="hero-art"
              aria-label="Illustration of connected network devices"
            >
              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>
              <div className="node node-router">
                ROUTER
                <small>192.168.1.1</small>
              </div>
              <div className="node node-laptop">
                LAPTOP
                <small>CLIENT</small>
              </div>
              <div className="node node-cloud">
                INTERNET
                <small>WAN</small>
              </div>
              <div className="link link-a"></div>
              <div className="link link-b"></div>
              <div className="pulse-dot"></div>
            </div>
          </section>
        )}

        {/* LESSONS PAGE */}
        {page === "lessons" && (
          <section className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow">NETWORKING ACADEMY</div>
                <h2>Learning modules</h2>
                <p>Build your foundation one topic at a time.</p>
              </div>

              <span className="count-chip">
                {completed.length}/{lessons.length} completed
              </span>
            </div>

            <div className="lesson-layout">
              <div className="lesson-list">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    className={`lesson-card ${
                      selected.id === lesson.id ? "chosen" : ""
                    }`}
                    onClick={() => setSelected(lesson)}
                  >
                    <span className="lesson-number">
                      0{index + 1}
                    </span>

                    <span>
                      <b>{lesson.title}</b>
                      <small>
                        {lesson.level} · {lesson.duration}
                      </small>
                    </span>

                    <span className="lesson-status">
                      {completed.includes(lesson.id) ? "✓" : "→"}
                    </span>
                  </button>
                ))}
              </div>

              <article className="lesson-detail">
                <div className="eyebrow">
                  {selected.level} MODULE
                </div>

                <h3>{selected.title}</h3>
                <p>{selected.summary}</p>

                <h4>What you will learn</h4>

                <ul>
                  {(selected.topics || []).map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>

                <button
                  className="primary"
                  onClick={() => markComplete(selected.id)}
                  disabled={completed.includes(selected.id)}
                >
                  {completed.includes(selected.id)
                    ? "Completed ✓"
                    : "Mark as completed"}
                </button>
              </article>
            </div>
          </section>
        )}

        {/* NETWORK VISUALIZER */}
        {page === "network" && (
          <section className="section">
            <div className="eyebrow">INTERACTIVE PRACTICE</div>

            <h2>Network visualizer</h2>

            <p className="section-intro">
              Select a device to understand its role in a simple network.
            </p>

            <div className="network-board">
              <div className="device-row">
                <button
                  className={`device ${
                    selectedDevice === "internet" ? "featured" : ""
                  }`}
                  onClick={() => setSelectedDevice("internet")}
                >
                  ☁
                  <b>Internet</b>
                  <small>External network</small>
                </button>
              </div>

              <div className="connector"></div>

              <div className="device-row">
                <button
                  className={`device ${
                    selectedDevice === "router" ? "featured" : ""
                  }`}
                  onClick={() => setSelectedDevice("router")}
                >
                  ⇄
                  <b>Router</b>
                  <small>192.168.1.1</small>
                </button>
              </div>

              <div className="connector"></div>

              <div className="device-row three">
                <button
                  className={`device ${
                    selectedDevice === "switch" ? "featured" : ""
                  }`}
                  onClick={() => setSelectedDevice("switch")}
                >
                  ▤
                  <b>Switch</b>
                  <small>LAN connectivity</small>
                </button>

                <button
                  className={`device ${
                    selectedDevice === "access-point" ? "featured" : ""
                  }`}
                  onClick={() => setSelectedDevice("access-point")}
                >
                  ◉
                  <b>Access Point</b>
                  <small>Wi-Fi</small>
                </button>

                <button
                  className={`device ${
                    selectedDevice === "client" ? "featured" : ""
                  }`}
                  onClick={() => setSelectedDevice("client")}
                >
                  ▣
                  <b>Client PC</b>
                  <small>192.168.1.10</small>
                </button>
              </div>
            </div>

            {selectedDevice && (
              <div className="lesson-detail device-info">
                <div className="eyebrow">DEVICE INFORMATION</div>

                <h3>
                  {
                    networkDevices.find(
                      device => device.id === selectedDevice
                    )?.name
                  }
                </h3>

                <p>
                  {
                    networkDevices.find(
                      device => device.id === selectedDevice
                    )?.description
                  }
                </p>

                <button
                  className="secondary"
                  onClick={() => setSelectedDevice(null)}
                >
                  Close explanation
                </button>
              </div>
            )}
          </section>
        )}

        {/* TROUBLESHOOTING PAGE */}
        {page === "troubleshoot" && (
          <section className="section">
            <div className="eyebrow">GUIDED DIAGNOSTIC LAB</div>

            <h2>No internet connection</h2>

            <p className="section-intro">
              A user says their computer is connected to Wi-Fi, but websites
              are not loading. Work through the three learning stages.
            </p>

            <div className="scenario-card">
              <div className="scenario-progress">
                <span>
                  STEP {scenarioDone ? 3 : scenarioStep + 1} OF 3
                </span>

                <div>
                  <i
                    style={{
                      width: `${
                        scenarioDone
                          ? 100
                          : (scenarioStep / 3) * 100
                      }%`
                    }}
                  ></i>
                </div>
              </div>

              {!scenarioDone ? (
                <>
                  <h3>
                    {
                      [
                        "Identify the problem",
                        "Check the network configuration",
                        "Test and verify the connection"
                      ][scenarioStep]
                    }
                  </h3>

                  <p>
                    {
                      [
                        "Ask when the issue started and whether other devices can access the internet. Check whether Wi-Fi is connected.",
                        "Review the device's IP address, subnet mask, default gateway and DNS settings. Look for missing or unusual values.",
                        "Use appropriate connectivity checks to distinguish a local connection issue from a DNS or upstream issue. Record the result and confirm service is restored."
                      ][scenarioStep]
                    }
                  </p>

                  <div className="scenario-hint">
                    <b>Learning objective</b>
                    <span>
                      {
                        [
                          "Gather evidence before changing settings.",
                          "Check each layer and setting methodically.",
                          "Verify the outcome after a change."
                        ][scenarioStep]
                      }
                    </span>
                  </div>

                  <button
                    className="primary"
                    onClick={() =>
                      scenarioStep === 2
                        ? setScenarioDone(true)
                        : setScenarioStep(step => step + 1)
                    }
                  >
                    {scenarioStep === 2
                      ? "Complete challenge"
                      : "Continue"}{" "}
                    →
                  </button>
                </>
              ) : (
                <div className="success-state">
                  <div className="success-icon">✓</div>

                  <h3>Challenge completed!</h3>

                  <p>
                    You followed all three diagnostic stages.
                  </p>

                  <button
                    className="secondary"
                    onClick={() => {
                      setScenarioStep(0);
                      setScenarioDone(false);
                    }}
                  >
                    Reset simulator
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* COMMAND SIMULATOR */}
        {page === "terminal" && (
          <section className="section">
            <div className="eyebrow">SAFE PRACTICE ENVIRONMENT</div>

            <h2>Command simulator</h2>

            <p className="section-intro">
              Try common networking command names. All output below is
              simulated for learning.
            </p>

            <div className="terminal-window">
              <div className="terminal-top">
                <span></span>
                <span></span>
                <span></span>

                <b>TECH RESOLVE TERMINAL</b>

                <button onClick={() => setTerminal([])}>
                  Clear
                </button>
              </div>

              <pre>{terminal.join("\n\n")}</pre>

              <form
                onSubmit={runCommand}
                className="terminal-input"
              >
                <label>student@tech-resolve:~$</label>

                <input
                  value={command}
                  onChange={event => setCommand(event.target.value)}
                  placeholder="Type help..."
                  aria-label="Simulated command"
                />

                <button type="submit">Run</button>
              </form>
            </div>

            <div className="command-chips">
              {[
                "help",
                "ipconfig",
                "ping",
                "tracert",
                "nslookup",
                "clear"
              ].map(item => (
                <button
                  key={item}
                  onClick={() => setCommand(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* QUIZ PAGE */}
        {page === "quiz" && (
          <section className="section">
            <div className="eyebrow">KNOWLEDGE CHECK</div>

            <h2>Networking quiz</h2>

            <p className="section-intro">
              Choose one answer for each question, then submit to see your
              result.
            </p>

            <div className="quiz-wrap">
              {questions.map((question, index) => (
                <article className="question-card" key={index}>
                  <div className="question-top">
                    <span>QUESTION 0{index + 1}</span>

                    <b>
                      {answers[index] === undefined
                        ? "Not answered"
                        : quizSubmitted
                        ? answers[index] === question.answer
                          ? "Correct"
                          : "Review"
                        : "Answered"}
                    </b>
                  </div>

                  <h3>{question.q}</h3>

                  <div className="options">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`option ${
                          answers[index] === optionIndex
                            ? "selected"
                            : ""
                        } ${
                          quizSubmitted &&
                          optionIndex === question.answer
                            ? "correct"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${index}`}
                          checked={answers[index] === optionIndex}
                          disabled={quizSubmitted}
                          onChange={() =>
                            setAnswers(previous => ({
                              ...previous,
                              [index]: optionIndex
                            }))
                          }
                        />

                        {option}
                      </label>
                    ))}
                  </div>

                  {quizSubmitted && (
                    <p className="explanation">
                      {question.explain}
                    </p>
                  )}
                </article>
              ))}

              <div className="quiz-footer">
                {quizSubmitted ? (
                  <>
                    <b>
                      Your score: {score}/{questions.length} (
                      {Math.round(
                        (score / questions.length) * 100
                      )}
                      %)
                    </b>

                    <button
                      className="secondary"
                      onClick={() => {
                        setAnswers({});
                        setQuizSubmitted(false);
                      }}
                    >
                      Try again
                    </button>
                  </>
                ) : (
                  <button
                    className="primary"
                    onClick={saveQuiz}
                    disabled={
                      Object.keys(answers).length !== questions.length
                    }
                  >
                    Submit answers
                  </button>
                )}

                <small>
                  Best score saved to your account when signed in:{" "}
                  {bestScore}%
                </small>
              </div>
            </div>
          </section>
        )}

        {/* ACCOUNT PAGE */}
        {page === "account" && (
          <section className="section account-section">
            <div className="eyebrow">YOUR LEARNING SPACE</div>

            <h2>
              {user ? "Your account" : "Join Tech Resolve"}
            </h2>

            <p className="section-intro">
              {user
                ? "Your progress is linked to your account."
                : "Create an account to save completed modules and quiz progress."}
            </p>

            {user ? (
              <div className="account-card">
                <div className="avatar">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>

                <h3>{user.name}</h3>
                <p>{user.email}</p>

                <div className="account-stats">
                  <div>
                    <b>{completed.length}</b>
                    <small>Modules completed</small>
                  </div>

                  <div>
                    <b>{bestScore}%</b>
                    <small>Best quiz score</small>
                  </div>
                </div>

                <button className="secondary" onClick={logout}>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="auth-card">
                <div className="auth-tabs">
                  <button
                    className={
                      authMode === "login" ? "active" : ""
                    }
                    onClick={() => setAuthMode("login")}
                  >
                    Sign in
                  </button>

                  <button
                    className={
                      authMode === "register" ? "active" : ""
                    }
                    onClick={() => setAuthMode("register")}
                  >
                    Create account
                  </button>
                </div>

                <form onSubmit={handleAuth}>
                  {authMode === "register" && (
                    <label>
                      Full name

                      <input
                        required
                        value={authForm.name}
                        onChange={event =>
                          setAuthForm({
                            ...authForm,
                            name: event.target.value
                          })
                        }
                        placeholder="Your name"
                      />
                    </label>
                  )}

                  <label>
                    Email address

                    <input
                      type="email"
                      required
                      value={authForm.email}
                      onChange={event =>
                        setAuthForm({
                          ...authForm,
                          email: event.target.value
                        })
                      }
                      placeholder="you@example.com"
                    />
                  </label>

                  <label>
                    Password

                    <input
                      type="password"
                      required
                      minLength="8"
                      value={authForm.password}
                      onChange={event =>
                        setAuthForm({
                          ...authForm,
                          password: event.target.value
                        })
                      }
                      placeholder="At least 8 characters"
                    />
                  </label>

                  <button className="primary full" type="submit">
                    {authMode === "register"
                      ? "Create account"
                      : "Sign in"}
                  </button>
                </form>

                <small>
                  Passwords are hashed on the server. Never reuse an
                  important password here.
                </small>
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <div className="footer-brand">
          Tech <b>Resolve</b>
        </div>

        <p>
          Learn networking concepts through safe, guided simulations.
        </p>

        <small>
          © {new Date().getFullYear()} Tech Resolve · Educational project
        </small>
      </footer>
    </div>
  );
}

export default App;
