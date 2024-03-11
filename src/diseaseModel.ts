import type { Patient } from "./types";
import type { SimulationParameters } from "./types";

export const createPopulation = (size = 1600, vaccinationrate = 0) => {
  const population: Patient[] = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
      vaccinated: Math.random()*100 < vaccinationrate
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};




const updatePatient = (
  patient: Patient,
  population: Patient[],
  params: SimulationParameters
): Patient => {
  let updatedPatient = { ...patient };
  // IF we are NOT sick, see if our neighbors are sick...
  // choose a partner
  const partner = population[Math.floor(Math.random() * population.length)];
  if (partner.infected && 100*Math.random() < params.infectionChance) {          
    updatedPatient = { ...patient, infected : true };
  }   
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
