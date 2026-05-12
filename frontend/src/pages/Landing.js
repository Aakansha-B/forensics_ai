// pages/Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, BarChart2, Brain } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-lg">Forensics AI</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-400 hover:text-white text-sm px-4 py-2">Login</Link>
          <Link to="/register" className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-all">Get Started</Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-8">
          <Brain className="w-4 h-4" />AI-Powered Investigation
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="text-cyan-400">Digital Forensics</span><br/>Investigation Assistant
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Analyze forensic data with AI-powered suspicious content detection, natural language search, and advanced visualization tools.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-lg transition-all flex items-center gap-2">
            Get Started →
          </Link>
          <Link to="/login" className="border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-lg transition-all">
            Investigator Login
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-20 text-left">
          {[
            { icon: Brain, title: 'AI Analysis', desc: 'Automatically detect suspicious patterns, keywords, and behavioral trends' },
            { icon: Search, title: 'Natural Language Search', desc: 'Query forensic data using plain English — no SQL needed' },
            { icon: BarChart2, title: 'Visual Analytics', desc: 'Activity timelines, contact networks, and hourly pattern charts' }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
              <Icon className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}