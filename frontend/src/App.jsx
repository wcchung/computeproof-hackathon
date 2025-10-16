import React, { useState, useEffect } from 'react';
import { Cpu, Clock, CheckCircle, Activity, RefreshCw, ExternalLink } from 'lucide-react';

// Detect deployment environment and use the correct API URL
const getApiUrl = () => {
  const currentHost = window.location.hostname;
  const currentOrigin = window.location.origin;
  
  console.log('🌐 Current host:', currentHost);
  console.log('🌐 Current origin:', currentOrigin);
  
  // Check if we're in a cloud development environment
  if (currentHost.includes('github.dev') || currentHost.includes('app.github.dev')) {
    // In cloud environments, each port has its own subdomain
    // Pattern: https://INSTANCE-PORT.domain
    // Change port 8000 to 3002 for API access
    const apiUrl = currentOrigin.replace(/-8000\./, '-3002.');
    console.log('✅ Cloud environment detected, using:', apiUrl);
    return apiUrl;
  }
  
  console.log('💻 Local development, using: http://localhost:3002');
  return 'http://localhost:3002';
};

const API_URL = getApiUrl();
console.log('🔧 Final API URL:', API_URL);

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobHistory, setJobHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/jobs`);
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  const fetchJobHistory = async (jobNid) => {
    setLoading(true);
    try {
      // Instead of calling /history endpoint, just get the job from the jobs list
      const job = jobs.find(j => j.jobNid === jobNid);
      if (job) {
        setJobHistory(job);
        setSelectedJob(jobNid);
      }
    } catch (error) {
      console.error('Error fetching job history:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    return addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <header className="bg-black bg-opacity-50 backdrop-blur-md border-b border-blue-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cpu className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">ComputeProof</h1>
                <p className="text-sm text-gray-400">GPU Job Receipt Dashboard</p>
              </div>
            </div>
            <button onClick={fetchJobs} disabled={loading} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
              <RefreshCw className={`w-4 h-4 \${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black bg-opacity-40 backdrop-blur-md border border-blue-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Jobs</p>
                <p className="text-3xl font-bold text-blue-400">{jobs.length}</p>
              </div>
              <Activity className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-black bg-opacity-40 backdrop-blur-md border border-green-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">On Blockchain</p>
                <p className="text-3xl font-bold text-green-400">
                  {jobs.filter(j => j.events && j.events.length > 0).length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-black bg-opacity-40 backdrop-blur-md border border-purple-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-purple-400">
                  {jobs.reduce((acc, job) => acc + (job.events?.length || 0), 0)}
                </p>
              </div>
              <Clock className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-black bg-opacity-40 backdrop-blur-md border border-blue-500 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-blue-400" />
            GPU Jobs
          </h2>

          {loading && jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No jobs yet. Run <code className="bg-gray-800 px-2 py-1 rounded">./test-complete-lifecycle.sh</code> to create one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.jobNid} className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer" onClick={() => fetchJobHistory(job.jobNid)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-blue-300">{job.jobId}</h3>
                        <span className="px-2 py-1 bg-blue-600 text-xs rounded-full">{job.jobType}</span>
                        <span className="px-2 py-1 bg-green-600 text-xs rounded-full">{job.status}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">NID</p>
                          <p className="font-mono text-xs">{formatAddress(job.jobNid)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Submitted By</p>
                          <p className="font-mono text-xs">{formatAddress(job.submittedBy)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">GPU</p>
                          <p>{job.gpuRequirement?.type} x {job.gpuRequirement?.count}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Events</p>
                          <p className="text-blue-400 font-bold">{job.events?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    <a href={`https://verify.numbersprotocol.io/asset-profile/${job.jobNid}`} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-400 hover:text-blue-300" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedJob && jobHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-blue-500 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-400">Job Execution Log</h2>
                <button onClick={() => { setSelectedJob(null); setJobHistory(null); }} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="p-6">
                {/* Header Info */}
                <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-cyan-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Job ID</p>
                      <p className="font-mono text-cyan-400">{jobHistory.jobId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Job Type</p>
                      <p className="text-green-400 uppercase">{jobHistory.jobType}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-400">Asset NID (Numbers Blockchain)</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-mono text-xs text-blue-300 break-all">{jobHistory.jobNid}</p>
                        <a href={`https://verify.numbersprotocol.io/asset-profile/${jobHistory.jobNid}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex-shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400">GPU Requirement</p>
                      <p className="text-yellow-400">{jobHistory.gpuRequirement?.type} x {jobHistory.gpuRequirement?.count}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className={`uppercase font-semibold ${
                        jobHistory.status === 'completed' ? 'text-green-400' :
                        jobHistory.status === 'running' ? 'text-blue-400' :
                        jobHistory.status === 'scheduled' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>{jobHistory.status}</p>
                    </div>
                  </div>
                </div>

                {/* Terminal-style Event Log */}
                <div className="bg-black bg-opacity-60 rounded-lg p-4 font-mono text-sm border border-green-500">
                  <div className="mb-2 text-green-400">╔════════════════════════════════════════════════════════╗</div>
                  <div className="mb-2 text-green-400">║    GPU Job Receipt - Complete Lifecycle Log           ║</div>
                  <div className="mb-4 text-green-400">╚════════════════════════════════════════════════════════╝</div>
                  
                  {jobHistory.events && jobHistory.events.length > 0 ? (
                    <div className="space-y-3">
                      {/* Job Submitted */}
                      <div className="text-yellow-300">
                        [1/{jobHistory.events.length + 1}] Submitting GPU training job...
                      </div>
                      <div className="text-green-400 ml-4">
                        ✓ Job submitted
                      </div>
                      <div className="text-white ml-6">
                        Job ID: {jobHistory.jobId}
                      </div>
                      <div className="text-white ml-6">
                        Job NID: {jobHistory.jobNid}
                      </div>
                      <div className="text-white ml-6">
                        Asset URL: <a href={`https://verify.numbersprotocol.io/asset-profile/${jobHistory.jobNid}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                          https://verify.numbersprotocol.io/asset-profile/{jobHistory.jobNid}
                        </a>
                      </div>
                      <div className="mb-4"></div>

                      {/* Event Timeline */}
                      {jobHistory.events.map((event, idx) => {
                        const eventNumber = idx + 2;
                        const totalEvents = jobHistory.events.length + 1;
                        
                        let eventTitle = '';
                        let eventDetails = [];
                        
                        switch(event.eventType) {
                          case 'JobScheduled':
                            eventTitle = 'Scheduling job on GPU node...';
                            eventDetails = [
                              `Node: ${event.scheduledNode || 'N/A'}`,
                              `TX Hash: ${event.txHash}`
                            ];
                            break;
                          case 'JobStarted':
                            eventTitle = 'Starting job execution...';
                            eventDetails = [
                              `Executor: ${event.executorNode || 'N/A'}`,
                              `TX Hash: ${event.txHash}`
                            ];
                            break;
                          case 'JobProgressUpdate':
                            eventTitle = 'Updating job progress...';
                            eventDetails = [
                              `Progress: ${event.progress}% (Epoch ${event.currentEpoch}/${event.totalEpochs})`,
                              `TX Hash: ${event.txHash}`
                            ];
                            break;
                          case 'JobCompleted':
                            eventTitle = 'Completing job...';
                            eventDetails = [
                              `Status: ${event.completionStatus || 'success'}`,
                              `Duration: ${event.totalDuration}s`,
                              `GPU Hours: ${event.gpuHoursUsed}`,
                              `TX Hash: ${event.txHash}`
                            ];
                            break;
                          default:
                            eventTitle = event.eventType;
                            eventDetails = [`TX Hash: ${event.txHash}`];
                        }
                        
                        return (
                          <div key={idx}>
                            <div className="text-yellow-300">
                              [{eventNumber}/{totalEvents}] {eventTitle}
                            </div>
                            <div className="text-green-400 ml-4">
                              ✓ {event.eventType.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            {eventDetails.map((detail, i) => (
                              <div key={i} className="text-white ml-6">
                                {detail.includes('TX Hash:') ? (
                                  <>
                                    TX Hash: <a href={`https://mainnet.num.network/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                      {event.txHash}
                                    </a>
                                  </>
                                ) : detail}
                              </div>
                            ))}
                            <div className="mb-4"></div>
                          </div>
                        );
                      })}

                      {/* Summary */}
                      <div className="border-t border-green-500 pt-4 mt-4">
                        <div className="text-green-400 mb-2">╔════════════════════════════════════════════════════════╗</div>
                        <div className="text-green-400 mb-2">║              Execution Complete - Summary              ║</div>
                        <div className="text-green-400 mb-4">╚════════════════════════════════════════════════════════╝</div>
                        
                        <div className="text-white">
                          <div className="mb-2">Job NID (Asset ID): {jobHistory.jobNid}</div>
                          <div className="mb-2">Blockchain Transactions:</div>
                          {jobHistory.events.map((event, idx) => (
                            <div key={idx} className="ml-4 mb-1">
                              {idx + 1}. {event.eventType}: <a href={`https://mainnet.num.network/tx/${event.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                {event.txHash}
                              </a>
                            </div>
                          ))}
                          <div className="mt-4 mb-2">Verification Links:</div>
                          <div className="ml-4 mb-1">
                            Asset Profile: <a href={`https://verify.numbersprotocol.io/asset-profile/${jobHistory.jobNid}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                              https://verify.numbersprotocol.io/asset-profile/{jobHistory.jobNid}
                            </a>
                          </div>
                          <div className="ml-4 mb-1">
                            Mainnet Explorer: <a href="https://mainnet.num.network/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                              https://mainnet.num.network/
                            </a>
                          </div>
                          <div className="mt-4 text-green-400">
                            ✅ All events successfully recorded on Numbers blockchain!
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <div className="text-yellow-300 mb-2">[1/1] Submitting GPU training job...</div>
                      <div className="text-green-400 ml-4 mb-2">✓ Job submitted</div>
                      <div className="text-white ml-6 mb-2">Job ID: {jobHistory.jobId}</div>
                      <div className="text-white ml-6 mb-4">Job NID: {jobHistory.jobNid}</div>
                      <div className="text-gray-500 mt-4">⏳ Waiting for job to be scheduled...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black bg-opacity-50 backdrop-blur-md border-t border-blue-500 mt-12">
        <div className="container mx-auto px-6 py-4 text-center text-gray-400 text-sm">
          <p>Powered by <span className="text-blue-400 font-semibold">Numbers Protocol</span> • Built for FtC RealFi Hackathon</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
