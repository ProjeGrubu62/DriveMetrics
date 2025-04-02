interface VehicleImages {
  [brand: string]: {
    [model: string]: {
      [year: number]: string;
    };
  };
}

export const vehicleImages: VehicleImages = {
  Toyota: {
    Corolla: {
      2024: '/images/vehicles/toyota/corolla/2024.jpg',
      2023: '/images/vehicles/toyota/corolla/2023.jpg',
      2022: '/images/vehicles/toyota/corolla/2022.jpg',
      // Add more years as needed
    }
  }
};

export function getVehicleImage(brand: string, model: string, year: number): string {
  try {
    return vehicleImages[brand]?.[model]?.[year] || '/images/vehicles/default-car.jpg';
  } catch {
    return '/images/vehicles/default-car.jpg';
  }
}