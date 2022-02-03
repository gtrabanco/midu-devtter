import AppLayout from "components/AppLayout";
import Link from "next/link"

export default function Timeline({username}) {
  return (
    <>
      <AppLayout>
        <h1>This is the timeline of {username}</h1>
        <Link href='/'>
          <a>
            Go Home
          </a>
        </Link>
      </AppLayout>
      <style jsx>{`
        h1 {
          font-size: 36px;
          color: red;
        }
      `}</style>
    </>
  )
}