import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon, BeakerIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../config';

const LANGUAGES = [
    { id: 71, name: 'Python (3.8)', slug: 'python' },
    { id: 54, name: 'C++ (GCC 9.2)', slug: 'cpp' },
    { id: 62, name: 'Java (OpenJDK 13)', slug: 'java' },
    { id: 63, name: 'JavaScript (Node.js)', slug: 'javascript' }
];

const getBoilerplate = (langId, slug) => {
    const name = slug.replace(/-/g, '_');
    switch (langId) {
        case 71: return `def ${name}(nums, target):\n    # Write your solution here\n    pass`;
        case 54: return `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Function signature might vary based on problem\n// void ${name}(...) {\n// }`;
        case 62: return `public class Main {\n    public static void solve() {\n        // Write solution\n    }\n}`;
        case 63: return `function ${name}(nums, target) {\n    // Write solution\n}`;
        default: return "";
    }
};

export default function Workspace() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [languageId, setLanguageId] = useState(71); // Default Python
    const [code, setCode] = useState("");
    const [output, setOutput] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [report, setReport] = useState(null); // For final score modal

    const chatEndRef = useRef(null);

    useEffect(() => {
        // Load Problem Details
        fetch(`${API_BASE_URL}/problems/${slug}`)
            .then(res => res.json())
            .then(data => {
                setProblem(data);
                if (data) {
                    setCode(getBoilerplate(languageId, data.slug));
                    // Initial Greeting
                    setChatHistory([{
                        sender: 'ai',
                        text: `Hi! I'm ready to help you with **${data.title}**. Let me know if you get stuck or want to discuss the approach!`
                    }]);
                }
            });
    }, [slug]);

    const handleLanguageChange = (e) => {
        const newLangId = parseInt(e.target.value);
        setLanguageId(newLangId);
        if (problem) {
            setCode(getBoilerplate(newLangId, problem.slug));
        }
    };

    const runCode = async (mode = 'run') => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_code: code,
                    language_id: languageId,
                    problem_slug: problem.slug,
                    mode: mode
                })
            });
            const data = await res.json();

            setOutput(data);

            if (mode === 'submit' && data.success) {
                setReport(data); // only show report on submit
            } else if (mode === 'run' && data.success) {
                // Just keep output in console, don't show modal
            }
        } catch (err) {
            setOutput({ error: "Execution failed." });
        }
        setLoading(false);
    };

    const sendChat = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatInput("");
        setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);

        // RAG Call
        // Build context string from history
        const historyText = chatHistory.map(m => `${m.sender === 'ai' ? 'Tutor' : 'Student'}: ${m.text}`).join('\n');

        try {
            const res = await fetch(`${API_BASE_URL}/viva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_code: userMsg, // Or actual code if in context? User might paste code in chat
                    topic: problem.title, // Pass specific problem title for context retrieval
                    conversation_history: historyText
                })
            });
            const data = await res.json();
            setChatHistory(prev => [...prev, { sender: 'ai', text: data.question }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { sender: 'ai', text: "Connection error. Using offline mode." }]);
        }
    };

    if (!problem) return <div className="text-white p-8">Loading Workspace...</div>;

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Left: Problem Description */}
            <div className="w-1/3 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{problem.title}</h2>
                    <span className={`px-2 py-1 rounded text-xs ${problem.difficulty === 'Easy' ? 'bg-green-900' : 'bg-yellow-900'}`}>{problem.difficulty}</span>
                </div>
                <p className="mb-4 text-gray-300 whitespace-pre-wrap">{problem.description}</p>

                {/* Hints Accordion */}
                <div className="mt-6">
                    <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-semibold mb-2"
                    >
                        <LightBulbIcon className="h-4 w-4 mr-2" /> {showHints ? 'Hide Hints' : 'Show Hints'}
                    </button>
                    {showHints && (
                        <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2 bg-gray-900 p-4 rounded-lg">
                            {problem.hints.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                    )}
                </div>

                {/* Examples */}
                <div className="mt-8">
                    <h3 className="font-semibold mb-2 text-gray-400">Examples</h3>
                    {problem.test_cases.map((tc, i) => (
                        <div key={i} className="mb-3 bg-gray-900 p-3 rounded text-sm font-mono">
                            <div className="text-gray-500">Input: <span className="text-green-400">{tc.input}</span></div>
                            <div className="text-gray-500">Output: <span className="text-blue-400">{tc.output}</span></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle: Code Editor & Output */}
            <div className="w-1/3 flex flex-col border-r border-gray-700">
                <div className="bg-[#1e1e1e] p-2 flex justify-between items-center border-b border-gray-700">
                    <span className="text-gray-400 text-sm pl-2">Source Code</span>
                    <select
                        value={languageId}
                        onChange={handleLanguageChange}
                        className="bg-gray-800 text-white text-sm border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 bg-[#1e1e1e] relative">
                    <textarea
                        className="w-full h-full bg-transparent text-gray-200 font-mono p-4 resize-none focus:outline-none text-sm"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                    />
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        <button
                            onClick={() => runCode('run')}
                            disabled={loading}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg transition-transform hover:scale-105"
                        >
                            {loading ? '...' : <><BeakerIcon className="h-5 w-5 mr-2" /> Run</>}
                        </button>
                        <button
                            onClick={() => runCode('submit')}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center shadow-lg transition-transform hover:scale-105"
                        >
                            {loading ? '...' : <><PaperAirplaneIcon className="h-5 w-5 mr-2" /> Submit</>}
                        </button>
                    </div>
                </div>

                {/* Output Console */}
                <div className="h-48 bg-black p-4 font-mono text-xs overflow-y-auto border-t border-gray-700">
                    <div className="text-gray-500 mb-1">CONSOLE OUTPUT</div>
                    {output?.success ? (
                        <div className="text-green-400">
                            {output.message}
                            <div className="mt-1 text-gray-500">Runtime: {output.runtime}s | Memory: {output.memory}KB</div>
                        </div>
                    ) : output?.error ? (
                        <div className="text-red-400 whitespace-pre-wrap">{output.error}</div>
                    ) : (
                        <div className="text-gray-600 italic">Run execution to see results...</div>
                    )}
                </div>
            </div>

            {/* Right: AI Tutor Chat */}
            <div className="w-1/3 flex flex-col bg-gray-800">
                <div className="p-4 border-b border-gray-700 bg-gray-900/50">
                    <h3 className="font-semibold flex items-center">
                        <span className="bg-blue-500 w-2 h-2 rounded-full mr-2 animate-pulse"></span>
                        AI Copilot
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-gray-700 bg-gray-900">
                    <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-600 focus-within:border-blue-500 transition-colors">
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                            placeholder="Ask about approach, complexity..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                        />
                        <button onClick={sendChat} className="text-blue-400 hover:text-blue-300 ml-2">
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {report && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-800 p-8 rounded-2xl max-w-2xl w-full border border-gray-600 shadow-2xl transform scale-100 transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                Performance Report
                            </h2>
                            <span className="text-5xl font-black text-white">{report.score}<span className="text-2xl text-gray-500">/100</span></span>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-900 p-4 rounded-xl">
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time Complexity</div>
                                <div className="text-green-400 font-mono font-bold text-lg">{report.complexity_label || report.complexity_analysis}</div>
                            </div>
                            <div className="bg-gray-900 p-4 rounded-xl">
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Runtime Status</div>
                                <div className="text-blue-400 font-mono font-bold text-lg">{report.runtime}</div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="font-semibold text-gray-300 mb-2">Editorial Insight</h4>
                            <div className="bg-gray-900/50 p-4 rounded-lg text-sm text-gray-400 italic border-l-4 border-blue-500">
                                "{report.editorial_snippet}"
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setReport(null)}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                            >
                                Close Report
                            </button>
                            <button
                                onClick={() => { setReport(null); navigate('/dashboard/problems'); }}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                Next Problem
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
