/**
 * Autonomous AI Ad Creative Pipeline - Calculation Subsystem
 * Module: Code by Zapier (JavaScript Runtime Engine)
 * * Input Variables Mapped from Looping Environment:
 * - inputData.videoPlaysRaw : JSON Stringified or Object Array containing platform view breakdown actions
 * - inputData.spend          : Number representing the currency spent on the asset today
 * - inputData.ctr            : Number indicating the link click click-through rate
 */

let rawData = inputData.videoPlaysRaw || '[]';
let totalPlays = 0;
let threeSecViews = 0;
let hookRate = 0;

try {
  // Ensure string arrays are cleanly inflated to JSON objects prior to parsing
  if (typeof rawData === 'string' && rawData.startsWith('[')) {
    rawData = JSON.parse(rawData);
  }
  
  // Extract specific platform interaction tokens out of the data payload matrix
  if (Array.isArray(rawData)) {
    rawData.forEach(action => {
      if (action.action_type === 'video_view') {
        totalPlays = parseFloat(action.value) || 0;
      }
      if (action.action_type === 'three_sec_video_view') {
        threeSecViews = parseFloat(action.value) || 0;
      }
    });
  }
  
  // Apply standard hook retention evaluation rules
  if (totalPlays > 0) {
    hookRate = ((threeSecViews / totalPlays) * 100).toFixed(2);
  }
} catch (error) {
  // Graceful fallback handle to capture and insulate empty or misformed network arrays
}

// Optimization Allocation Gate: Filter assets tracking high spend but low hooks
let spendThreshold = 10; // Minimum spent before flagging budget loss
let hookRateViabilityThreshold = 30.00; // Target viability marker (%)
let needsOptimization = (parseFloat(inputData.spend) > spendThreshold && parseFloat(hookRate) < hookRateViabilityThreshold);

// Map sanitized execution parameters back to the root workflow context
output = {
  totalPlays: totalPlays,
  threeSecViews: threeSecViews,
  hookRate: parseFloat(hookRate) || 0,
  spend: parseFloat(inputData.spend) || 0,
  ctr: parseFloat(inputData.ctr) || 0,
  needsOptimization: needsOptimization
};