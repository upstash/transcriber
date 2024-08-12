'use client'

import { useToast } from '@/components/ui/use-toast'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { LoaderCircle, RotateCw, Upload } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Page() {
  const { toast } = useToast()
  const { isSignedIn } = useUser()
  const [audios, setAudios] = useState<any[]>([])
  const fetchAudios = (start = 0) => {
    if (start === 0) setAudios([])
    fetch('/api/history?start=' + start)
      .then((res) => res.json())
      .then((res) => {
        setAudios((existingAudios) => [...existingAudios, ...res])
        if (res.length === 10) fetchAudios(start + 10)
      })
  }
  useEffect(() => {
    fetchAudios()
  }, [])
  return (
    <div className="mx-auto flex w-full max-w-md flex-col py-8">
      <input
        capture
        type="file"
        id="fileInput"
        className="hidden"
        accept="audio/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (!isSignedIn) {
            toast({
              duration: 2000,
              variant: 'destructive',
              description: 'You are not signed in.',
            })
            return
          }
          const file: File | null | undefined = e.target.files?.[0]
          if (!file) {
            toast({
              duration: 2000,
              variant: 'destructive',
              description: 'No file attached.',
            })
            return
          }
          const reader = new FileReader()
          reader.onload = async (event) => {
            const fileData = event.target?.result
            if (fileData) {
              const presignedURL = new URL('/api/upload', window.location.href)
              presignedURL.searchParams.set('fileName', file.name)
              presignedURL.searchParams.set('contentType', file.type)
              toast({
                duration: 10000,
                description: 'Uploading your file to Cloudflare R2...',
              })
              fetch(presignedURL.toString())
                .then((res) => res.json())
                .then((res) => {
                  const body = new File([fileData], file.name, { type: file.type })
                  fetch(res[0], {
                    body,
                    method: 'PUT',
                  })
                    .then((uploadRes) => {
                      if (uploadRes.ok) {
                        toast({
                          duration: 2000,
                          description: 'Upload to Cloudflare R2 succesfully.',
                        })
                        fetch('/api/schedule', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ fileName: res[1] }),
                        }).then((res) => {
                          fetchAudios()
                          if (res.ok) {
                            toast({
                              duration: 2000,
                              description: 'Scheduled transcription of the audio.',
                            })
                          }
                        })
                      } else {
                        toast({
                          duration: 2000,
                          variant: 'destructive',
                          description: 'Failed to upload to Cloudflare R2.',
                        })
                      }
                    })
                    .catch((err) => {
                      console.log(err)
                      toast({
                        duration: 2000,
                        variant: 'destructive',
                        description: 'Failed to upload to Cloudflare R2.',
                      })
                    })
                })
            }
          }
          reader.readAsArrayBuffer(file)
        }}
      />
      <div className="flex flex-row items-start justify-between">
        <span className="text-xl font-semibold">Transcriber</span>
        <SignedIn>
          <div className="size-[28px] rounded-full bg-black/10">
            <UserButton />
          </div>
        </SignedIn>
      </div>
      {isSignedIn ? (
        <div className="mb-24 flex w-full flex-col">
          {audios.map((audio, key) => (
            <div key={key} className="mt-3 flex flex-col gap-y-3">
              <span className="text-gray-400">
                {key + 1}. {audio.key}
              </span>
              {audio.value.transcribed ? (
                <span className="text-gray-600">{audio.value.transcription}</span>
              ) : (
                <div className="flex flex-row items-center gap-x-1">
                  <LoaderCircle size={16} className="animate-spin text-gray-600" />
                  <span className="text-gray-600">Transcription in progress...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex max-w-max flex-col justify-center">
          <SignedOut>
            <div className="rounded border px-3 py-1 shadow transition duration-300 hover:shadow-md">
              <SignInButton mode="modal">Sign in to use Transcriber &rarr;</SignInButton>
            </div>
          </SignedOut>
        </div>
      )}
      {isSignedIn && (
        <div className="fixed bottom-0 mb-8 flex w-full max-w-max flex-row items-center gap-x-3">
          <button
            onClick={() => {
              const tmp = document.querySelector(`[id="fileInput"]`) as HTMLInputElement
              tmp?.click()
            }}
            className="flex flex-row items-center gap-x-3 rounded border px-5 py-2 text-gray-400 outline-none hover:border-black hover:text-gray-800"
          >
            <Upload className="size-[20px]" />
            <span>Upload Audio</span>
          </button>
          <button
            onClick={() => fetchAudios()}
            className="flex flex-row items-center gap-x-3 rounded border px-5 py-2 text-gray-400 outline-none hover:border-black hover:text-gray-800"
          >
            <RotateCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      )}
    </div>
  )
}
