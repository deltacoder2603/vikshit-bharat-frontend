import React, { useState } from 'react';
import { api } from '../utils/api';

const BackendTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testHealthCheck = async () => {
    try {
      addResult('Testing health check...');
      addResult(`Backend URL: https://vikshit-bharat-backend.vercel.app/health`);
      const result = await api.healthCheck();
      addResult(`✅ Health check successful: ${JSON.stringify(result)}`);
    } catch (error) {
      addResult(`❌ Health check failed: ${error.message}`);
      console.error('Health check error:', error);
    }
  };

  const testLogin = async () => {
    try {
      addResult('Testing login...');
      addResult(`Backend URL: https://vikshit-bharat-backend.vercel.app/api/users/login`);
      const result = await api.login('admin@example.com', 'admin123');
      addResult(`✅ Login successful: ${result.user.name} (${result.user.role})`);
    } catch (error) {
      addResult(`❌ Login failed: ${error.message}`);
      console.error('Login error:', error);
    }
  };

  const testGetProblems = async () => {
    try {
      addResult('Testing get problems...');
      addResult(`Backend URL: https://vikshit-bharat-backend.vercel.app/api/admin/problems`);
      const result = await api.getAllProblems();
      addResult(`✅ Get problems successful: ${result.problems.length} problems found`);
    } catch (error) {
      addResult(`❌ Get problems failed: ${error.message}`);
      console.error('Get problems error:', error);
    }
  };

  const testBasicFetch = async () => {
    try {
      addResult('Testing basic fetch...');
      addResult(`Testing: https://httpbin.org/get`);
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Basic fetch successful: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        addResult(`❌ Basic fetch failed: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Basic fetch failed: ${error.message}`);
      console.error('Basic fetch error:', error);
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addResult('🚀 Starting backend integration tests...');
    
    await testBasicFetch();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testHealthCheck();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testLogin();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testGetProblems();
    
    addResult('🏁 All tests completed!');
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backend Integration Test</h1>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={runAllTests}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Running Tests...' : 'Run All Tests'}
        </button>
        
        <button
          onClick={testHealthCheck}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Test Health Check
        </button>
        
        <button
          onClick={testLogin}
          disabled={isLoading}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Test Login
        </button>
        
        <button
          onClick={testGetProblems}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Test Get Problems
        </button>
        
        <button
          onClick={testBasicFetch}
          disabled={isLoading}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Test Basic Fetch
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Test Results:</h2>
        <div className="space-y-1">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Backend URL:</h3>
        <code className="text-sm">https://vikshit-bharat-backend.vercel.app</code>
      </div>
    </div>
  );
};

export default BackendTest;
