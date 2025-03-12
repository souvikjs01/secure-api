import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className=' h-screen w-full justify-center items-center flex'>
      <SignIn />
    </div>
  )
}