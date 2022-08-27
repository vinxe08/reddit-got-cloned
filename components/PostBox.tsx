import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutation'
import client from '../apollo-client'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = {
  subreddit?: string
}

function PostBox({subreddit}: Props) {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    // Use to re-fetch this HOOK
    refetchQueries: [
      GET_ALL_POSTS,
      'getPostList'
    ]
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)

  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)

  // react-hook-form
  const { register, setValue, handleSubmit, watch, formState:{ errors } } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData)

    // creates a loading/awaiting UI
    const notification = toast.loading('Creating a new post...')

    try {
      // Checks if the subreddit(formData.subreddit) is in DB
      const { data : { getSubredditListByTopic } } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC, // queries.ts
        variables: {
          topic: subreddit || formData.subreddit // params
        }
      })
      // Checks subreddit topic length
      const subredditExist = getSubredditListByTopic.length > 0;

      // Create new subreddit
      if(!subredditExist){
        console.log('Subreddit is new! -> creating a NEW subreddit')

        // insertSubreddit(mutation.ts) : NEW NAME
        const {data: { insertSubreddit : newSubreddit },}  = await addSubreddit({
          variables: {
            topic: formData.subreddit
          }
        })
        const image = formData.postImage || ''

        // Creates Post {insertPost(mutation.tsx) : renamed}
        const {data: { insertPost: newPost } } = await addPost ({
          variables: {
            body: formData.postBody,
            image:image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          }
        })

        console.log('New post added: ', newPost)
      } else {
        console.log('Using existing subreddit!')
        console.log(getSubredditListByTopic)

        const image = formData.postImage || ''

        const {data: { insertPost: newPost } } = await addPost ({
          variables: {
            body: formData.postBody,
            image:image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          }
        })
        console.log('New post added: ', newPost)
      }

      // After the post has been added!
      setValue('postBody', '')// Cleaning the input field
      setValue('postImage', '')// Cleaning the input field
      setValue('postTitle', '')// Cleaning the input field
      setValue('subreddit', '')// Cleaning the input field
      
      toast.success('New Post Created!', {
        id: notification // dismissed .loading and swap to .success
      }) // If it succed
    } catch(error) {
      toast.error('Something went wrong!', {
        id: notification // dismissed .loading and swap to .error
      })
    }
  })

  return (
    <form 
      onSubmit={onSubmit}
      className='sticky top-20 z-50 rounded-md border border-gray-300 bg-white p-2'>
      <div className='flex items-center space-x-3'>
        <Avatar />

        <input 
          {...register('postTitle', { required: true })}
          disabled={!session}
          className='rounded-md flex-1 bg-gray-50 p-2 pl-5 outline-none'
          type='text'
          placeholder={ session ? subreddit ? `Create a post in r/${subreddit}` : 'Create a post by entering a title!' : 'Sign in to post'}
        />

        <PhotographIcon 
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${imageBoxOpen && 'text-blue-300'}`} />
        <LinkIcon className='h-6 text-gray-300'/>
      </div>
      {/* watch: if the postTitle input has typed in ? do/show this */}
      {!!watch('postTitle') && (
        <div className='flex flex-col py-2'>
          {/* BODY */}
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Body:</p>
            <input 
              className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              {...register('postBody')}
              type='text'
              placeholder='Text (Optional)'
              />
          </div>
          {!subreddit && (
          // SUBREDDIT 
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Subreddit</p>
            <input 
              className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              {...register('subreddit', {required: true })}
              type='text'
              placeholder='i.e React JS'
              />
          </div>
          )}
          {/* IMAGE */}
          {imageBoxOpen && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Image URL:</p>
              <input 
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                {...register('postImage')}
                type='text'
                placeholder='Optional...'
                />
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 text-red-500'>
              {errors.postTitle?.type === 'required' && (
                <p>- A Post Title is required</p>
              )}

              {errors.subreddit?.type === 'required' && (
                <p>- A Subreddit is required</p>
              )}
            </div>
          ) }

          {!!watch('postTitle') && (
            <button type='submit' className='w-full rounded-full bg-blue-400 p-2 text-white'>
              Create Post
            </button>
          )}

        </div>
      ) }
    </form>
  )
}

export default PostBox