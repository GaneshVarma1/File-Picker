import FilePicker from '@/components/file-picker/FilePicker';
import { AuthWrapper } from '@/components/auth/auth-wrapper';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Integrations</h1>
        <AuthWrapper>
          <FilePicker />
        </AuthWrapper>
      </div>
    </main>
  );
}