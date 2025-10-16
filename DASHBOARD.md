# 📊 Dashboard Guide

Complete guide to using the ComputeProof GPU Job Receipt Dashboard.

## 🚀 Quick Access

### Accessing the Dashboard

**Local Development:**
```
http://localhost:8000
```

The dashboard is served on port 8000 after running `./start-demo.sh`.

---

## ✨ Dashboard Features

### Main Dashboard View

**Job Cards** - Each GPU job displayed as a card with:
- 📛 **Job ID** and blockchain asset NID
- 🎯 **Status Badge** with color coding:
  - 🔵 Blue = Submitted (waiting to be scheduled)
  - 🟡 Yellow = Scheduled (assigned to GPU node)
  - 🟢 Green = Running (actively executing)
  - ✅ Green checkmark = Completed (finished successfully)
- 💻 **GPU Requirements**: Type, count, memory (e.g., "NVIDIA-A100 x 4")
- 📊 **Event Count**: Number of blockchain events recorded
- 🌐 **Verification Link**: Click to view asset on Numbers Protocol

**Auto-Refresh**
- Dashboard updates every 10 seconds automatically
- Manual refresh available with 🔄 button

### Terminal-Style Execution Log

**Click any job card** to see a beautiful terminal-style execution log:

**Features:**
- 📋 **Header with job details**: Job ID, NID, GPU requirements, status
- 🖥️ **Terminal-style output**: Green borders, monospace font, colored text
- 📝 **Step-by-step log**: Shows each event with [1/5], [2/5] format
- 🔗 **Clickable transaction hashes**: All blockchain TXs are links
- 📊 **Progress tracking**: Shows epoch counts, percentages, durations
- ✅ **Summary section**: Complete list of all blockchain transactions
- 🔍 **Verification links**: Direct links to asset profile and explorer

**Example Log View:**
```
╔════════════════════════════════════════════════════════╗
║    GPU Job Receipt - Complete Lifecycle Log           ║
╚════════════════════════════════════════════════════════╝

[1/5] Submitting GPU training job...
✓ Job submitted
  Job ID: gpu-job-hackathon-1760641565
  Job NID: bafkreihzui3...
  Asset URL: https://verify.numbersprotocol.io/asset-profile/...

[2/5] Scheduling job on GPU node...
✓ Job Scheduled
  Node: gpu-node-05
  TX Hash: 0x61c09f75a9e8eac...

[3/5] Starting job execution...
✓ Job Started
  Executor: gpu-node-05
  TX Hash: 0x7ab74a67ed4187f...

[4/5] Updating job progress...
✓ Job Progress Update
  Progress: 50% (Epoch 15/30)
  TX Hash: 0x3b34c961657ba5f...

[5/5] Completing job...
✓ Job Completed
  Status: success
  Duration: 3810s
  GPU Hours: 4.23
  TX Hash: 0x24cbd202b4c286b...

╔════════════════════════════════════════════════════════╗
║              Execution Complete - Summary              ║
╚════════════════════════════════════════════════════════╝

✅ All events successfully recorded on Numbers blockchain!
```

## 🚀 Try It Now!

### View Existing Jobs
1. **Open your dashboard** (should already be open in Simple Browser)
2. **Click the completed job card** (the green one with ✅ status)
3. **See the full terminal-style log** with all blockchain transactions!

### Complete a New Job
Run this command to finish one of the submitted jobs:

```bash
cd /workspaces/computeproof-hackathon

# Complete a specific job
./complete-job.sh bafkreie5kh6cgt7da2afcpo4kdktu2pfvbqv7thrgfqapldihcaq3gfese

# Or run without arguments to see available jobs
./complete-job.sh
```

**Watch the dashboard:**
- Job status will change: submitted → scheduled → running → completed
- Auto-refresh every 10 seconds (or click 🔄 Refresh button)
- Click the card to see the complete log!

### Create Brand New Job
```bash
# Run complete lifecycle test (creates new job with all events)
./test-complete-lifecycle.sh
```

## 📋 Dashboard Features Summary

### Main Dashboard
- ✅ Real-time job cards with status colors
- ✅ GPU requirement badges  
- ✅ Event count indicators
- ✅ Auto-refresh every 10 seconds
- ✅ Manual refresh button
- ✅ Direct links to Numbers Protocol asset verification

### Job Log Modal (Click any card)
- ✅ Complete job metadata (ID, NID, GPU, status)
- ✅ Terminal-style execution log with color-coded output
- ✅ Step-by-step event timeline with progress tracking
- ✅ All blockchain transaction hashes (clickable)
- ✅ Event details (nodes, progress %, epochs, duration, GPU hours)
- ✅ Summary with verification links
- ✅ Color-coded status indicators

### Blockchain Integration
- ✅ Every event recorded on Numbers Protocol blockchain
- ✅ Verifiable asset profiles at https://verify.numbersprotocol.io/
- ✅ Clickable transaction hashes to mainnet explorer
- ✅ Immutable audit trail for all GPU compute

---

## 🧪 Try It Now

### 1. View Existing Jobs
1. **Open your dashboard** at http://localhost:8000
2. **Click any job card** (try the completed one with ✅ status)
3. **See the full terminal-style log** with all blockchain transactions!

### 2. Create a New Complete Job
```bash
cd /workspaces/computeproof-hackathon
./test-complete-lifecycle.sh
```

**Watch the dashboard (auto-refreshes every 10s):**
- New job appears as "submitted" (blue badge)
- Wait for auto-refresh or click 🔄
- Click the card to see complete execution log

### 3. Complete a Partial Job
```bash
# List available jobs
./complete-job.sh

# Complete a specific job
./complete-job.sh <job_nid>
```

