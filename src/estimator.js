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
const computeAvailableBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const fullCapacity = ((90 + 95) / 2) * totalHospitalBeds;
  const availableBeds = totalHospitalBeds - (0.65 * fullCapacity);
  const availableBedsForSevereCases = severeCasesByRequestedTime - (0.35 * availableBeds);
  return availableBedsForSevereCases;
};
const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  impact.currentlyInfected = computeCurrentlyInfected(data.reportedCases, 10);
  impact.infectionsByRequestedTime = computeInfectionsByRequestedTime(impact.currentlyInfected,
    data.timeToElapse, data.periodType);
  // eslint-disable-next-line max-len
  impact.severeCasesByRequestedTime = computeSevereCasesByRequestedTime(impact.infectionsByRequestedTime);
  severeImpact.currentlyInfected = computeCurrentlyInfected(data.reportedCases, 50);
  // eslint-disable-next-line max-len
  severeImpact.infectionsByRequestedTime = computeInfectionsByRequestedTime(severeImpact.currentlyInfected,
    data.timeToElapse, data.periodType);
  // eslint-disable-next-line max-len
  severeImpact.severeCasesByRequestedTime = computeSevereCasesByRequestedTime(severeImpact.infectionsByRequestedTime);
  impact.hospitalBedsByRequestedTime = computeAvailableBeds(data.totalHospitalBeds,
    impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = computeAvailableBeds(data.totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime);

  return {
    data: { ...data },
    impact: { ...impact },
    severeImpact: { ...severeImpact }
  };
};

export default covid19ImpactEstimator;
