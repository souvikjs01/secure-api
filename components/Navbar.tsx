'use client'
import React from 'react'
import { SignedOut, useAuth } from '@clerk/nextjs'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Navbar() {
  const { isSignedIn, signOut } = useAuth()
  return (
    <div className='flex py-5 items-center justify-between max-w-5xl mx-auto'>
      <div className=' text-2xl'>
        <h1 className='font-bold'>
            Secure<span className=' text-blue-400'>API</span>
        </h1>
      </div>

      <div>
        {isSignedIn ? (
            <Button 
                onClick={ async() => {
                    await signOut()
                }}
            >
                Log Out
            </Button>
        ) : (
            <Button asChild>
                <Link href='/sign-in'>Sign In</Link>
            </Button>
        )}
      </div>
    </div>
  )
}
