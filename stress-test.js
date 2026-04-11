import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
console.log('🧪 Cricket Overlay Controller - Stress Test');
console.log('==========================================\n');

const socket = io(SOCKET_URL);

let testsPassed = 0;
let testsFailed = 0;
let currentState = null;

// Test helper functions
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logTest = (testName, passed, details = '') => {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}`);
  if (details) console.log(`   ${details}`);
  if (passed) testsPassed++;
  else testsFailed++;
};

// Track state changes
socket.on('stateUpdate', (state) => {
  currentState = state;
});

socket.on('connect', () => {
  console.log('🔗 Connected to server\n');
  runTests();
});

socket.on('disconnect', () => {
  console.log('\n🔌 Disconnected from server');
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  process.exit(testsFailed > 0 ? 1 : 0);
});

async function runTests() {
  await wait(500); // Wait for initial state

  console.log('🏏 Starting Stress Tests...\n');

  // Test 1: Initial state
  logTest('Initial state loaded', currentState !== null, `Score: ${currentState?.score}/${currentState?.wickets}`);

  // Test 2: Single run
  socket.emit('addBall', { type: 'run', value: 1 });
  await wait(100);
  logTest('Single run (1 run)', currentState?.score === 1, `Score: ${currentState?.score}/${currentState?.wickets}, Balls: ${currentState?.balls}`);

  // Test 3: Boundary (4 runs)
  socket.emit('addBall', { type: 'run', value: 4 });
  await wait(100);
  logTest('Boundary (4 runs)', currentState?.score === 5, `Score: ${currentState?.score}/${currentState?.wickets}, LastEvent: ${currentState?.lastEvent}`);
  const totalFours = (currentState?.batsman1?.fours || 0) + (currentState?.batsman2?.fours || 0);
  logTest('Four tracked correctly', totalFours === 1, `Total fours: ${totalFours}`);

  // Test 4: Six (6 runs)
  socket.emit('addBall', { type: 'run', value: 6 });
  await wait(100);
  logTest('Six (6 runs)', currentState?.score === 11, `Score: ${currentState?.score}/${currentState?.wickets}, LastEvent: ${currentState?.lastEvent}`);
  const totalSixes = (currentState?.batsman1?.sixes || 0) + (currentState?.batsman2?.sixes || 0);
  logTest('Six tracked correctly', totalSixes === 1, `Total sixes: ${totalSixes}`);

  // Test 5: Dot ball
  socket.emit('addBall', { type: 'run', value: 0 });
  await wait(100);
  logTest('Dot ball', currentState?.score === 11, `Score: ${currentState?.score}/${currentState?.wickets}, Balls: ${currentState?.balls}`);

  // Test 6: Wicket
  socket.emit('addBall', { type: 'wicket' });
  await wait(100);
  logTest('Wicket', currentState?.wickets === 1, `Score: ${currentState?.score}/${currentState?.wickets}, Fall of wickets: ${currentState?.fallOfWickets?.length}`);
  logTest('Partnership reset', currentState?.partnership?.runs === 0, `Partnership: ${currentState?.partnership?.runs} runs`);

  // Test 7: Wide
  const scoreBeforeWide = currentState?.score;
  socket.emit('addBall', { type: 'wide' });
  await wait(100);
  logTest('Wide (no ball counted)', currentState?.balls === 5, `Balls: ${currentState?.balls} (should be 5)`);
  logTest('Wide adds to score', currentState?.score === scoreBeforeWide + 1, `Score increased by 1`);
  logTest('Wide tracked in extras', currentState?.extras?.wides > 0, `Wides: ${currentState?.extras?.wides}`);

  // Test 8: No ball
  const scoreBeforeNoBall = currentState?.score;
  socket.emit('addBall', { type: 'noball' });
  await wait(100);
  logTest('No ball (no ball counted)', currentState?.balls === 5, `Balls: ${currentState?.balls} (should still be 5)`);
  logTest('No ball adds to score', currentState?.score === scoreBeforeNoBall + 1, `Score increased by 1`);

  // Test 9: Bye
  socket.emit('addBall', { type: 'bye', value: 2 });
  await wait(100);
  logTest('Bye (2 runs)', currentState?.extras?.byes === 2, `Byes: ${currentState?.extras?.byes}`);

  // Test 10: Leg bye
  socket.emit('addBall', { type: 'legbye', value: 1 });
  await wait(100);
  logTest('Leg bye (1 run)', currentState?.extras?.legByes === 1, `Leg byes: ${currentState?.extras?.legByes}`);

  // Test 11: Check state after over completed
  logTest('After over completion', currentState?.overs === 1 && currentState?.balls === 1, `Overs: ${currentState?.overs}.${currentState?.balls}`);
  logTest('This over started fresh', currentState?.thisOver?.length === 1, `This over length: ${currentState?.thisOver?.length}`);

  // Test 12: Run out
  const wicketsBeforeRunOut = currentState?.wickets;
  socket.emit('addBall', { type: 'runout' });
  await wait(100);
  logTest('Run out', currentState?.wickets === wicketsBeforeRunOut + 1, `Wickets: ${currentState?.wickets}`);

  // Test 13: Bowler stats - balls count
  const bowlerBallsBefore = currentState?.bowler?.balls;
  socket.emit('addBall', { type: 'run', value: 2 });
  await wait(100);
  logTest('Bowler balls increment', currentState?.bowler?.balls === bowlerBallsBefore + 1, `Bowler balls: ${currentState?.bowler?.balls}`);

  // Test 14: Bowler stats - runs
  const bowlerRunsBefore = currentState?.bowler?.runs;
  socket.emit('addBall', { type: 'run', value: 3 });
  await wait(100);
  logTest('Bowler runs increment', currentState?.bowler?.runs === bowlerRunsBefore + 3, `Bowler runs: ${currentState?.bowler?.runs}`);

  // Test 15: Bowler stats - wickets
  socket.emit('addBall', { type: 'wicket' });
  await wait(100);
  logTest('Bowler wickets increment', currentState?.bowler?.wickets > 0, `Bowler wickets: ${currentState?.bowler?.wickets}`);

  // Test 16: Bowler stats on bye (should increment balls but not runs)
  const bowlerRunsBeforeBye = currentState?.bowler?.runs;
  const bowlerBallsBeforeBye = currentState?.bowler?.balls;
  socket.emit('addBall', { type: 'bye', value: 1 });
  await wait(100);
  // Note: This bye completes the over, so bowler.balls resets to 0
  logTest('Bowler stats on bye - balls (over completed)', currentState?.bowler?.balls === 0, `Bowler balls: ${currentState?.bowler?.balls} (reset after over)`);
  logTest('Bowler stats on bye - no runs', currentState?.bowler?.runs === bowlerRunsBeforeBye, `Bowler runs unchanged: ${currentState?.bowler?.runs}`);

  // Test 17: Multiple consecutive boundaries
  socket.emit('addBall', { type: 'run', value: 4 });
  await wait(50);
  socket.emit('addBall', { type: 'run', value: 4 });
  await wait(50);
  socket.emit('addBall', { type: 'run', value: 6 });
  await wait(50);
  socket.emit('addBall', { type: 'run', value: 6 });
  await wait(100);
  logTest('Consecutive boundaries', currentState?.lastEvent === 'six', `Last event: ${currentState?.lastEvent}`);

  // Test 18: Undo functionality
  const scoreBeforeUndo = currentState?.score;
  const wicketsBeforeUndo = currentState?.wickets;
  socket.emit('undoLast');
  await wait(100);
  logTest('Undo last ball', currentState?.score !== scoreBeforeUndo || currentState?.wickets !== wicketsBeforeUndo, 'State changed after undo');

  // Test 19: Update state
  socket.emit('updateState', { status: 'Drinks Break' });
  await wait(100);
  logTest('Update state - status', currentState?.status === 'Drinks Break', `Status: ${currentState?.status}`);

  // Test 20: Reset match
  const scoreBeforeReset = currentState?.score;
  socket.emit('resetMatch');
  await wait(200);
  logTest('Reset match - score', currentState?.score === 0, `Score reset to 0/${currentState?.wickets}`);
  logTest('Reset match - overs', currentState?.overs === 0 && currentState?.balls === 0, `Overs reset to 0.0`);
  logTest('Reset match - bowler', currentState?.bowler?.overs === 0 && currentState?.bowler?.runs === 0, `Bowler reset: ${currentState?.bowler?.overs}.${currentState?.bowler?.balls}, ${currentState?.bowler?.runs} runs`);
  logTest('Reset match - batsmen', currentState?.batsman1?.runs === 0 && currentState?.batsman2?.runs === 0, `Batsmen reset`);

  // Test 21: Rapid ball entries (stress test)
  console.log('\n🚀 Running rapid ball entry stress test...');
  const rapidTestCount = 20;
  const scoreBeforeRapid = currentState?.score;
  for (let i = 0; i < rapidTestCount; i++) {
    socket.emit('addBall', { type: 'run', value: i % 7 }); // Mix of 0-6 runs
  }
  await wait(500);
  const expectedRuns = Array.from({length: rapidTestCount}, (_, i) => i % 7).reduce((a, b) => a + b, 0);
  logTest(`Rapid ${rapidTestCount} ball entries`, currentState?.score === scoreBeforeRapid + expectedRuns, `Score: ${currentState?.score}/${currentState?.wickets}`);

  // Test 22: Multiple wides in a row (should not increment balls)
  const scoreBeforeWides = currentState?.score;
  const ballsBeforeWides = currentState?.balls;
  socket.emit('addBall', { type: 'wide' });
  await wait(50);
  socket.emit('addBall', { type: 'wide' });
  await wait(50);
  socket.emit('addBall', { type: 'wide' });
  await wait(100);
  logTest('Multiple wides', currentState?.score === scoreBeforeWides + 3 && currentState?.balls === ballsBeforeWides, `Score: ${currentState?.score}, Balls: ${currentState?.balls} (unchanged)`);

  // Test 23: Innings change
  socket.emit('updateState', {
    tossWinner: 1,
    tossDecision: 'bat',
    tossCompleted: true
  });
  await wait(100);
  socket.emit('updateState', { innings: 2 });
  await wait(200);
  logTest('Innings change - team1 saved', currentState?.team1Score > 0, `Team 1 score: ${currentState?.team1Score}/${currentState?.team1Wickets}`);
  logTest('Innings change - current reset', currentState?.score === 0, `Current score reset to 0/${currentState?.wickets}`);

  // Test 24: Target calculation
  logTest('Target set', currentState?.target === currentState?.team1Score + 1, `Target: ${currentState?.target}`);
  logTest('Chasing mode', currentState?.isChasing === true, `Is chasing: ${currentState?.isChasing}`);

  // Final reset
  socket.emit('resetMatch');
  await wait(200);

  console.log('\n✅ All tests completed!');
  console.log('Disconnecting...');

  setTimeout(() => {
    socket.disconnect();
  }, 500);
}
