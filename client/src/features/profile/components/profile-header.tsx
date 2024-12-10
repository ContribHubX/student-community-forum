import { User } from '@/types'
import { CalendarDays, MapPin, Briefcase } from 'lucide-react'

interface ProfileHeaderProp {
    user: User
}

export const ProfileHeader = ({ user }: ProfileHeaderProp) => { 
  return (
    <div className="bg-primary text-primary-foreground shadow rounded-lg overflow-hidden">
      <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 "></div>
      <div className="px-4 py-5 sm:px-6 -mt-16 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-5">
        <img
          className="h-24 w-24 rounded-full ring-4 ring-white bg-white object-cover"
          src={user.attachment || '/placeholder.svg?height=96&width=96'}
          alt={user.name}
        />
        <div className="text-center sm:text-left text-primary-foreground">
          <h1 className="text-2xl font-bold ">{user.name}</h1>
          <p className="text-sm font-medium text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="border-t dark:border-gray-600 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <CalendarDays className="mr-1 h-5 w-5 text-gray-400" />
              Joined
            </dt>
            <dd className="mt-1 text-sm text-primary-foreground">{user.createdAt?.toDateString()}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="mr-1 h-5 w-5 text-gray-400" />
              Location
            </dt>
            <dd className="mt-1 text-sm text-primary-foreground">University of Example</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Briefcase className="mr-1 h-5 w-5 text-gray-400" />
              Major
            </dt>
            <dd className="mt-1 text-sm text-primary-foreground">Computer Science</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

