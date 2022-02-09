import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function StatusPage() {
  const router = useRouter();

  useEffect(() => router.push('/home'));

  return <h1>Redirecting</h1>;
}
