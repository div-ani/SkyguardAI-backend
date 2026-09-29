/* ==========================================================
   detector.js – anomaly detection (plain JavaScript, no database code).

   >>> To plug in your own ML model, change `classifyReading` below.
       It must still return { mean, std, zScore, anomalyType }. <<<
   ========================================================== */
const { DETECTION } = require('../config/sensors');

/**
 * Decides whether `value` is a spike, given the readings that came before it.
 * @param {number} value              the new reading
 * @param {number[]} pastValues       oldest-first values before this one
 * @returns {{mean:number|null, std:number|null, zScore:number, anomalyType:string|null}}
 */
function classifyReading(value, pastValues) {
  const window = pastValues.slice(-DETECTION.DETECTION_WINDOW);
  const result = { mean: null, std: null, zScore: 0, anomalyType: null };

  // Spike check – need enough history first
  if (window.length >= DETECTION.DETECTION_WINDOW) {
    const mean = window.reduce((sum, v) => sum + v, 0) / window.length;
    const variance = window.reduce((sum, v) => sum + (v - mean) ** 2, 0) / window.length;
    const std = Math.max(Math.sqrt(variance), 0.001); // avoid dividing by 0

    result.mean = mean;
    result.std = std;
    result.zScore = (value - mean) / std;
    if (Math.abs(result.zScore) > DETECTION.DEFAULT_THRESHOLD) result.anomalyType = 'spike';
  }

  // Stuck-sensor check – same value repeated many times in a row
  const recent = pastValues.slice(-(DETECTION.STUCK_RUN - 1));
  if (value > 0 && recent.length === DETECTION.STUCK_RUN - 1 && recent.every((v) => v === value)) {
    result.anomalyType = 'stuck';
  }

  return result;
}

/** Turns a z-score / anomaly type into a Low / Medium / High label */
function severityFor(anomalyType, zScore) {
  if (anomalyType === 'stuck') return 'Medium';
  const magnitude = Math.abs(zScore);
  if (magnitude > 6) return 'High';
  if (magnitude > 4.5) return 'Medium';
  return 'Low';
}

module.exports = { classifyReading, severityFor };
