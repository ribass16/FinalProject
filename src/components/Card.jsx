const Card = ({ title, value, icon, color }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-lg ${color} text-white flex items-center space-x-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Card;
