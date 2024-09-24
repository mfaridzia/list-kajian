import DataDisplay from './components/DataDisplay';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
          List Kajian di Lombok
        </h1>
        <DataDisplay />
      </div>
    </main>
  );
}
