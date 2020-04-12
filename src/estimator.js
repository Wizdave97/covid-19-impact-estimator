/* eslint-disable linebreak-style */
/* eslint-disable max-len */
function floor(v) {
  return (v >= 0 || -1) * Math.floor(Math.abs(v));
}
const computeCurrentlyInfected = (reportedCases, multiplier) => (
  reportedCases * multiplier
);

const computeInfectionsByRequestedTime = (currentlyInfected, duration, periodType) => {
  let infectionsByRequestedTime;
  if (periodType.toLowerCase() === 'days') {
    const factor = Math.floor(duration / 3);
    infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  } else if (periodType.toLowerCase() === 'months') {
    const factor = Math.floor((duration * 30) / 3);
    infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  } else if (periodType.toLowerCase() === 'weeks') {
    const factor = Math.floor((duration * 7) / 3);
    infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  }
  return infectionsByRequestedTime;
};
const computeDollarsInFlight = (infectionsByRequestedTime, data) => {
  let days;
  if (data.periodType.toLowerCase() === 'days') {
    days = data.timeToElapse;
  } else if (data.periodType.toLowerCase() === 'months') {
    days = data.timeToElapse * 30;
  } else if (data.periodType.toLowerCase() === 'weeks') {
    days = data.timeToElapse * 7;
  }
  const dollarsInFlight = (infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / days;
  return dollarsInFlight;
};
const computeSevereCasesByRequestedTime = (infectionsByRequestedTime) => (
  0.15 * infectionsByRequestedTime
);
const computeAvailableBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  // eslint-disable-next-line max-len
  const availableBedsForSevereCases = (0.35 * totalHospitalBeds) - severeCasesByRequestedTime;
  return availableBedsForSevereCases;
};

const percentInfectionsByTime = (infectionsByRequestedTime, percent) => (
  (percent / 100) * infectionsByRequestedTime
);
const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  impact.currentlyInfected = computeCurrentlyInfected(data.reportedCases, 10);
  severeImpact.currentlyInfected = computeCurrentlyInfected(data.reportedCases, 50);
  const infectionsByRequestedTimeI = computeInfectionsByRequestedTime(impact.currentlyInfected,
    data.timeToElapse, data.periodType);
  const severeCasesByRequestedTimeI = computeSevereCasesByRequestedTime(infectionsByRequestedTimeI);
  const infectionsByRequestedTimeS = computeInfectionsByRequestedTime(severeImpact.currentlyInfected,
    data.timeToElapse, data.periodType);
  const severeCasesByRequestedTimeS = computeSevereCasesByRequestedTime(infectionsByRequestedTimeS);

  impact.infectionsByRequestedTime = floor(infectionsByRequestedTimeI);

  impact.severeCasesByRequestedTime = floor(severeCasesByRequestedTimeI);

  severeImpact.infectionsByRequestedTime = floor(infectionsByRequestedTimeS);

  severeImpact.severeCasesByRequestedTime = floor(severeCasesByRequestedTimeS);
  impact.hospitalBedsByRequestedTime = floor(computeAvailableBeds(data.totalHospitalBeds,
    severeCasesByRequestedTimeI));
  severeImpact.hospitalBedsByRequestedTime = floor(computeAvailableBeds(data.totalHospitalBeds,
    severeCasesByRequestedTimeS));
  impact.casesForICUByRequestedTime = floor(percentInfectionsByTime(infectionsByRequestedTimeI, 5));
  severeImpact.casesForICUByRequestedTime = floor(percentInfectionsByTime(
    infectionsByRequestedTimeS, 5
  ));
  impact.casesForVentilatorsByRequestedTime = floor(percentInfectionsByTime(
    infectionsByRequestedTimeI, 2
  ));
  severeImpact.casesForVentilatorsByRequestedTime = floor(percentInfectionsByTime(
    infectionsByRequestedTimeS, 2
  ));
  impact.dollarsInFlight = floor(computeDollarsInFlight(infectionsByRequestedTimeI, data));

  severeImpact.dollarsInFlight = floor(computeDollarsInFlight(infectionsByRequestedTimeS, data));
  return {
    data: { ...data },
    impact: { ...impact },
    severeImpact: { ...severeImpact }
  };
};

export default covid19ImpactEstimator;