**Watch real-time updates:**
- Job status changes: submitted → scheduled → running → completed
- Event count increases with each step
- Click card to see new events appearing in the log

---

## 🔍 Troubleshooting

### Dashboard shows empty/blank page?

**Check browser console (F12)** - You should see:
```
🔧 API URL: http://localhost:3002
```

**If you see errors about CORS or network:**
1. Verify backend is running: `curl http://localhost:3002/health`
2. Check both services are started: `ps aux | grep -E "node|python"`
3. Restart services: `./stop-demo.sh && ./start-demo.sh`

### No jobs appearing?

**Verify backend is running:**
```bash
curl http://localhost:3002/health
# Should return: {"status":"ok","service":"ComputeProof API","version":"1.0.0"}
```

**Check if jobs exist:**
```bash
curl http://localhost:3002/api/jobs | jq '.jobs | length'
# Should show number of jobs
```

**Create a test job:**
```bash
./test-complete-lifecycle.sh
```

### Dashboard not updating?

- **Auto-refresh is 10 seconds** - wait a moment
- **Click the 🔄 refresh button** manually
- **Hard refresh browser**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- **Restart frontend**: `./serve-dashboard.sh`

### Events not showing in job log?

- **Only works for jobs with recorded events**
- **Create a new job**: `./test-complete-lifecycle.sh`
- **Complete an existing submitted job**: `./complete-job.sh`

### Cannot connect to backend?

**Port conflicts:**
```bash
# Check if ports are already in use
lsof -i :3002
lsof -i :8000

# Kill conflicting processes if needed
kill <PID>
```

**Firewall issues:**
- Ensure ports 3002 and 8000 are not blocked
- Check your system firewall settings

---

## 🎯 What You Can See

### Complete Job Lifecycle

1. **Job Submission** 
   - Initial asset registration with unique NID
   - GPU requirements recorded
   - Transaction hash for blockchain commit

2. **Job Scheduling**
   - GPU node assignment  
   - Scheduled node identifier
   - Transaction hash

3. **Job Started**
   - Execution begins
   - Executor node details
   - Container/process IDs
   - Transaction hash

4. **Progress Updates**
   - Real-time training progress
   - Epoch counts (e.g., 15/30)
   - Progress percentage (e.g., 50%)
   - Transaction hash for each update

5. **Job Completion**
   - Final status (success/failure)
   - Total duration and GPU hours
   - Final metrics
   - Transaction hash

**Every single event has a blockchain transaction hash you can verify!**

---

## 🔗 Verification Links

### In the Dashboard

**Job Card 🌐 Icon:**
```
https://verify.numbersprotocol.io/asset-profile/{nid}
```
View the complete blockchain asset with all metadata

**Transaction Hash Links:**
```
https://mainnet.num.network/tx/{txHash}
```
View the actual blockchain transaction

**Mainnet Explorer:**
```
https://mainnet.num.network/
```
Browse all transactions on Numbers Protocol mainnet

### Manual Verification

**Check a specific asset:**
```bash
# Replace with actual NID
https://verify.numbersprotocol.io/asset-profile/bafkreihzui3unrkr43zbmm3bcun3usimslixoszi43qkdln6k36qvvut5a
```

**Check a transaction:**
```bash
# Replace with actual TX hash
https://mainnet.num.network/tx/0x220f82df24da50e9b1ec2fc4c5c45cc16b08de05f0872c4f671b282fae34ddff
```

---

## 💡 Pro Tips

1. **Multiple Jobs**: Run `./test-complete-lifecycle.sh` multiple times to see multiple job cards
2. **Real-time Watching**: Keep dashboard open while running tests to see updates appear
3. **Blockchain Verification**: Click any TX hash to verify it's really on the blockchain
4. **Event Timeline**: The terminal-style log shows exact chronological order of all events
5. **GPU Metrics**: Progress events show actual GPU utilization and memory usage from the job
6. **Status Colors**: Quickly scan job status by color - green checkmark means successfully completed

---

**Your dashboard is production-ready with real blockchain integration! 🎉**

### Main Dashboard
- ✅ Real-time job cards with status colors
- ✅ GPU requirement badges
- ✅ Event count indicators
- ✅ Auto-refresh every 10 seconds
- ✅ Manual refresh button
- ✅ Direct links to Numbers Protocol asset verification

### Job Log Modal (Click any card)
- ✅ Complete job metadata (ID, NID, GPU, status)
- ✅ Terminal-style execution log
- ✅ Step-by-step event timeline with progress tracking
- ✅ All blockchain transaction hashes (clickable)
- ✅ Event details (nodes, progress %, epochs, duration, GPU hours)
- ✅ Summary with verification links
- ✅ Color-coded status indicators

### Blockchain Integration
- ✅ Every event recorded on Numbers Protocol blockchain
- ✅ Verifiable asset profiles
- ✅ Clickable transaction hashes to mainnet explorer
- ✅ C2PA-compatible receipts

## 🎯 What You Can See

1. **Job Submission**: Initial asset registration with NID
2. **Job Scheduling**: GPU node assignment
3. **Job Started**: Execution begins with executor details
4. **Progress Updates**: Real-time training progress with epochs
5. **Job Completion**: Final metrics (duration, GPU hours, status)

All with **clickable blockchain transaction hashes** and **verification links**!

## 🔗 Important URLs

- **Dashboard**: Check PORTS tab → port 8000 → click 🌐
- **Backend API**: Port 3002 (must be publicly accessible)
- **Asset Verification**: https://verify.numbersprotocol.io/asset-profile/{nid}
- **Mainnet Explorer**: https://mainnet.num.network/

---

**Your dashboard is now production-ready with terminal-style logs! 🎉**
