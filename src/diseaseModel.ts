import type { Patient } from "./types";
import type { SimulationParameters } from "./types";

export const createPopulation = (size = 1600) => {
  const population: Patient[] = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};

const getExposures = (
  patient: Patient,
  population: Patient[],
  distanceThreshold: number
): Patient[] => {
  return population.filter((p) => {
    if (p.id === patient.id) {
      return false; // ignore ourself...
    } else if (!p.infected) {
      return false; // if you aren't sick, we don't care :-)
    } else {
      // distance formula (pythagorean theorem...)
      let distance = Math.sqrt(
        Math.pow(p.x - patient.x, 2) + Math.pow(p.y - patient.y, 2)
      );
      if (distance < distanceThreshold) {
        return true;
      }
    }
  });
};

const movePatient = (patient: Patient, movementAmount: number): void => {
  // Let's move our patient slightly...
  patient.x += Math.random() * movementAmount * 2 - movementAmount;
  patient.y += Math.random() * movementAmount * 2 - movementAmount;
  // enforce edges
  if (patient.x < 0) patient.x *= -1; // bounce
  if (patient.x > 100) patient.x = 100 - (patient.x - 100); // bounce;
  if (patient.y < 0) patient.y *= -1; // bounce
  if (patient.y > 100) patient.y = 100 - (patient.y - 100); // bounce
};

const updatePatient = (
  patient: Patient,
  population: Patient[],
  params: SimulationParameters
): Patient => {
  const DISTANCE_THRESHOLD = 5;
  let updatedPatient = { ...patient };
  // IF we are NOT sick, see if our neighbors are sick...
  if (!patient.infected) {
    let sickNeighbors = getExposures(
      patient,
      population,
      params.distanceThreshold
    );
    if (sickNeighbors.length) {
      // If we have sick neighbors, each one has a chance to infect us
      let infected = false;
      for (let i = 0; i < sickNeighbors.length; i++) {
        // once per sick neighbor, have a chance to get infected...
        if (Math.random() * 100 < params.infectionChance) {
          infected = true;
        }
      }
      updatedPatient = { ...patient, infected };
    }
  }
  movePatient(updatedPatient, params.movement);
  return updatedPatient;
};

export const updatePopulation = (
  population: Patient[],
  params: SimulationParameters
): Patient[] => {
  // Run updatePatient once per patient to create *new* patients for new round.
  return population.map((patient) =>
    updatePatient(patient, population, params)
  );
};
