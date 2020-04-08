/* eslint-disable linebreak-style */

const computeCurrentlyInfected = (reportedCases, multiplier) => (
  reportedCases * multiplier
);

const computeInfectionsByRequestedTime = (currentlyInfected, duration, periodType) => {
  let infectionsByRequestedTime;
  if (periodType === 'days') {
    const factor = Math.floor(duration / 3);
    infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  } else if (periodType === 'months') {
    const factor = Math.floor((duration * 30) / 3);
    infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  } else if (periodType === 'weeks') {
    const factor = Math.floor((duration * 7) / 3);
    infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  }
  return infectionsByRequestedTime;
};
const computeSevereCasesByRequestedTime = (infectionsByRequestedTime) => (
  0.15 * infectionsByRequestedTime
);

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  const iCurrentlyInfected = computeCurrentlyInfected(data.reportedCases, 10);
  const sCurrentlyInfected = computeCurrentlyInfected(data.reportedCases, 50);
  const iInfectionsByRequestedTime = computeInfectionsByRequestedTime(iCurrentlyInfected,
    data.timeToElapse, data.periodType);
  const sInfectionsByRequestedTime = computeInfectionsByRequestedTime(sCurrentlyInfected,
    data.timeToElapse, data.periodType);
  const iSevereCasesByRequestedTime = computeSevereCasesByRequestedTime(iInfectionsByRequestedTime);
  const sSevereCasesByRequestedTime = computeSevereCasesByRequestedTime(sInfectionsByRequestedTime);

  impact.currentlyInfected = iCurrentlyInfected;
  impact.infectionsByRequestedTime = iInfectionsByRequestedTime;
  impact.severeCasesByRequestedTime = iSevereCasesByRequestedTime;
  severeImpact.currentlyInfected = sCurrentlyInfected;
  severeImpact.infectionsByRequestedTime = sInfectionsByRequestedTime;
  severeImpact.severeCasesByRequestedTime = sSevereCasesByRequestedTime;
  return {
    data: { ...data },
    impact: { ...impact },
    severeImpact: { ...severeImpact }
  };
};

export default covid19ImpactEstimator;
