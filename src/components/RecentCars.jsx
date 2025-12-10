const RecentCars = ({ cars }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6">
    <h3 className="font-bold mb-4">Últimos carros adicionados</h3>
    <ul className="space-y-3">
      {cars.map((car) => (
        <li key={car.id} className="flex justify-between border-b pb-2">
          <span>{car.brand} {car.model}</span>
          <span>{car.year}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentCars;
