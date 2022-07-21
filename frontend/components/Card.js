export default function Card({ title, value }) {
  return (
    <div className="inline-block p-8 bg-gray-800 text-white rounded-xl text-center">
      <h1 className="text-xl pb-4">{title}</h1>
      <p className="text-3xl">{value}</p>
    </div>
  );
}
