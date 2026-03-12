import { BloodRequestForm } from '../components/forms/BloodRequestForm';

export function RequestPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-text mb-6">Request Blood</h1>
        <BloodRequestForm />
      </div>
    </main>
  );
}
