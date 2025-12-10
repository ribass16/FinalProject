import { useEffect, useState } from "react";
import { subscribeAutomoveis } from "../services/firestoreService";
import CarCard from "../components/CarCard";

const Cars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeAutomoveis((allCars) => {
      setCars(allCars);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Carros</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Cars;
