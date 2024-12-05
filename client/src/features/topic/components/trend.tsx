import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Newsletter = () => {
  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
      <p className="mb-6">Subscribe to our newsletter for the latest topics and expert insights.</p>
      <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <Input type="email" placeholder="Enter your email" className="bg-white text-black" />
        <Button variant="secondary">Subscribe</Button>
      </form>
    </div>
  )
}


export const TrendingTopics = () => {
  const trendingTopics = [
    "Artificial Intelligence",
    "Sustainable Energy",
    "Quantum Computing",
    "Blockchain",
    "Biotechnology",
    "Space Exploration",
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 text-primary-foreground">
      {trendingTopics.map((topic, index) => (
        <Badge key={index} variant="secondary" className="text-lg py-2 px-4">
          {topic}
        </Badge>
      ))}
    </div>
  )
}



const experts = [
  { name: "Dr. Jane Smith", field: "Artificial Intelligence", avatar: "/experts/jane-smith.jpg" },
  { name: "Prof. John Doe", field: "Quantum Physics", avatar: "/experts/john-doe.jpg" },
  { name: "Dr. Emily Brown", field: "Climate Science", avatar: "/experts/emily-brown.jpg" },
]

export const FeaturedExperts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-primary-foreground">
      {experts.map((expert, index) => (
        <Card key={index} className="dark:border-0 bg-primary">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{expert.name}</CardTitle>
              <p className="text-sm text-gray-500">{expert.field}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


