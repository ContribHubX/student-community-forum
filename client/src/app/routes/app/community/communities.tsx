import { useState } from 'react'
import { MainLayout } from "@/components/layouts/layout"
import { CommunityCard } from "@/features/community/components/community-card"
import { communities } from "@/features/shared/data/communities"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, Filter } from 'lucide-react'

export const CommunitiesRoute = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showJoinedOnly, setShowJoinedOnly] = useState(false)
  const isJoin = false;

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!showJoinedOnly || isJoin)
  )

  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-8 max-w-3xl text-primary-foreground">
        <h1 className="text-3xl font-bold text-center mb-8">Explore Communities</h1>

        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Switch
              id="joined-filter"
              checked={showJoinedOnly}
              onCheckedChange={setShowJoinedOnly}
            />
            <Label htmlFor="joined-filter" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Show joined communities only
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCommunities.map((community, index) => (
            <CommunityCard
              key={community.id}
              community={community}
              rank={index + 1}
            />
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No communities found.</p>
        )}
      </section>
    </MainLayout>
  )
}

