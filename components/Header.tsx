import Image from 'next/image'
import React from 'react'
import { ChevronDownIcon, HomeIcon, SearchIcon, MenuIcon } from '@heroicons/react/solid'
import { BellIcon, ChatIcon, GlobeIcon, PlusIcon, SparklesIcon, SpeakerphoneIcon, VideoCameraIcon } from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

function Header() {
  const { data: session} = useSession();

  return (
    <div className='sticky top-0 z-50 flex bg-white px-4 py-[6px] shadow-sm items-center'>
      <Link href='/'>
        <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
          <Image 
            priority
            objectFit='contain'
            src="/Reddit_logo_new.png" 
            layout='fill' />
        </div>
      </Link>
      <div className='flex items-center mx-7 xl:min-w-[300px]'>
        <HomeIcon className='h-5 w-5'/>
        <p className='ml-2 hidden flex-1 lg:inline'>Home</p>
        <ChevronDownIcon className='h-5 w-5'/>
      </div>

      <form className='flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-1'>
        <SearchIcon className='h-6 w-6 text-gray-400'/>
        <input 
          type="text" 
          className='flex-1 bg-transparent outline-none'
          placeholder='Search Reddit'
        />
        <button type='submit' hidden/>
      </form>

      <div className='mx-5 hidden items-center space-x-2 text-gray-500 lg:inline-flex'>
        <SparklesIcon className='icon'/>
        <GlobeIcon className='icon'/>
        <VideoCameraIcon className='icon'/>
        <hr className='h-10 border border-gray-100'/>
        <ChatIcon className='icon'/>
        <BellIcon className='icon'/>
        <PlusIcon className='icon'/>
        <SpeakerphoneIcon className='icon'/>
      </div>
      <div className='ml-5 flex items-center lg:hidden'>
        <MenuIcon className='icon'/>
      </div>

      {/* Sign in/Sign out Button  */}
      {session ? (
        <div onClick={() => signOut()} className='hidden lg:flex items-center space-x-2 cursor-pointer border border-gray-100 px-2'>
          <div className='relative h-5 w-5 flex-shrink-0'>
            <Image 
              objectFit='contain'
              layout='fill'
              src="https://links.papareact.com/23l" 
              alt="" />
          </div>

          <div className='flex-1 text-xs'>
            <p className='truncate'>{session?.user?.name}</p>
            <p className='text-gray-400'>1 Karma</p>
          </div>
          <ChevronDownIcon className='h-5 flex-shrink-0 text-gray-400'/>
        </div>
      ): (
        <div onClick={() => signIn()} className='hidden lg:flex items-center space-x-2 cursor-pointer border border-gray-100 p-2'>
          <div className='relative h-5 w-5 flex-shrink-0'>
            <Image 
              objectFit='contain'
              layout='fill'
              src="https://links.papareact.com/23l" 
              alt="" />
          </div>
          <p className='text-gray-400'>Sign In</p>
      </div>
      )
    }
    </div>
  )
}

export default Header